import fetch from 'node-fetch';

import logger from '../logger.js';
import DownlinkDataModel from '../models/downlink-data.model.js';
import { translateUplink, translateDownlink } from '../services/nit-loriot.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

export const uplinkFromLoriot = async (req, res, next) => {
  /* ** Check if request body is correct ** */
  const errMsg =
    'The format of "authorization" header must be either "clientId|clientSecret|realm|downlinkUrl" or "|accessToken|realm|downlinkUrl"! "EUI field in body is mandatory!';
  let accessToken;
  let clientId;
  let realm;
  let clientSecret;
  let devEUI;
  let downlinkUrl;
  let downlinkAPIKey;
  try {
    [clientId, clientSecret, realm, downlinkUrl, downlinkAPIKey] =
      req.headers.authorization.split('|');
    if (clientId === '') {
      accessToken = clientSecret;
    }
    devEUI = req.body.EUI?.toLowerCase();
  } catch (err) {
    logger.warn(err.stack);
    logger.warn(errMsg);
    res.status(400).send(errMsg);
    return;
  }

  if (!devEUI) {
    logger.warn('UL: Missing DevEUI!');
    res.status(400).send('Missing DevEUI!');
    return;
  }
  if (!process.env.NIT__VALID_REALMS.split(',').includes(realm)) {
    logger.warn('UL: Invalid realm!');
    res.status(400).send('Invalid realm!');
    return;
  }
  if (!((accessToken || (clientId && clientSecret)) && devEUI && downlinkUrl)) {
    logger.warn(`UL: DevEUI: ${devEUI}: ${errMsg}`);
    res.status(400).send(errMsg);
    return;
  }

  const nitapikey = req.params.nitapikey || 'loriot'; // For backward compatibility, we allow not specifying nitapikey in the url!
  /*
  if (!nitapikey) {
    logger.warn(`DL: There is no "nitapikey" parameter in the url.`);
    res.write('There is no "nitapikey" parameter in the url.');
    res.status(400).end();
    return;
  }
  */

  logger.debug(`UL: DevEUI: ${devEUI}: UL message received from Loriot.`);

  /* ** Save downlink data in db ** */
  DownlinkDataModel.setDLData(nitapikey, devEUI, {
    downlinkUrl: downlinkUrl || '',
    downlinkAPIKey: downlinkAPIKey || '',
  });

  /* ** Translate message body ** */
  let translatedBody;
  try {
    translatedBody = translateUplink(req.body);
  } catch (err) {
    logger.error(err.stack);
    res.status(400).send('Invalid request body. (Failed to translate request body.)\n');
    return;
  }

  // sendToTPXLEAsync(translatedBody, accessToken, clientId, clientSecret, realm);
  try {
    await sendToTPXLEAsync(translatedBody, req.tpxleToken, realm, clientId);
  } catch (err) {
    next(err);
    return;
  }

  res.status(200).end();
};

export const downlinkToLoriot = async (req, res) => {
  /* ** Check if request body is correct ** */
  const devEUI = req.body.deveui?.toLowerCase();
  if (!devEUI) {
    logger.warn(`DL: There is no "deveui" field in request body.`);
    res.write('There is no "deveui" field in request body.');
    res.status(400).end();
    return;
  }

  const nitapikey = req.params.nitapikey || 'loriot'; // For backward compatibility, we allow not specifying nitapikey in the url!
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
    res.status(400).send('Invalid request body. (Failed to translate request body.)\n');
    return;
  }

  /* ** Get downlinkData from DB. ** */
  let downlinkData;
  try {
    downlinkData = await DownlinkDataModel.getDLData(nitapikey, devEUI);
  } catch (err) {
    logger.error(err.stack);
    res.status(500).end();
    return;
  }
  if (!downlinkData) {
    logger.warn(`DL: DevEUI: ${devEUI}: DownlinkData does not exists in the db yet.`);
    res.status(404).send(`DL: DevEUI: ${devEUI}: DownlinkData does not exists in the db yet.\n`);
    return;
  }

  /* ** Send downlink frame to NS ** */
  let nsRes;
  try {
    nsRes = await fetch(downlinkData.downlinkUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${downlinkData.downlinkAPIKey}`,
      },
      body: JSON.stringify(translatedBody),
    });
  } catch (err) {
    logger.error(err.stack);
    res.status(200).end();
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

  res.status(200).end();
};
