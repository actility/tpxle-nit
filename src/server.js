import express, { json } from 'express';
import { stringify } from 'querystring';
import fetch from 'node-fetch';
import { createClient } from 'redis';
import { promisify } from 'util';
import winston from 'winston';
import 'winston-daily-rotate-file';

import { uplink, downlink } from './nit-helium.js';
import { createSecureContext } from 'tls';

const NIT_SERVER_PORT = 8081;
const TPXLE_FEED_URL = "https://dx-api.thingpark.io/location/latest/api/feeds";
const TOKEN_REQUEST_URL = "https://dx-api.thingpark.io/admin/latest/api/oauth/token";


const logger = winston.createLogger({
    level: 'info',
    // format: winston.format.json(),
    format: winston.format.simple(),
    // defaultMeta: { service: 'nit' },
    transports: [
      // new winston.transports.File({ filename: '/var/log/nit/error.log', level: 'error' }),
      // new winston.transports.File({ filename: '/var/log/nit/combined.log', level: 'info' }),
      new winston.transports.DailyRotateFile({
        dirname: '/var/log/nit',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD_HH',
        createSymlink: true,
        symlinkName: 'error-current.log',
        frequency: '3h',
        maxFiles: '2d',
        level: 'error',
      }),
      new winston.transports.DailyRotateFile({
        dirname: '/var/log/nit',
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD_HH',
        createSymlink: true,
        symlinkName: 'info-current.log',
        frequency: '3h',
        maxFiles: '2d',
        level: 'info',
      })
    ],
});
if (process.env.NODE_ENV !== 'prod') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
}

const app = express();

const redis_client = createClient({
    host: 'redis',
    port: 6379,
    // password: '<password>'
});
redis_client.on('error', err => {
    logger.error('Error ' + err);
});
const setAsync = promisify(redis_client.set).bind(redis_client);
const getAsync = promisify(redis_client.get).bind(redis_client);

app.use(json())
app.post('/uplink_from_helium', (req, res) => {

    let devEUI = req.body.dev_eui.toLowerCase();

    logger.info(`UL: DevEUI: ${devEUI}: UL message received from Helium.`);

    setAsync(`helium_downlink_urls:${devEUI}`, req.body.downlink_url)
    .catch(err => logger.error(err))
    .then(redis_save_status => {
        logger.info(`UL: DevEUI: ${devEUI}: Helium downlink URL saved to db.`);
    })

    let translated_body;
    try {
        translated_body = uplink(req.body);
    }
    catch(err) {
        logger.error(err);
        res.status(400).send("invalid request body\n");
        return;
    }

    fetch(
        TOKEN_REQUEST_URL,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: stringify ({
                grant_type: 'client_credentials',
                client_id: req.headers['x-client-id'],
                client_secret: req.headers['x-client-secret']
            })
        }
    )
    .catch(err => logger.error(err))
    .then(res1 => {
        logger.info(`UL: DevEUI: ${devEUI}: Token requested from DX-API. Response status: ${res1.status} ${res1.statusText}`);
        return res1.json()
    })
    .catch(err => logger.error(err))
    .then(json => {
            let authorization_header = 'Bearer ' + json.access_token;
            logger.info(`UL: DevEUI: ${devEUI}: Authorization header received from DX-API`);
            // logger.info(authorization_header);
            return authorization_header;
    })
    .catch(err => logger.error(err))
    .then(authorization_header => {
        logger.info(`UL: DevEUI: ${devEUI}: Message translated for TPXLE`);
        // logger.info(JSON.stringify(translated_body, null, 2));
        return fetch(
            TPXLE_FEED_URL,
            {
                method: 'POST',
                headers: {
                    'Authorization': authorization_header,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(translated_body)
            }
        );
    })
    .catch(err => logger.error(err))
    .then( res2 => {
        logger.info(`UL: DevEUI: ${devEUI}: Message forwarded to TPXLE. Response Status: ${res2.status} ${res2.statusText}`);
        return res2.text();
    })
    .catch(err => logger.error(err))
    .then(text => {
        logger.info(text)
    })

    res.status(200).end();
    return;
    
});

app.post('/downlink_to_helium', (req, res) => {

    let devEUI = req.body.deveui.toLowerCase();

    logger.info(`DL: DevEUI: ${devEUI}: DL message received from TPXLE.`);

    let translated_body;
    try {
        translated_body = downlink(req.body);
    }
    catch(err) {
        logger.error(err);
        res.status(400).send("invalid request body\n");
        return;
    }

    getAsync(`helium_downlink_urls:${devEUI}`)
    .catch(err => logger.error(err))
    .then(helium_downlink_url => {
        logger.info(`DL: DevEUI: ${devEUI}: helium_downlink_url retreived from DB: ${helium_downlink_url}`);
        if (!helium_downlink_url) {
            throw new Error(`DL: DevEUI: ${devEUI}: downlink url for this DevEUI does not exist in the DB yet`);
        }
        return fetch(
            helium_downlink_url,
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(translated_body)
            }
        );
    })
    .catch(err => logger.error(err))
    .then(res1 => {
        logger.info(`DL: DevEUI: ${devEUI}: Downlink forwarded to Helium. Response status: ${res1.status} ${res1.statusText}`);
        return res1.text()
    })
    .catch(err => logger.error(err))
    .then(text => {
        logger.info(text)
    })


    // res.write()
    res.status(200).end();
    return;

});

app.get('/test', (req, res) => {

    logger.info('Test request received on server');
    res.write("The server works\n");
    res.status(200).end();
    return;

});

app.listen(NIT_SERVER_PORT, () => {
  logger.info(`TPXLE NIT is listening at http://localhost:${NIT_SERVER_PORT}`);
});
