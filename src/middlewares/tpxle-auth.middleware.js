import { stringify } from 'querystring';
import fetch from 'node-fetch';

import logger from '../logger.js';

import AccessTokensModel from '../models/access-tokens.model.js';

import getConfParam from '../config/get-conf-params.js';

export const getAPIKeysAsync = async (accessToken, architectureId) => {
  const url = getConfParam(architectureId, 'APIKEY_MGMT_URL');
  console.log(architectureId, url);

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  /*
  options.method = 'POST';
  options.body = {
    "scope": "ALL",
    "name": "Example API key"
  }
  */

  let resultJSON;
  try {
    const res = await fetch(url, options);
    resultJSON = await res.json();
  } catch (err) {
    throw Error(`UL: getAPIKeysAsync(): Cannot get API Keys: ${err.stack}`);
  }
  return resultJSON;
};

export const getAccessTokenAsync = async (clientId, clientSecret, architectureId) => {
  let url;

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  switch (getConfParam(architectureId, 'GRANT_TYPE')) {
    case 'client_credentials': {
      url = getConfParam(architectureId, 'TOKEN_REQUEST_URL');

      const urlencoded = new URLSearchParams();
      urlencoded.append('grant_type', 'client_credentials');
      urlencoded.append('client_id', clientId);
      urlencoded.append('client_secret', clientSecret);

      options.body = urlencoded;

      break;
    }
    case 'password': {
      options.body = stringify({
        username: clientId,
        password: clientSecret,
        grant_type: 'password',
        scope: getConfParam(architectureId, 'SCOPE'),
        client_id: getConfParam(architectureId, 'CLIENT_ID'),
      });
      url = `${getConfParam(architectureId, 'TOKEN_REQUEST_URL')}/realms/${getConfParam(
        architectureId,
        'REALM',
      )}/protocol/openid-connect/token`;
      break;
    }
    default: {
      throw Error(`UL: getAccessTokenAsync(): clientId: ${clientId}: Invalid grant_time`);
    }
  }

  let accessToken;

  try {
    accessToken = await AccessTokensModel.getAccessToken(architectureId, clientId);
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

  console.log(url);
  console.log(options);

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
    await AccessTokensModel.setAccessToken(architectureId, clientId, accessToken, clientSecret);
  } catch (err) {
    logger.warning(
      `UL: getAccessTokenAsync: clientId: ${clientId}: error whiile saving accessToken: ${err.staack}`,
    );
  }

  return accessToken;
};

export const createUserIdFromAccessToken = async (accessToken, architectureId) => {
  let decodedAccessToken;
  try {
    decodedAccessToken = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64'));
  } catch (err) {
    throw Error(`UL: createUserIdFromAccessToken(): ${err.stack}`);
  }

  let userId;
  const operatorId = getConfParam(architectureId, 'OPERATOR_ID');
  let subscriberId;

  if (decodedAccessToken.parentSubscriptions) {
    subscriberId = decodedAccessToken.parentSubscriptions['actility-sup/tpx'][0].subscriberId;
    const realm = getConfParam(architectureId, 'REALM');
    const enduserId = decodedAccessToken.sub;
    userId = `${operatorId}|${subscriberId}|${realm}|${enduserId}`;
  } else {
    subscriberId = (100000000 + parseInt(decodedAccessToken.scope[0].split(':')[1], 10)).toString();
    userId = `${operatorId}|${subscriberId}`;
  }

  return userId;
};

export const tpxleAuthMiddlewareAsync = async (req) => {
  let accessToken;
  let clientId;
  let clientSecret;
  let architectureId;

  if (req.headers.authorization) {
    [clientId, clientSecret, architectureId] = req.headers.authorization.split('|');
    if (clientId === '') {
      accessToken = clientSecret;
    }
  } else {
    accessToken = req.headers['x-access-token'];
    clientId = req.headers['x-client-id'];
    clientSecret = req.headers['x-client-secret'];
    architectureId =
      req.headers['x-architecture-id'] || req.headers['x-realm'] || process.env.NIT__DEFAULT_REALM;
    // 'x-realm' is here for historical reasons
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  logger.debug(`UL: Message received from NS: "${ip}"`);

  if (!(accessToken || (clientId && clientSecret))) {
    throw Error(
      `UL: tpxleAuthMiddlewareAsync(): IP: ${ip}, "authorization" or ("x-access-token" or (x-client-id and x-client-secret)) headers are mandatory! ${JSON.stringify(
        req.headers,
      )}`,
      // `${JSON.stringify(req.headers,)}`,
    );
  }

  if (!process.env.NIT__VALID_ARCHITECTURE_IDS.split(',').includes(architectureId)) {
    throw Error(`UL: tpxleAuthMiddlewareAsync(): IP: ${ip}, invalid architectureId!`);
  }

  let accessTokenValidated;
  if (accessToken) {
    // TODO: validate access token!!!
    accessTokenValidated = accessToken;
  } else {
    try {
      accessTokenValidated = await getAccessTokenAsync(clientId, clientSecret, architectureId);
    } catch (err) {
      throw Error(`UL: tpxleAuthMiddlewareAsync(): IP: ${ip}, ${err.stack}`);
    }
  }

  let userId;
  try {
    userId = createUserIdFromAccessToken(accessTokenValidated, architectureId);
  } catch (err) {
    throw Error(`UL: tpxleAuthMiddlewareAsync(): IP: ${ip}, ${err.stack}`);
  }

  req.middleware = {
    tpxleToken: accessTokenValidated,
    userId,
    architectureId,
    clientId,
  };
};
