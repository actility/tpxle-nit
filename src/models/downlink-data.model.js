import { hmsetAsync, hgetallAsync, expireAsync } from '../redis.client.js';
import logger from '../logger.js';

export default class DownlinkDataModel {

    static NS_VENDORS = ['helium', 'ttn'];

    static async setDLData(nsVendor, devEUI, downlinkData) {
        if ( !this.NS_VENDORS.includes(nsVendor) ) {
            logger.error(`DownlinkDataModel error: Invalid nsVendor parameter: ${nsVendor}\n`);
            console.log(this.NS_VENDORS);
            return;
        };
        try {
            const key = `${nsVendor}_downlink_data:${devEUI.toLowerCase()}`;
            const result = await hmsetAsync(key, downlinkData);
            expireAsync(key, 2_592_000); // 30 days
            logger.debug(`UL: DevEUI: ${devEUI}: downlink Data saved to db.`);
            return result;
        } catch (err) { 
            logger.error(`${nsVendor} DownlinkDataModel error:\n${err.stack}`);
        }
    }

    static async getDLData(nsVendor, devEUI) {
        if ( !this.NS_VENDORS.includes(nsVendor) ) {
            logger.error(`DownlinkDataModel error: Invalid nsVendor parameter: ${nsVendor}\n`);
            return;
        };
        try {
            const key = `${nsVendor}_downlink_data:${devEUI.toLowerCase()}`;
            const downlinkData = await hgetallAsync(key);
            return downlinkData;
        } catch (err) { 
            logger.error(`${nsVendor} DownlinkDataModel error:\n${err.stack}`);
        }
    }

}
