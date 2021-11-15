// import { stringify } from 'querystring';
import fetch from 'node-fetch';
import httpError from 'http-errors';

import cfg from '../config.js';
import logger from '../logger.js';
import AccessTokensModel from '../models/access-tokens.model.js';

const sendToTPXLEAsync = async (translatedBody, accessToken, realm, clientId) => {
  const devEUI = translatedBody.deviceEUI;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(translatedBody),
  };

  try {
    const tpxleResponse = await fetch(cfg[realm].FEED_URL, options);
    if (!tpxleResponse.ok) {
      logger.error(
        `UL: sendToTPXLEAsync: DevEUI: ${devEUI}:  HTTP error happened while forwarding UL to TPXLE: ${tpxleResponse.status}, ${tpxleResponse.statusText}`,
      );

      logger.error(`KAKUKK: ${typeof tpxleResponse.status}`);
      if (tpxleResponse.status === 401) {
        logger.error('KAKUKK');
        AccessTokensModel.deleteAccessToken(clientId);
      }

      throw httpError(500, `HTTP error happened while forwarding UL to TPXLE`);
    }
    const tpxleResponseText = await tpxleResponse.text();
    logger.debug(
      `UL: sendToTPXLEAsync: DevEUI: ${devEUI}: Message forwarded to TPXLE. ${tpxleResponseText}`,
    );
    return tpxleResponseText;
  } catch (err) {
    if (httpError.isHttpError(err)) {
      throw err;
    } else {
      logger.error(
        `UL: DevEUI: ${devEUI}: The mesage couldn't be forwarded to TPXLE: ${err.stack}`,
      );
      throw httpError(500, `The mesage couldn't be forwarded to TPXLE.`);
    }
  }
};

export default sendToTPXLEAsync;
