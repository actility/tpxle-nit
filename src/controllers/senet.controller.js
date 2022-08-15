import fetch from 'node-fetch';

import logger from '../logger.js';
import { tpxleAuthAsync } from '../middlewares/tpxle-auth.middleware.js';
import DownlinkDataModel from '../models/downlink-data.model.js';
import { translateUplink, translateDownlink } from '../services/nit-senet.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

// export const uplinkFromSenet = async (req, res, next) => {
export const uplinkFromSenetAsync = async (req, res = null, next = null) => {
  /* ** Check if request body is correct ** */
  const errMsg =
    '(x-access-token or (x-client-id and x-client-secret)), x-downlink-api, x-downlink-apikey in header and devEui in body are mandatory!';
  let accessToken;
  let clientId;
  let clientSecret;
  let realm;
  let devEUI;
  let downlinkApi;
  let downlinkApikey;
  try {
    accessToken = req.headers['x-access-token'];
    clientId = req.headers['x-client-id'];
    clientSecret = req.headers['x-client-secret'];
    realm = req.headers['x-realm'] || process.env.NIT__DEFAULT_REALM;
    devEUI = req.body.devEui; // NS Specific !!!
    downlinkApi = req.headers['x-downlink-api'];
    downlinkApikey = req.headers['x-downlink-apikey'];
  } catch (err) {
    logger.warn(err.stack);
    logger.warn(`UL: ${errMsg}`);
    if (res) {
      res.status(400).send(errMsg);
    }
    return;
  }

  if (!devEUI) {
    logger.warn('UL: Missing DevEUI!');
    if (res) {
      res.status(400).send('Missing DevEUI!');
    }
    return;
  }
  if (!process.env.NIT__VALID_REALMS.split(',').includes(realm)) {
    logger.warn('UL: Invalid realm!');
    if (res) {
      res.status(400).send('Invalid realm!');
    }
    return;
  }
  if (!((accessToken || (clientId && clientSecret)) && devEUI && downlinkApi && downlinkApikey)) {
    logger.warn(`UL: DevEUI: ${devEUI}: ${errMsg}`);
    if (res) {
      res.status(400).send(errMsg);
    }
    return;
  }

  const nitapikey = req.params.nitapikey || 'senet'; // For backward compatibility, we allow not specifying nitapikey in the url!
  /*
  if (!nitapikey) {
    logger.warn(`UL: There is no "nitapikey" parameter in the url.`);
    res.write('There is no "nitapikey" parameter in the url.');
    res.status(400).end();
    return;
  }
  */

  logger.debug(`UL: DevEUI: ${devEUI}: UL message received from NS.`);

  /* ** Save downlink data in db ** */
  DownlinkDataModel.setDLData(nitapikey, devEUI, {
    downlinkApi,
    downlinkApikey,
  });

  /* ** Translate message body ** */
  let translatedBody;
  try {
    translatedBody = translateUplink(req.body);
  } catch (err) {
    logger.error(err.stack);
    if (res) {
      res.status(400).send('Invalid request body. (Failed to translate request body.)\n');
    }
    return;
  }

  // sendToTPXLEAsync(translatedBody, accessToken, clientId, clientSecret, realm);
  try {
    await sendToTPXLEAsync(translatedBody, req.tpxleToken, realm, clientId);
  } catch (err) {
    logger.error(err.stack);
    if (next) {
      next(err);
    }
    return;
  }

  if (res) {
    res.status(200).end();
  }
};

// export const downlinkToSenet = async (req, res) => {
export const downlinkToSenetAsync = async (req, res) => {
  /* ** Check if request body is correct ** */
  const devEUI = req.body.deveui?.toLowerCase();
  if (!devEUI) {
    logger.warn(`DL: There is no "deveui" field in request body.`);
    if (res) {
      res.write('There is no "deveui" field in request body.');
      res.status(400).end();
    }
    return;
  }

  const nitapikey = req.params.nitapikey || 'senet'; // For backward compatibility, we allow not specifying nitapikey in the url!
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
    if (res) {
      res.status(400).send('Invalid request body. (Failed to translate request body.)\n');
    }
    return;
  }

  /* ** Get downlinkData from DB. ** */
  let downlinkData;
  try {
    downlinkData = await DownlinkDataModel.getDLData(nitapikey, devEUI);
  } catch (err) {
    logger.error(err.stack);
    if (res) {
      res.status(200).end();
    }
    return;
  }
  if (!downlinkData) {
    logger.warn(`DL: DevEUI: ${devEUI}: DownlinkData does not exists in the db yet.`);
    if (res) {
      res.status(404).send(`DL: DevEUI: ${devEUI}: DownlinkData does not exists in the db yet.\n`);
    }
    return;
  }

  /* ** Send downlink frame to NS ** */
  let nsRes;
  // This is unique for SENET! TranslatedBody is an object defining URLSearchParams
  translatedBody.apikey = downlinkData.downlinkApikey;
  const urlSearchParams = new URLSearchParams(translatedBody);
  try {
    nsRes = await fetch(`${downlinkData.downlinkApi}?${urlSearchParams.toString()}`, {
      method: 'POST',
      body: '',
    });
  } catch (err) {
    logger.error(err.stack);
    if (res) {
      res.status(200).end();
    }
    return;
  }
  logger.debug(
    `DL: DevEUI: ${devEUI}: Downlink forwarded to NS: ${
      downlinkData.downlinkApi
    }?${urlSearchParams.toString()}`,
  );
  logger.debug(
    `DL: DevEUI: ${devEUI}: Downlink forwarded to NS. Response status: ${nsRes.status} ${nsRes.statusText}`,
  );

  let nsResText;
  try {
    nsResText = await nsRes.text();
  } catch (err) {
    logger.error(err.stack);
    if (res) {
      res.status(200).end();
    }
    return;
  }
  if (nsResText) {
    logger.debug(nsResText);
  }

  if (res) {
    res.status(200).end();
  }
};

export const uplinkFromSenet = (req, res) => {
  (async () => {
    let tpxleToken;
    try {
      tpxleToken = await tpxleAuthAsync(req);
    } catch (err) {
      logger.error(`uplinkFromSenet() error: ${err.stack}`);
    }
    req.tpxleToken = tpxleToken;
    try {
      await uplinkFromSenetAsync(req);
    } catch (err) {
      logger.error(`uplinkFromSenet() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};

export const downlinkToSenet = (req, res) => {
  (async () => {
    try {
      await downlinkToSenetAsync(req);
    } catch (err) {
      logger.error(`downlinkToSenet() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};
