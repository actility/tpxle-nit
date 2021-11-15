import { setAsync, getAsync, expireAsync } from '../redis.client.js';
import logger from '../logger.js';

export default class AccessTokensModel {
  static async setAccessToken(clientId, accessToken) {
    let result;
    try {
      const key = `access_token:${clientId}`;
      result = await setAsync(key, accessToken);
      expireAsync(key, 600); // 10 min
      logger.debug(`Access Token saved to db.`);
      logger.debug(`DBKEY: ${key}:  ${result}`);
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
        logger.debug(`Cached Access Token retreived from db.`);
        logger.debug(`DBKEY: ${key}:  ${result}`);
      }
    } catch (err) {
      logger.error(`${clientId}: DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }
}
