import { redisClient } from '../redis.client.js';
import logger from '../logger.js';

export default class AccessTokensModel {
  static async setAccessToken(architectureId, clientId, accessToken, clientSecret) {
    const expireTime = 240; // 4 min
    let subscriberId;
    let result;
    try {
      const key = `access_token:${architectureId}:${clientId}`;
      result = await redisClient.set(key, accessToken);
      redisClient.expire(key, expireTime);
      logger.debug(`Access Token saved to db. DBKEY: ${key}`);

      const decodedToken = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
      subscriberId = decodedToken.sub || decodedToken.scope[0].split(':')[1];
      const key1 = `access_token_by_subscriberId:${architectureId}:${subscriberId}`;
      await redisClient.set(key1, accessToken);
      redisClient.expire(key1, expireTime);

      if (clientSecret) {
        const key2 = `credentials_by_subscriberId:${architectureId}:${subscriberId}`;
        // await redisClient.HMSET(key2, { clientId, clientSecret });
        await redisClient.hSet(key2, ['clientId', clientId, 'clientSecret', clientSecret]);
        console.log(`KEY SAVED: ${key2}`);
      }

      // logger.debug(`DBKEY: ${key}:  ${result}`);
    } catch (err) {
      logger.error(`${clientId}: AccessTokensModel error:\n${err.stack}`);
    }
    return result;
  }

  static async deleteAccessToken(architectureId, clientId) {
    let result;
    try {
      const key = `access_token:${architectureId}:${clientId}`;
      result = await redisClient.del(key);
      logger.debug(`Access Token deleted from db. DBKEY: ${key}`);
    } catch (err) {
      logger.error(`${clientId}: AccessTokensModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getAccessToken(architectureId, clientId) {
    let result;
    try {
      const key = `access_token:${architectureId}:${clientId}`;
      result = await redisClient.get(key);
      if (result) {
        logger.debug(`Cached Access Token retreived from db. DBKEY: ${key}`);
        // logger.debug(`DBKEY: ${key}:  ${result}`);
      }
    } catch (err) {
      logger.error(`${clientId}: AccessTokensModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getAccessTokenBySubscriberId(architectureId, subscriberId) {
    let result;
    try {
      const key = `access_token_by_subscriberId:${architectureId}:${subscriberId}`;
      console.log(`KEY TO RETREIVE: ${key}`);
      result = await redisClient.get(key);
      if (result) {
        logger.debug(`Cached Access Token retreived from db. DBKEY: ${key}`);
        // logger.debug(`DBKEY: ${key}:  ${result}`);
      }
    } catch (err) {
      logger.error(`SubscriberId: ${subscriberId}: AccessTokensModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getCredentialsBySubscriberId(architectureId, subscriberId) {
    let result;
    try {
      const key = `credentials_by_subscriberId:${architectureId}:${subscriberId}`;
      console.log(`KEY TO RETREIVE: ${key}`);
      result = await redisClient.hGetAll(key);
      if (result) {
        logger.debug(`Cached Credentials retreived from db. DBKEY: ${key}`);
        // logger.debug(`DBKEY: ${key}:  ${result}`);
      }
    } catch (err) {
      logger.error(`SubscriberId: ${subscriberId}: AccessTokensModel error:\n${err.stack}`);
    }
    return result;
  }
}
