import { setAsync, getAsync, delAsync, expireAsync } from '../redis.client.js';
import logger from '../logger.js';

export default class AccessTokensModel {
  static async setAccessToken(clientId, accessToken) {
    let result;
    try {
      const key = `access_token:${clientId}`;
      result = await setAsync(key, accessToken);
      expireAsync(key, 240); // 4 min
      logger.debug(`Access Token saved to db. DBKEY: ${key}`);
      // logger.debug(`DBKEY: ${key}:  ${result}`);
    } catch (err) {
      logger.error(`${clientId}: DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }

  static async deleteAccessToken(clientId) {
    let result;
    try {
      const key = `access_token:${clientId}`;
      result = await delAsync(key);
      logger.debug(`Access Token deleted from db. DBKEY: ${key}`);
    } catch (err) {
      logger.error(`${clientId}: DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getAccessToken(clientId) {
    let result;
    try {
      const key = `access_token:${clientId}`;
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
}
