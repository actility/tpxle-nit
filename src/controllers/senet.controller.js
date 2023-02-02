import fetch from 'node-fetch';

import logger from '../logger.js';
import DownlinkDataModel from '../models/downlink-data.model.js';
import { translateUplink, translateDownlink } from '../services/nit-senet.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

export const uplinkFromSenetAsync = async (req) => {
  const devEUI = req.body.devEui; // NS Specific !!!
  const downlinkApi = req.headers['x-downlink-api'];
  const downlinkApikey = req.headers['x-downlink-apikey'];

  if (!devEUI) {
    logger.warn('UL: Missing "devEUI" from request body!');
    return;
  }
  if (!downlinkApi) {
    logger.warn('UL: Missing "x-downlink-api" from request header!');
    return;
  }
  if (!downlinkApikey) {
    logger.warn('UL: Missing "x-downlink-apikey" from request header!');
    return;
  }

  const nitapikey = req.params.nitapikey || 'senet'; // For backward compatibility, we allow not specifying nitapikey in the url!

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

export const downlinkToSenetAsync = async (req) => {
  /* ** Check if request body is correct ** */
  const devEUI = req.body.deveui?.toLowerCase();
  if (!devEUI) {
    logger.warn(`DL: There is no "deveui" field in request body.`);
    return;
  }

  const nitapikey = req.params.nitapikey || 'senet'; // For backward compatibility, we allow not specifying nitapikey in the url!

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
    return;
  }
  if (nsResText) {
    logger.debug(nsResText);
  }
};
