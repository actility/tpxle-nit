import { stringify } from 'querystring';
import fetch from 'node-fetch';
import httpError from 'http-errors';

import cfg from '../config.js';
import logger from '../logger.js';

import AccessTokensModel from '../models/access-tokens.model.js';

export const getAccessTokenAsync = async (clientId, clientSecret, realm) => {
  let url;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  if (cfg[realm].GRANT_TYPE === 'client_credentials') {
    url = cfg[realm].TOKEN_REQUEST_URL;
    options.body = stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: cfg[realm].GRANT_TYPE,
    });
  } else if (cfg[realm].GRANT_TYPE === 'password') {
    options.body = stringify({
      username: clientId,
      password: clientSecret,
      grant_type: cfg[realm].GRANT_TYPE,
      scope: cfg[realm].SCOPE,
      client_id: cfg[realm].CLIENT_ID,
    });
    url = `${cfg[realm].TOKEN_REQUEST_URL}/realms/${realm}/protocol/openid-connect/token`;
  } else {
    logger.error(`UL: getAccessTokenAsync: clientId: ${clientId}: Invalid realm/grant_time`);
    throw httpError(400, 'Invalid realm.');
  }

  let accessToken = await AccessTokensModel.getAccessToken(clientId);
  if (accessToken) {
    logger.debug(
      `UL: getAccessTokenAsync: clientId: ${clientId}: Token found in cache: ${accessToken}`,
    );
    return accessToken;
  }

  try {
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
        `UL: getAccessTokenAsync: clientId: ${clientId}: Token received from token endpoint: ${accessToken}`,
      );
      AccessTokensModel.setAccessToken(clientId, accessToken);
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
  logger.debug('');
  logger.debug(JSON.stringify(req.body, null, 4));
  logger.debug('');

  const accessToken = req.headers['x-access-token'];
  const clientId = req.headers['x-client-id'];
  const clientSecret = req.headers['x-client-secret'];
  const realm = req.headers['x-realm'] || cfg.DEFAULT_REALM;

  if (!(accessToken || (clientId && clientSecret))) {
    logger.error(`UL: x-access-token or (x-client-id and x-client-secret)) headers are mandatory!`);
    next(
      httpError(
        400,
        `(x-access-token or (x-client-id and x-client-secret)) headers are mandatory!`,
      ),
    );
  }

  if (!cfg.VALID_REALMS.includes(realm)) {
    logger.error(`UL: Invalid Realm!`);
    next(httpError(400, `Invalid Realm!`));
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
    }
  }

  req.tpxleToken = accessTokenValidated;
  // res.send('The middleware works!');
  next();
};
