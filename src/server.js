import express, { json } from 'express';
import httpError from 'http-errors';

import cfg from './config.js';
import logger from './logger.js';
import tpxleNITRouter from './routes/tpxle-nit.router.js';

const app = express();
app.use(json());

app.use('/', tpxleNITRouter);

app.listen(cfg.NIT_SERVER_PORT, () => {
  logger.info(`TPXLE NIT is listening at http://localhost:${cfg.NIT_SERVER_PORT}`);
});

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
