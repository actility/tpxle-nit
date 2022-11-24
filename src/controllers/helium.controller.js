import fetch from 'node-fetch';

import logger from '../logger.js';
import DownlinkDataModel from '../models/downlink-data.model.js';
import { tpxleAuthAsync } from '../middlewares/tpxle-auth.middleware.js';
import { translateUplink, translateDownlink } from '../services/nit-helium.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

export const uplinkFromHeliumAsync = async (req) => {
  /* ** Check if request body is correct ** */
  const errMsg =
    '(accessToken or (clientId and clientSecret)) in header and devEUI, downlinkUrl in body are mandatory!';
  let accessToken;
  let clientId;
  let realm;
  let clientSecret;
  let devEUI;
  let downlinkUrl;
  try {
    accessToken = req.headers['x-access-token'];
    clientId = req.headers['x-client-id'];
    clientSecret = req.headers['x-client-secret'];
    realm = req.headers['x-realm'] || process.env.NIT__DEFAULT_REALM;
    devEUI = req.body.dev_eui?.toLowerCase();
    downlinkUrl = req.body.downlink_url;
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
  if (!((accessToken || (clientId && clientSecret)) && devEUI && downlinkUrl)) {
    logger.warn(`UL: DevEUI: ${devEUI}: ${errMsg}`);
    return;
  }

  const nitapikey = req.params.nitapikey || 'helium'; // For backward compatibility, we allow not specifying nitapikey in the url!
  /*
  if (!nitapikey) {
    logger.warn(`DL: There is no "nitapikey" parameter in the url.`);
    res.write('There is no "nitapikey" parameter in the url.');
    res.status(400).end();
    return;
  }
  */

  logger.debug(`UL: DevEUI: ${devEUI}: UL message received from Helium.`);

  /* ** Save downlink data in db ** */
  DownlinkDataModel.setDLData(nitapikey, devEUI, { downlinkUrl });

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

export const downlinkToHeliumAsync = async (req) => {
  /* ** Check if request body is correct ** */
  const devEUI = req.body.deveui?.toLowerCase();
  if (!devEUI) {
    logger.warn(`DL: There is no "deveui" field in request body.`);
    return;
  }

  const nitapikey = req.params.nitapikey || 'helium'; // For backward compatibility, we allow not specifying nitapikey in the url!
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
    nsRes = await fetch(downlinkData.downlinkUrl, {
      method: 'POST',
      headers: {
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

export const uplinkFromHelium = (req, res) => {
  (async () => {
    let tpxleToken;
    try {
      tpxleToken = await tpxleAuthAsync(req);
    } catch (err) {
      logger.error(`uplinkFromHelium() error: ${err.stack}`);
    }
    req.tpxleToken = tpxleToken;
    try {
      await uplinkFromHeliumAsync(req);
    } catch (err) {
      logger.error(`uplinkFromHelium() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};

export const downlinkToHelium = (req, res) => {
  (async () => {
    try {
      await downlinkToHeliumAsync(req);
    } catch (err) {
      logger.error(`downlinkToHelium() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};
