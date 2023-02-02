import fetch from 'node-fetch';

import logger from '../logger.js';
import DownlinkDataModel from '../models/downlink-data.model.js';
import { translateUplink, translateDownlink } from '../services/nit-actility.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

export const uplinkFromActilityAsync = async (req) => {
  const devEUI = req.body.DevEUI_uplink?.DevEUI; // NS Specific !!!
  const downlinkUrl = req.body.DevEUI_uplink?.downlinkUrl;

  if (!devEUI) {
    logger.warn('UL: Missing "DevEUI_uplink.DevEUI" from request body!');
    return;
  }
  if (!downlinkUrl) {
    logger.warn('UL: Missing "DevEUI_uplink.downlinkUrl" from request body!');
    return;
  }

  const nitapikey = req.params.nitapikey || 'actility'; // For backward compatibility, we allow not specifying nitapikey in the url!

  logger.debug(`UL: DevEUI: ${devEUI}: UL message received from NS.`);

  /* ** Save downlink data in db ** */
  DownlinkDataModel.setDLData(nitapikey, devEUI, {
    downlinkUrl,
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
    await sendToTPXLEAsync(
      translatedBody,
      req.middleware.tpxleToken,
      req.middleware.architectureId,
      req.middleware.clientId,
    );
  } catch (err) {
    logger.error(err.stack);
  }
};

export const downlinkToActilityAsync = async (req) => {
  /* ** Check if request body is correct ** */
  // const devEUI = req.body.DevEUI_uplink?.DevEUI;
  const devEUI = req.body.deveui?.toLowerCase();
  if (!devEUI) {
    logger.warn(`DL: There is no "DevEUI" field in request body.`);
    return;
  }

  const nitapikey = req.params.nitapikey || 'actility'; // For backward compatibility, we allow not specifying nitapikey in the url!

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
