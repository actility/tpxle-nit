import { stringify } from 'querystring';
import fetch from 'node-fetch';

import cfg from '../config.js';
import logger from '../logger.js';

const getAccessTokenDev1Async = async (clientID, clientSecret, devEUI) => {
  /* ** Send accessToken request to DX-API ** */
  let dxapiTokenResponse;
  try {
    dxapiTokenResponse = await fetch(cfg.DEV1_TOKEN_REQUEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: stringify({
        grant_type: cfg.DEV1_GRANT_TYPE,
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

const getAccessTokenLelabAsync = async (clientID, clientSecret, realm, devEUI) => {
  /* ** Send accessToken request to DX-API ** */
  let dxapiTokenResponse;
  try {
    dxapiTokenResponse = await fetch(
      `${cfg.LELAB_TOKEN_REQUEST_URL}/realms/${realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: stringify({
          username: clientID,
          password: clientSecret,
          grant_type: cfg.LELAB_GRANT_TYPE,
          scope: cfg.LELAB_SCOPE,
          client_id: cfg.LELAB_CLIENT_ID,
        }),
      },
    );
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

const sendToTPXLEAsync = async (translatedBody, accessToken, clientID, clientSecret, realm) => {
  const devEUI = translatedBody.deviceEUI;

  let accessTokenValidated;
  if (accessToken) {
    accessTokenValidated = accessToken;
  } else if (realm === cfg.LELAB_REALM) {
    accessTokenValidated = await getAccessTokenLelabAsync(
      clientID,
      clientSecret,
      // cfg.LELAB_REALM,
      devEUI,
    );
  } else {
    accessTokenValidated = await getAccessTokenDev1Async(
      clientID,
      clientSecret,
      cfg.DEV1_REALM,
      devEUI,
    );
  }

  if (!accessTokenValidated) {
    logger.debug('Unable to get an Access Token for TPXLE.');
    return;
  }

  /* ** Send traslatedBody to TPX LE ** */
  let feedUrl;
  if (realm === cfg.LELAB_REALM) {
    feedUrl = cfg.LELAB_FEED_URL;
  } else {
    feedUrl = cfg.DEV1_FEED_URL;
  }

  let tpxleResponse;
  try {
    tpxleResponse = await fetch(feedUrl, {
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
