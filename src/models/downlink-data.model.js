import { hmsetAsync, hgetallAsync, expireAsync } from '../redis.client.js';
import logger from '../logger.js';

const NS_VENDORS = ['helium', 'ttn'];

export default class DownlinkDataModel {
  // static NS_VENDORS = ['helium', 'ttn'];

  static async setDLData(nsVendor, devEUI, downlinkData) {
    let result;
    if (!NS_VENDORS.includes(nsVendor)) {
      logger.error(`DownlinkDataModel error: Invalid nsVendor parameter: ${nsVendor}\n`);
      console.log(NS_VENDORS);
      return result;
    }
    try {
      const key = `${nsVendor}_downlink_data:${devEUI.toLowerCase()}`;
      result = await hmsetAsync(key, downlinkData);
      expireAsync(key, 2_592_000); // 30 days
      logger.debug(`UL: DevEUI: ${devEUI}: downlink Data saved to db.`);
    } catch (err) {
      logger.error(`${nsVendor} DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getDLData(nsVendor, devEUI) {
    let result;
    if (!NS_VENDORS.includes(nsVendor)) {
      logger.error(`DownlinkDataModel error: Invalid nsVendor parameter: ${nsVendor}\n`);
      return result;
    }
    try {
      const key = `${nsVendor}_downlink_data:${devEUI.toLowerCase()}`;
      result = await hgetallAsync(key);
    } catch (err) {
      logger.error(`${nsVendor} DownlinkDataModel error:\n${err.stack}`);
    }
    return result;
  }
}
