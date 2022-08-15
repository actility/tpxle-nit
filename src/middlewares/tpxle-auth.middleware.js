import { stringify } from 'querystring';
import fetch from 'node-fetch';

import logger from '../logger.js';

import AccessTokensModel from '../models/access-tokens.model.js';

const REALM_PREFIXES = {
  'abeeway-mobile-app': 'NIT__ABEEWAYMOBILEAPP_',
  dev1: 'NIT__DEV1_',
  'le-lab': 'NIT__LELAB_',
  rnd: 'NIT__RND_',
};

export const getAccessTokenAsync = async (clientId, clientSecret, realm) => {
  let url;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  if (process.env[`${REALM_PREFIXES[realm]}GRANT_TYPE`] === 'client_credentials') {
    url = process.env[`${REALM_PREFIXES[realm]}TOKEN_REQUEST_URL`];

    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');
    urlencoded.append('client_id', clientId);
    urlencoded.append('client_secret', clientSecret);

    options.body = urlencoded;
  } else if (process.env[`${REALM_PREFIXES[realm]}GRANT_TYPE`] === 'password') {
    options.body = stringify({
      username: clientId,
      password: clientSecret,
      grant_type: 'password',
      scope: process.env[`${REALM_PREFIXES[realm]}SCOPE`],
      client_id: process.env[`${REALM_PREFIXES[realm]}CLIENT_ID`],
    });
    url = `${
      process.env[`${REALM_PREFIXES[realm]}TOKEN_REQUEST_URL`]
    }/realms/${realm}/protocol/openid-connect/token`;
  } else {
    throw Error(`UL: getAccessTokenAsync(): clientId: ${clientId}: Invalid realm/grant_time`);
  }

  let accessToken;

  try {
    accessToken = await AccessTokensModel.getAccessToken(realm, clientId);
  } catch (err) {
    throw Error(
      `UL: getAccessTokenAsync(): clientId: ${clientId}, AccessTokensModel.getAccessToken: ${err.stack}`,
    );
  }

  if (accessToken) {
    logger.debug(`UL: getAccessTokenAsync: clientId: ${clientId}: Token found in cache.`);
    return accessToken;
  }

  logger.silly(url);
  logger.silly(JSON.stringify(options, null, 4));

  let dxapiTokenResponse;

  try {
    dxapiTokenResponse = await fetch(url, options);
  } catch (err) {
    throw Error(
      `UL: getAccessTokenAsync: clientId: ${clientId}: Error happened while getting access token: ${err.stack}`,
    );
  }

  if (!dxapiTokenResponse.ok) {
    throw Error(
      `UL: getAccessTokenAsync: clientId: ${clientId}: HTTP error happened while getting access token: ${dxapiTokenResponse.status}, ${dxapiTokenResponse.statusText}`,
    );
  }

  let dxapiTokenResponseParsed;
  try {
    dxapiTokenResponseParsed = await dxapiTokenResponse.json();
    accessToken = dxapiTokenResponseParsed.access_token;
  } catch (err) {
    throw Error(
      `UL: getAccessTokenAsync: clientId: ${clientId}: Error happened while parsing dxapiTokenResponse: ${err.stack}`,
    );
  }

  if (!accessToken) {
    throw Error(
      `UL: getAccessTokenAsync: clientId: ${clientId}: Token response does not include an 'access_token' field.`,
    );
  }

  logger.debug(
    `UL: getAccessTokenAsync: clientId: ${clientId}: Token received from token endpoint.`,
  );
  logger.silly(accessToken);

  try {
    await AccessTokensModel.setAccessToken(realm, clientId, accessToken, clientSecret);
  } catch (err) {
    logger.warning(
      `UL: getAccessTokenAsync: clientId: ${clientId}: error whiile saving accessToken: ${err.staack}`,
    );
  }

  return accessToken;
};

export const tpxleAuthAsync = async (req) => {
  let accessToken;
  let clientId;
  let clientSecret;
  let realm;

  if (req.headers.authorization) {
    [clientId, clientSecret, realm] = req.headers.authorization.split('|');
    if (clientId === '') {
      accessToken = clientSecret;
    }
  } else {
    accessToken = req.headers['x-access-token'];
    clientId = req.headers['x-client-id'];
    clientSecret = req.headers['x-client-secret'];
    realm = req.headers['x-realm'] || process.env.NIT__DEFAULT_REALM;
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  logger.debug(`UL: Message received from NS: "${ip}"`);

  if (!(accessToken || (clientId && clientSecret))) {
    throw Error(
      `UL: tpxleAuthAsync(): IP: ${ip}, "authorization" or ("x-access-token" or (x-client-id and x-client-secret)) headers are mandatory!`,
      // `${JSON.stringify(req.headers,)}`,
    );
  }

  if (!process.env.NIT__VALID_REALMS.split(',').includes(realm)) {
    throw Error(`UL: tpxleAuthAsync(): IP: ${ip}, invalid realm!`);
  }

  let accessTokenValidated;
  if (accessToken) {
    // TODO: validate access token!!!
    accessTokenValidated = accessToken;
  } else {
    try {
      accessTokenValidated = await getAccessTokenAsync(clientId, clientSecret, realm);
    } catch (err) {
      throw Error(`UL: tpxleAuthAsync(): IP: ${ip}, ${err.stack}`);
    }
  }

  // req.tpxleToken = accessTokenValidated;

  return accessTokenValidated;
};

export const tpxleAuth = async (req, res, next) => {
  let tpxleToken;
  try {
    tpxleToken = await tpxleAuthAsync(req);
  } catch (err) {
    logger.error(`tpxleAuth() error: ${err.stack}`);
    next(err);
  }
  req.tpxleToken = tpxleToken;
  next();
};
