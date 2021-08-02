import { stringify } from 'querystring';
import fetch from 'node-fetch';

import cfg from '../config.js';
import logger from '../logger.js';

const getAccessTokenAsync = async (clientID, clientSecret, devEUI) => {
  /* ** Send accessToken request to DX-API ** */
  let dxapiTokenResponse;
  try {
    dxapiTokenResponse = await fetch(cfg.DXAPI_TOKEN_REQUEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: stringify({
        grant_type: 'client_credentials',
        client_id: clientID,
        client_secret: clientSecret,
      }),
    });
  } catch (err) {
    logger.error(err.stack);
    return undefined;
  }
  logger.debug(
    `UL: DevEUI: ${devEUI}: Token requested from DX-API. Response status: ${dxapiTokenResponse.status} ${dxapiTokenResponse.statusText}`,
  );

  let accessTokenParsed;
  try {
    accessTokenParsed = await dxapiTokenResponse.json();
  } catch (err) {
    logger.error(err.stack);
    return accessTokenParsed;
  }
  logger.debug(`UL: DevEUI: ${devEUI}: Access Token received from DX-API`);
  return accessTokenParsed.access_token;
};

const sendToTPXLEAsync = async (translatedBody, accessToken, clientID, clientSecret) => {
  const devEUI = translatedBody.deviceEUI;
  const accessTokenValidated =
    accessToken || (await getAccessTokenAsync(clientID, clientSecret, devEUI));

  if (!accessTokenValidated) {
    logger.debug('Unable to get an Access Token for TPXLE.');
    return;
  }

  /* ** Send traslatedBody to TPX LE ** */
  let tpxleResponse;
  try {
    tpxleResponse = await fetch(cfg.TPXLE_FEED_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessTokenValidated}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(translatedBody),
    });
  } catch (err) {
    logger.error(err.stack);
    return;
  }
  logger.debug(`Bearer ${accessTokenValidated}`);
  logger.debug(
    `UL: DevEUI: ${devEUI}: Message forwarded to TPXLE. Response Status: ${tpxleResponse.status} ${tpxleResponse.statusText}`,
  );
  logger.debug(JSON.stringify(translatedBody));

  let tpxleResponseText;
  try {
    tpxleResponseText = await tpxleResponse.text();
  } catch (err) {
    logger.error(err.stack);
    return;
  }
  if (tpxleResponseText) {
    logger.debug(tpxleResponseText);
  }
};

export default sendToTPXLEAsync;
