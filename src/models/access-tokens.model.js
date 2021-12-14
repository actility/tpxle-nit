import { setAsync, getAsync, delAsync, expireAsync } from '../redis.client.js';
import logger from '../logger.js';

export default class AccessTokensModel {
  static async setAccessToken(realm, clientId, accessToken) {
    const expireTime = 240; // 4 min
    let subscriberId;
    let result;
    try {
      const key = `access_token:${realm}:${clientId}`;
      result = await setAsync(key, accessToken);
      expireAsync(key, expireTime);
      logger.debug(`Access Token saved to db. DBKEY: ${key}`);

      const decodedToken = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
      subscriberId = decodedToken.sub || decodedToken.scope[0].split(':')[1];
      const key1 = `access_token_by_subscriberId:${realm}:${subscriberId}`;
      await setAsync(key1, accessToken);
      expireAsync(key1, expireTime);

      console.log(`KEY SAVED: ${key1}`);

      // logger.debug(`DBKEY: ${key}:  ${result}`);
    } catch (err) {
      logger.error(`${clientId}: DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }

  static async deleteAccessToken(realm, clientId) {
    let result;
    try {
      const key = `access_token:${realm}:${clientId}`;
      result = await delAsync(key);
      logger.debug(`Access Token deleted from db. DBKEY: ${key}`);
    } catch (err) {
      logger.error(`${clientId}: DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getAccessToken(realm, clientId) {
    let result;
    try {
      const key = `access_token:${realm}:${clientId}`;
      result = await getAsync(key);
      if (result) {
        logger.debug(`Cached Access Token retreived from db. DBKEY: ${key}`);
        // logger.debug(`DBKEY: ${key}:  ${result}`);
      }
    } catch (err) {
      logger.error(`${clientId}: DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getAccessTokenBySubscriberId(realm, subscriberId) {
    let result;
    try {
      const key = `access_token_by_subscriberId:${realm}:${subscriberId}`;
      console.log(`KEY TO RETREIVE: ${key}`);
      result = await getAsync(key);
      if (result) {
        logger.debug(`Cached Access Token retreived from db. DBKEY: ${key}`);
        // logger.debug(`DBKEY: ${key}:  ${result}`);
      }
    } catch (err) {
      logger.error(`SubscriberId: ${subscriberId}: DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }
}
