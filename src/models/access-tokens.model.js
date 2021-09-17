import { setAsync, getAsync, expireAsync } from '../redis.client.js';
import logger from '../logger.js';

export default class AccessTokensModel {
  static async setAccessToken(devEUI, accessToken) {
    let result;
    try {
      const key = `access_token:${devEUI.toLowerCase()}`;
      result = await setAsync(key, accessToken);
      expireAsync(key, 600); // 10 min
      logger.debug(`UL: DevEUI: ${devEUI}: Access Token saved to db.`);
    } catch (err) {
      logger.error(`AccessTokensModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getAccessToken(devEUI) {
    let result;
    try {
      const key = `access_token:${devEUI.toLowerCase()}`;
      result = await getAsync(key);
    } catch (err) {
      logger.error(`AccessTokensModel error:\n${err.stack}`);
    }
    if (result) {
      logger.debug(`UL: DevEUI: ${devEUI}: Cached Access Token retreived from db.`);
    }
    return result;
  }
}
