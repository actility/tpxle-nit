import fetch from 'node-fetch';

import logger from '../logger.js';
import DownlinkDataModel from '../models/downlink-data.model.js';
import { translateUplink, translateDownlink } from '../services/nit-helium.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

export const uplinkFromHelium = (req, res) => {
  /* ** Check if request body is correct ** */
  const errMsg =
    '(accessToken or (clientID and clientSecret)) in header and devEUI, downlinkUrl in body are mandatory!';
  let accessToken;
  let clientID;
  let realm;
  let clientSecret;
  let devEUI;
  let downlinkUrl;
  try {
    accessToken = req.headers['x-access-token'];
    clientID = req.headers['x-client-id'];
    clientSecret = req.headers['x-client-secret'];
    realm = req.headers['x-realm'];
    devEUI = req.body.dev_eui?.toLowerCase();
    downlinkUrl = req.body.downlink_url;
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
  if (!((accessToken || (clientID && clientSecret)) && devEUI && downlinkUrl)) {
    logger.warn(`UL: DevEUI: ${devEUI}: ${errMsg}`);
    res.status(400).send(errMsg);
    return;
  }
  logger.debug(`UL: DevEUI: ${devEUI}: UL message received from Helium.`);

  /* ** Save downlink data in db ** */
  DownlinkDataModel.setDLData('helium', devEUI, { downlinkUrl });

  /* ** Translate message body ** */
  let translatedBody;
  try {
    translatedBody = translateUplink(req.body);
  } catch (err) {
    logger.error(err.stack);
    res.status(400).send('Invalid request body. (Failed to translate request body.)\n');
    return;
  }

  sendToTPXLEAsync(translatedBody, accessToken, clientID, clientSecret, realm);

  res.status(200).end();
};

export const downlinkToHelium = async (req, res) => {
  /* ** Check if request body is correct ** */
  const devEUI = req.body.deveui?.toLowerCase();
  if (!devEUI) {
    logger.warn(`DL: There is no "deveui" field in request body.`);
    res.write('There is no "deveui" field in request body.');
    res.status(400).end();
    return;
  }
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
    downlinkData = await DownlinkDataModel.getDLData('helium', devEUI);
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
  logger.debug(
    `DL: DevEUI: ${devEUI}: downlinkData retreived from DB: ${JSON.stringify(downlinkData)}`,
  );

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
