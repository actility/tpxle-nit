/** ***************
 * REDIS CLIENT
 *************** */

import { createClient } from 'redis';
import { promisify } from 'util';

import cfg from './config.js';
import logger from './logger.js';

export const redisClient = createClient({
  host: cfg.REDIS_HOST, // 'redis',
  port: cfg.REDIS_PORT, // 6379
  // password: '<password>'
});
redisClient.on('error', (err) => {
  logger.error(`REDIS CLIENT error: \n${err.stack}`);
});
redisClient.on('connect', () => {
  logger.info(`REDIS CLIENT is connected to Redis Server: ${cfg.REDIS_HOST}:${cfg.REDIS_PORT}`);
});

export const setAsync = promisify(redisClient.set).bind(redisClient);
export const getAsync = promisify(redisClient.get).bind(redisClient);
export const delAsync = promisify(redisClient.del).bind(redisClient);
export const expireAsync = promisify(redisClient.expire).bind(redisClient);
export const hsetAsync = promisify(redisClient.hset).bind(redisClient);
export const hgetAsync = promisify(redisClient.hget).bind(redisClient);
export const hmsetAsync = promisify(redisClient.hmset).bind(redisClient);
export const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
export const lpushAsync = promisify(redisClient.lpush).bind(redisClient);
export const rpopAsync = promisify(redisClient.rpop).bind(redisClient);
