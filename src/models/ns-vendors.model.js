import { redisClient } from '../redis.client.js';
import logger from '../logger.js';

export default class NSVendorsModel {
  static async setNSVendor(userId, devEUI, nsVendor) {
    let result;
    try {
      const key = `ns_vendor:${userId}:${devEUI.toLowerCase()}`;
      result = await redisClient.set(key, nsVendor);
      redisClient.expire(key, 2_592_000); // 30 days
      logger.debug(`UL: DevEUI: ${devEUI}; NSVendor: "${nsVendor}" saved to db. DBKEY: ${key}`);
    } catch (err) {
      logger.error(`${devEUI} NSVendorModel error:\n${err.stack}`);
    }
    return result;
  }

  static async getNSVendor(userId, devEUI) {
    let result;
    try {
      const key = `ns_vendor:${userId}:${devEUI.toLowerCase()}`;
      result = await redisClient.get(key);
      logger.debug(
        `DL: DevEUI: ${devEUI}: Cached nsVendor retreived from db. NSVendor: "${result}" DBKEY: ${key}`,
      );
    } catch (err) {
      logger.error(`${devEUI} NSVendorModel error:\n${err.stack}`);
    }
    return result;
  }
}
