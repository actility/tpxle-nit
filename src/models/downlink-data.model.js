import { hmsetAsync, hgetallAsync, expireAsync } from '../redis.client.js';
import logger from '../logger.js';

export default class DownlinkDataModel {
  static async setDLData(nitapikey, devEUI, downlinkData) {
    let result;
    try {
      const key = `downlink_data:${nitapikey}:${devEUI.toLowerCase()}`;
      result = await hmsetAsync(key, downlinkData);
      expireAsync(key, 2_592_000); // 30 days
      logger.debug(`UL: DevEUI: ${devEUI}: downlink Data saved to db. DBKEY: ${key}`);
      // logger.debug(`DBKEY: ${key}:  ${JSON.stringify(downlinkData)}`);
    } catch (err) {
      logger.error(`${devEUI} DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getDLData(nitapikey, devEUI) {
    let result;
    try {
      const key = `downlink_data:${nitapikey}:${devEUI.toLowerCase()}`;
      result = await hgetallAsync(key);
      logger.debug(`DL: DevEUI: ${devEUI}: Cached Downlink Data retreived from db. DBKEY: ${key}`);
      // logger.debug(`DBKEY: ${key}:  ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`${devEUI} DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }
}
