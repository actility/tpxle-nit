import express, { json } from 'express';
import httpError from 'http-errors';

// import { createMQTTUplinkClient, createMQTTDownlinkClient } from './mqtt-client.js';

import cfg from './config.js';
import logger from './logger.js';
import tpxleNITRouter from './routes/tpxle-nit.router.js';
import mqttAuthProxyRouter from './routes/mqtt-auth-proxy.router.js';

const app = express();

// Middlewares

app.use(json());

// Routes

app.use('/', tpxleNITRouter);
app.use('/mosquitto', mqttAuthProxyRouter);

// test route

app.get('/test', (req, res) => {
  logger.debug('Test request received on server');
  res.write('The server works\n');
  res.status(200).end();
});

// Error handling

app.use((req, res, next) => {
  next(httpError(404));
});

/*
app.use((err, req, res, next) => {
  logger.error(err.message);
  next(err);
});
*/

app.use((err, req, res, next) => {
  if (httpError.isHttpError(err)) {
    res.status(err.statusCode).send(err.message);
  } else {
    logger.error(err.stack);
    res.sendStatus(500);
  }
  next();
});

// Start server

app.listen(cfg.NIT_SERVER_PORT, () => {
  logger.info(`TPXLE NIT is listening at http://localhost:${cfg.NIT_SERVER_PORT}`);
  // createMQTTUplinkClient();
  // createMQTTDownlinkClient();
});
