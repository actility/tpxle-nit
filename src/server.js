import express, { json } from 'express';

import cfg from './config.js';
import logger from './logger.js';

import tpxleNITRouter from './routes/tpxle-nit.router.js';

const app = express();
app.use(json());
app.use('/', tpxleNITRouter);

app.listen(cfg.NIT_SERVER_PORT, () => {
  logger.info(`TPXLE NIT is listening at http://localhost:${cfg.NIT_SERVER_PORT}`);
});
