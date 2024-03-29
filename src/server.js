import express, { json } from 'express';
// import httpError from 'http-errors';

import './config.js';
import logger from './logger.js';

import mqttClientFactory from './mqtt-client.js';

import tpxleNITRouterFactory from './routes/tpxle-nit.router.js';
// import mqttAuthMosquittoRouter from './routes/mqtt-auth-mosquitto.router.js';
import mqttAuthVMQRouter from './routes/mqtt-auth-vmq.router.js';

const app = express();

let mqttClient;
if (process.env.NIT__MQTT_ENABLED === 'True') {
  mqttClient = mqttClientFactory();
}

// Middlewares

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Authorization, Content-Length, X-Requested-With',
//   );
//   if (req.method === 'OPTIONS') {
//     res.send(200);
//   } else {
//     next();
//   }
// });

app.use(json());

// Routes

app.use('/', tpxleNITRouterFactory(mqttClient));
// app.use('/mosquitto', mqttAuthMosquittoRouter);
app.use('/vmq', mqttAuthVMQRouter);

// test route

app.get('/test', (req, res) => {
  logger.debug('Test request received on server');
  res.write('The server works\n');
  res.status(200).end();
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
