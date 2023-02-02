/** ***************
 * REDIS CLIENT
 *************** */

import { createClient } from 'redis';
// import { promisify } from 'util';

import logger from './logger.js';

// eslint-disable-next-line import/prefer-default-export
export const redisClient = createClient({
  host: process.env.NIT__REDIS_HOST, // 'redis',
  port: process.env.NIT__REDIS_PORT, // 6379
  // password: '<password>'
});

redisClient.on('error', (err) => {
  logger.error(`REDIS CLIENT error: \n${err.stack}`);
});
redisClient.on('connect', () => {
  logger.info(
    `REDIS CLIENT is connected to Redis Server: ${process.env.NIT__REDIS_HOST}:${process.env.NIT__REDIS_PORT}`,
  );
});

(async () => {
  await redisClient.connect();
})();
