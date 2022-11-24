import fetch from 'node-fetch';

import logger from '../logger.js';
import DownlinkDataModel from '../models/downlink-data.model.js';
import { tpxleAuthAsync } from '../middlewares/tpxle-auth.middleware.js';
import { translateUplink, translateDownlink } from '../services/nit-ttn.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

export const uplinkFromTTNAsync = async (req) => {
  /* ** Check if request body is correct ** */
  const errMsg =
    '(x-access-token or (x-client-id and x-client-secret)), x-downlink-push, x-downlink-replace, x-downlink-apikey in header and end_device_ids.dev_eui in body are mandatory!';
  let accessToken;
  let clientId;
  let clientSecret;
  let realm;
  let devEUI;
  let downlinkPush;
  let downlinkReplace;
  let downlinkApikey;
  try {
    accessToken = req.headers['x-access-token'];
    clientId = req.headers['x-client-id'];
    clientSecret = req.headers['x-client-secret'];
    realm = req.headers['x-realm'] || process.env.NIT__DEFAULT_REALM;
    devEUI = req.body.end_device_ids.dev_eui;
    downlinkPush = req.headers['x-downlink-push'];
    downlinkReplace = req.headers['x-downlink-replace'];
    downlinkApikey = req.headers['x-downlink-apikey'];
  } catch (err) {
    logger.warn(err.stack);
    logger.warn(`UL: ${errMsg}`);
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
  if (
    !(
      (accessToken || (clientId && clientSecret)) &&
      devEUI &&
      downlinkPush &&
      downlinkReplace &&
      downlinkApikey
    )
  ) {
    logger.warn(`UL: DevEUI: ${devEUI}: ${errMsg}`);
    return;
  }

  const nitapikey = req.params.nitapikey || 'ttn'; // For backward compatibility, we allow not specifying nitapikey in the url!
  /*
  if (!nitapikey) {
    logger.warn(`DL: There is no "nitapikey" parameter in the url.`);
    res.write('There is no "nitapikey" parameter in the url.');
    res.status(400).end();
    return;
  }
  */

  logger.debug(`UL: DevEUI: ${devEUI}: UL message received from NS.`);

  /* ** Save downlink data in db ** */
  DownlinkDataModel.setDLData(nitapikey, devEUI, {
    downlinkPush,
    downlinkReplace,
    downlinkApikey,
  });

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

export const downlinkToTTNAsync = async (req) => {
  /* ** Check if request body is correct ** */
  const devEUI = req.body.deveui?.toLowerCase();
  if (!devEUI) {
    logger.warn(`DL: There is no "deveui" field in request body.`);
    return;
  }

  const nitapikey = req.params.nitapikey || 'ttn'; // For backward compatibility, we allow not specifying nitapikey in the url!
  /*
  if (!nitapikey) {
    logger.warn(`DL: There is no "nitapikey" parameter in the url.`);
    res.write('There is no "nitapikey" parameter in the url.');
    res.status(400).end();
    return;
  }
  */

  logger.debug(`DL: DevEUI: ${devEUI}: DL message received from TPXLE.`);

  /* ** Translate message body ** */
  let translatedBody;
  try {
    translatedBody = translateDownlink(req.body);
  } catch (err) {
    logger.error(err.stack);
    return;
  }

  /* ** Get downlinkData from DB. ** */
  let downlinkData;
  try {
    downlinkData = await DownlinkDataModel.getDLData(nitapikey, devEUI);
  } catch (err) {
    logger.error(err.stack);
    return;
  }
  if (!downlinkData) {
    logger.warn(`DL: DevEUI: ${devEUI}: DownlinkData does not exists in the db yet.`);
    return;
  }

  /* ** Send downlink frame to NS ** */
  let nsRes;
  try {
    nsRes = await fetch(downlinkData.downlinkReplace, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${downlinkData.downlinkApikey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(translatedBody),
    });
  } catch (err) {
    logger.error(err.stack);
    return;
  }
  logger.debug(
    `DL: DevEUI: ${devEUI}: Downlink forwarded to NS. Response status: ${nsRes.status} ${nsRes.statusText}`,
  );

  let nsResText;
  try {
    nsResText = await nsRes.text();
  } catch (err) {
    logger.error(err.stack);
    return;
  }
  if (nsResText) {
    logger.debug(nsResText);
  }
};

export const uplinkFromTTN = (req, res) => {
  (async () => {
    let tpxleToken;
    try {
      tpxleToken = await tpxleAuthAsync(req);
    } catch (err) {
      logger.error(`uplinkFromTTN() error: ${err.stack}`);
    }
    req.tpxleToken = tpxleToken;
    try {
      await uplinkFromTTNAsync(req);
    } catch (err) {
      logger.error(`uplinkFromTTN() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};

export const downlinkToTTN = (req, res) => {
  (async () => {
    try {
      await downlinkToTTNAsync(req);
    } catch (err) {
      logger.error(`downlinkToTTN() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};
