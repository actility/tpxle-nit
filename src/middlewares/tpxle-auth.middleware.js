import { stringify } from 'querystring';
import fetch from 'node-fetch';
import httpError from 'http-errors';

import logger from '../logger.js';

import AccessTokensModel from '../models/access-tokens.model.js';

const REALM_PREFIXES = { dev1: 'NIT__DEV1_', 'le-lab': 'NIT__LELAB_', rnd: 'NIT__RND_' };

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
    /*
    options.body = stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: cfg[realm].GRANT_TYPE,
    });
    */
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
    logger.error(`UL: getAccessTokenAsync: clientId: ${clientId}: Invalid realm/grant_time`);
    throw httpError(400, 'Invalid realm.');
  }

  let accessToken;

  accessToken = await AccessTokensModel.getAccessToken(realm, clientId);
  if (accessToken) {
    logger.debug(`UL: getAccessTokenAsync: clientId: ${clientId}: Token found in cache.`);
    return accessToken;
  }

  try {
    logger.silly(url);
    logger.silly(JSON.stringify(options, null, 4));

    const dxapiTokenResponse = await fetch(url, options);
    if (!dxapiTokenResponse.ok) {
      logger.error(
        `UL: getAccessTokenAsync: clientId: ${clientId}: HTTP error happened while getting access token: ${dxapiTokenResponse.status}, ${dxapiTokenResponse.statusText}`,
      );
      throw httpError(500, `HTTP Error happened while getting access token`);
    }
    const dxapiTokenResponseParsed = await dxapiTokenResponse.json();
    accessToken = dxapiTokenResponseParsed.access_token;
    if (accessToken) {
      logger.debug(
        `UL: getAccessTokenAsync: clientId: ${clientId}: Token received from token endpoint.`,
      );
      logger.silly(accessToken);
      await AccessTokensModel.setAccessToken(realm, clientId, accessToken, clientSecret);
      return accessToken;
    }
    logger.error(
      `UL: getAccessTokenAsync: clientId: ${clientId}: Token response does not include an 'access_token' field.`,
    );
    throw httpError(500, `Token response does not include an 'access_token' field.`);
  } catch (err) {
    if (httpError.isHttpError(err)) {
      throw err;
    } else {
      logger.error(
        `UL: getAccessTokenAsync: clientId: ${clientId}: Error happened while getting access token: ${err.stack}`,
      );
      throw httpError(500, `Error happened while getting access token`);
    }
  }
};

export const tpxleAuth = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  const clientId = req.headers['x-client-id'];
  const clientSecret = req.headers['x-client-secret'];
  const realm = req.headers['x-realm'] || process.env.NIT__DEFAULT_REALM;

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  logger.error(`UL: Message received from NS: "${ip}"!`);

  if (!(accessToken || (clientId && clientSecret))) {
    logger.error(
      `UL: ${ip}: x-access-token or (x-client-id and x-client-secret)) headers are mandatory!`,
    );
    next(
      httpError(
        400,
        `(x-access-token or (x-client-id and x-client-secret)) headers are mandatory!`,
      ),
    );
    return;
  }

  if (!process.env.NIT__VALID_REALMS.split(',').includes(realm)) {
    logger.error(`UL: Invalid Realm!`);
    next(httpError(400, `Invalid Realm!`));
    return;
  }

  let accessTokenValidated;
  if (accessToken) {
    // TODO: validate access token!!!
    accessTokenValidated = accessToken;
  } else {
    try {
      accessTokenValidated = await getAccessTokenAsync(clientId, clientSecret, realm);
    } catch (err) {
      next(err);
      return;
    }
  }

  req.tpxleToken = accessTokenValidated;
  // res.send('The middleware works!');
  next();
};
