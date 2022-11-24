// import fetch from 'node-fetch';  // FOR DOWNLINK ONLY!

import logger from '../logger.js';
// import DownlinkDataModel from '../models/downlink-data.model.js';  // FOR DOWNLINK ONLY!
import { tpxleAuthAsync } from '../middlewares/tpxle-auth.middleware.js';
import { translateUplink /* translateDownlink */ } from '../services/nit-proximus.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

export const uplinkFromProximusAsync = async (req) => {
  /* ** Check if request body is correct ** */
  const errMsg =
    '(x-access-token or (x-client-id and x-client-secret)) in header and DevEUI_uplink.DevEUI in body are mandatory!';
  let accessToken;
  let clientId;
  let clientSecret;
  let realm;
  let devEUI;
  try {
    accessToken = req.headers['x-access-token'];
    clientId = req.headers['x-client-id'];
    clientSecret = req.headers['x-client-secret'];
    realm = req.headers['x-realm'] || process.env.NIT__DEFAULT_REALM;
    devEUI = req.body.DevEUI;
  } catch (err) {
    logger.warn(err.stack);
    logger.warn(`UL: ${errMsg}`);
    // logger.warn(`UL: ${JSON.stringify(req.body)}`);
    return;
  }
  if (!devEUI) {
    logger.warn('UL: Missing DevEUI!');
    return;
  }
  if (!process.env.NIT__VALID_REALMS.split(',').includes(realm)) {
    logger.warn('UL: Invalid realm!');
    return;
  }
  if (!((accessToken || (clientId && clientSecret)) && devEUI)) {
    logger.warn(`UL: DevEUI: ${devEUI}: ${errMsg}`);
    return;
  }

  logger.debug(
    // `UL: DevEUI: ${devEUI}: UL message received from NS.     ${JSON.stringify(req.body)}`,
    `UL: DevEUI: ${devEUI}: UL message received from NS.`,
  );

  /* ** Translate message body ** */
  let translatedBody;
  try {
    translatedBody = translateUplink(req.body);
  } catch (err) {
    logger.error(err.stack);
    return;
  }

  /* ** Forward message to TPXLE ** */
  try {
    await sendToTPXLEAsync(translatedBody, req.tpxleToken, realm, clientId);
  } catch (err) {
    logger.error(err.stack);
  }
};

export const downlinkToProximusAsync = async (req) => {
  /* ** Check if request body is correct ** */
  logger.debug(`DL: Poximus Downlink is not implemented!.\n${req.body}`);
};

export const uplinkFromProximus = (req, res) => {
  (async () => {
    let tpxleToken;
    try {
      tpxleToken = await tpxleAuthAsync(req);
    } catch (err) {
      logger.error(`uplinkFromProximus() error: ${err.stack}`);
    }
    req.tpxleToken = tpxleToken;
    try {
      await uplinkFromProximusAsync(req);
    } catch (err) {
      logger.error(`uplinkFromProximus() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};

export const downlinkToProximus = (req, res) => {
  (async () => {
    try {
      await downlinkToProximusAsync(req);
    } catch (err) {
      logger.error(`downlinkToProximus() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};
