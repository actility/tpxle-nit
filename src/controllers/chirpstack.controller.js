import fetch from 'node-fetch';

import logger from '../logger.js';
import DownlinkDataModel from '../models/downlink-data.model.js';
import { tpxleAuthAsync } from '../middlewares/tpxle-auth.middleware.js';
import { translateUplink, translateDownlink } from '../services/nit-chirpstack.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

export const uplinkFromChirpstackAsync = async (req) => {
  /* ** Check if request body is correct ** */
  const errMsg =
    '(x-access-token or (x-client-id and x-client-secret)), x-downlink-api, x-downlink-apikey in header and devEUI in body are mandatory!';
  let accessToken;
  let clientId;
  let clientSecret;
  let realm;
  let devEUI;
  let downlinkApi;
  let downlinkApikey;
  try {
    accessToken = req.headers['x-access-token'];
    clientId = req.headers['x-client-id'];
    clientSecret = req.headers['x-client-secret'];
    realm = req.headers['x-realm'] || process.env.NIT__DEFAULT_REALM;
    devEUI = Buffer.from(req.body.devEUI, 'base64').toString('hex'); // NS Specific !!!
    downlinkApi = req.headers['x-downlink-api'];
    downlinkApikey = req.headers['x-downlink-apikey'];
  } catch (err) {
    logger.warn(err.stack);
    logger.warn(`UL: ${errMsg}`);
    return;
  }

  if (!devEUI) {
    logger.warn('UL: Missing DevEUI!');
    return;
  }
  if (!process.env.NIT__VALID_REALMS.split(',').includes(realm)) {
    logger.warn('UL: Invalid realm!');
    return;
  }
  if (!((accessToken || (clientId && clientSecret)) && devEUI && downlinkApi && downlinkApikey)) {
    logger.warn(`UL: DevEUI: ${devEUI}: ${errMsg}`);
    return;
  }

  const nitapikey = req.params.nitapikey || 'chirpstack'; // For backward compatibility, we allow not specifying nitapikey in the url!

  logger.debug(`UL: DevEUI: ${devEUI}: UL message received from NS.`);

  /* ** Save downlink data in db ** */
  DownlinkDataModel.setDLData(nitapikey, devEUI, {
    downlinkApi,
    downlinkApikey,
  });

  /* ** Translate message body ** */
  let translatedBody;
  try {
    translatedBody = translateUplink(req.body);
  } catch (err) {
    logger.error(err.stack);
    return;
  }

  // sendToTPXLEAsync(translatedBody, accessToken, clientId, clientSecret, realm);
  try {
    await sendToTPXLEAsync(translatedBody, req.tpxleToken, realm, clientId);
  } catch (err) {
    logger.error(err.stack);
  }
};

export const downlinkToChirpstackAsync = async (req) => {
  /* ** Check if request body is correct ** */
  const devEUI = req.body.deveui?.toLowerCase();
  if (!devEUI) {
    logger.warn(`DL: There is no "deveui" field in request body.`);
    return;
  }

  const nitapikey = req.params.nitapikey || 'chirpstack'; // For backward compatibility, we allow not specifying nitapikey in the url!

  logger.debug(`DL: DevEUI: ${devEUI}: DL message received from TPXLE.`);

  /* ** Translate message body ** */
  let translatedBody;
  try {
    translatedBody = translateDownlink(req.body);
  } catch (err) {
    logger.error(err.stack);
    return;
  }

  /* ** Get downlinkData from DB. ** */
  let downlinkData;
  try {
    downlinkData = await DownlinkDataModel.getDLData(nitapikey, devEUI);
  } catch (err) {
    logger.error(err.stack);
    return;
  }
  if (!downlinkData) {
    logger.warn(`DL: DevEUI: ${devEUI}: DownlinkData does not exists in the db yet.`);
    return;
  }

  /* ** Send downlink frame to NS ** */
  const url = downlinkData.downlinkApi;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${downlinkData.downlinkApikey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(translatedBody),
  };
  logger.debug(`DL: DevEUI: ${devEUI}: Req URL: ${url}; Req options:${JSON.stringify(options)};`);

  let nsRes;
  try {
    nsRes = await fetch(url, options);
  } catch (err) {
    logger.error(err.stack);
    return;
  }
  logger.debug(
    `DL: DevEUI: ${devEUI}: Downlink forwarded to NS. Response status: ${nsRes.status} ${nsRes.statusText}`,
  );

  let nsResText;
  try {
    nsResText = await nsRes.text();
  } catch (err) {
    logger.error(err.stack);
    return;
  }
  if (nsResText) {
    logger.debug(nsResText);
  }
};

export const uplinkFromChirpstack = (req, res) => {
  (async () => {
    let tpxleToken;
    try {
      tpxleToken = await tpxleAuthAsync(req);
    } catch (err) {
      logger.error(`uplinkFromSenet() error: ${err.stack}`);
    }
    req.tpxleToken = tpxleToken;
    try {
      await uplinkFromChirpstackAsync(req);
    } catch (err) {
      logger.error(`uplinkFromSenet() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};

export const downlinkToChirpstack = (req, res) => {
  (async () => {
    try {
      await downlinkToChirpstackAsync(req);
    } catch (err) {
      logger.error(`downlinkToSenet() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};
