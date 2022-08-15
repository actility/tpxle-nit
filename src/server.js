import express, { json } from 'express';
import httpError from 'http-errors';

import './config.js';

import createMQTTClient from './mqtt-client.js';

import logger from './logger.js';

import createTPXLENITRouter from './routes/tpxle-nit.router.js';

// import mqttAuthMosquittoRouter from './routes/mqtt-auth-mosquitto.router.js';
import mqttAuthVMQRouter from './routes/mqtt-auth-vmq.router.js';

const app = express();

let mqttClient;

if (process.env.NIT__MQTT_ENABLED === 'True') {
  mqttClient = createMQTTClient();
}

const tpxleNITRouter = createTPXLENITRouter(mqttClient);

// Middlewares

app.use(json());

// Routes

app.use('/', tpxleNITRouter);
// app.use('/mosquitto', mqttAuthMosquittoRouter);
app.use('/vmq', mqttAuthVMQRouter);

// test route

app.get('/test', (req, res) => {
  logger.debug('Test request received on server');
  res.write('The server works\n');
  res.status(200).end();
});

// Error handling

app.use((req, res, next) => {
  // res.status(404).end();
  next(httpError(404));
});

app.use((err, req, res) => {
  if (httpError.isHttpError(err)) {
    res.status(err.statusCode).send(err.message);
    return;
  }
  logger.error(`????????????????? express error handler: ${err.message}`);
  res.sendStatus(200).end();
  // res.status(404).end();
});

// Start server

const server = app.listen(process.env.NIT__SERVER_PORT, () => {
  const address = server.address();
  logger.info(`TPXLE NIT is listening at ${address.address}:${address.port} ...`);
});
