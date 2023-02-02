import express, { json } from 'express';

import './config.js';
import logger from './logger.js';

import mqttClientFactory from './mqtt-client.js';

import tpxleNITRouterFactory from './routes/tpxle-nit.router.js';

import mqttAuthVMQRouter from './routes/mqtt-auth-vmq.router.js';

import getConfParam from './config/get-conf-params.js';
import {
  getAPIKeysAsync,
  getAccessTokenAsync,
  createUserIdFromAccessToken,
} from './middlewares/tpxle-auth.middleware.js';

const app = express();

let mqttClient;
if (process.env.NIT__MQTT_ENABLED === 'True') {
  mqttClient = mqttClientFactory();
}

app.use(json());

// Routes

app.use('/', tpxleNITRouterFactory(mqttClient));

app.use('/vmq', mqttAuthVMQRouter);

// test route

app.get('/test', (req, res) => {
  logger.debug('Test request received on server');
  res.write('The server works\n');
  res.status(200).end();
});

app.post('/get-topic', async (req, res) => {
  let accessToken;
  let apiKeys;
  let userId;
  let err;

  const { clientId, clientSecret, architectureId, nsVendor, asId } = req.body;

  try {
    accessToken = await getAccessTokenAsync(clientId, clientSecret, architectureId);
    userId = await createUserIdFromAccessToken(accessToken, req.body.architectureId);
    apiKeys = await getAPIKeysAsync(accessToken, architectureId);
  } catch (e) {
    err = e.message;
    console.log(err);
  }

  const uplinkTopic = `${userId}/NS_LE/${nsVendor}/${asId}`;
  const downlinkTopic = `${userId}/LE_NS/${nsVendor}`;

  const publishedNITURL = getConfParam(architectureId, 'PUBLISHED_NIT_URL');
  const ns2nitURL = `${publishedNITURL}/uplink_from_${nsVendor}/${asId}`;
  const le2nitURL = `${publishedNITURL}/downlink_to_${nsVendor}/${asId}`;
  const le2asURL = `${publishedNITURL}/mqtt/${userId}/LE_AS/${asId}`;

  res.json({ uplinkTopic, downlinkTopic, ns2nitURL, le2nitURL, le2asURL, apiKeys });
  // res.status(200).end();
});

// Error handling

app.use((req, res) => {
  res.status(404).end();
  // next(httpError(404));
});

app.use((err, req, res) => {
  // if (httpError.isHttpError(err)) {
  //   res.status(err.statusCode).send(err.message);
  //   return;
  // }
  logger.error(`express error handler: ${err.message}`);
  res.sendStatus(200).end();
  // res.status(404).end();
});

// Start server

const server = app.listen(process.env.NIT__SERVER_PORT, () => {
  const address = server.address();
  logger.info(`TPXLE NIT is listening at ${address.address}:${address.port} ...`);
});
