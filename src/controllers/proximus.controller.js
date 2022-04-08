import logger from '../logger.js';
import { translateUplink } from '../services/nit-actility.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

import cfg from '../config.js';

// eslint-disable-next-line import/prefer-default-export
export const uplinkFromProximus = async (req, res, next) => {
  /* ** Check if request body is correct ** */
  const errMsg =
    '(x-access-token or (x-client-id and x-client-secret)) in header and DevEUI_uplink.DevEUI in body are mandatory!';
  let accessToken;
  let clientId;
  let clientSecret;
  let realm;
  let devEUI;
  try {
    accessToken = req.headers['x-access-token'];
    clientId = req.headers['x-client-id'];
    clientSecret = req.headers['x-client-secret'];
    realm = req.headers['x-realm'] || cfg.DEFAULT_REALM;
    devEUI = req.body.DevEUI;
  } catch (err) {
    logger.warn(err.stack);
    logger.warn(`UL: ${errMsg}`);
    logger.warn(`UL: ${JSON.stringify(req.body)}`);
    res.status(400).send(errMsg);
    return;
  }
  if (!devEUI) {
    logger.warn('UL: Missing DevEUI!');
    res.status(400).send('Missing DevEUI!');
    return;
  }
  if (!cfg.VALID_REALMS.includes(realm)) {
    logger.warn('UL: Invalid realm!');
    res.status(400).send('Invalid realm!');
    return;
  }
  if (!((accessToken || (clientId && clientSecret)) && devEUI)) {
    logger.warn(`UL: DevEUI: ${devEUI}: ${errMsg}`);
    res.status(400).send(errMsg);
    return;
  }

  logger.debug(`UL: DevEUI: ${devEUI}: UL message received from NS.`);

  /* ** Translate message body ** */
  let translatedBody;
  try {
    translatedBody = translateUplink(req.body);
  } catch (err) {
    logger.error(err.stack);
    res.status(400).send('Invalid request body. (Failed to translate request body.)\n');
    return;
  }

  // sendToTPXLEAsync(translatedBody, accessToken, clientId, clientSecret, realm);
  try {
    await sendToTPXLEAsync(translatedBody, req.tpxleToken, realm, clientId);
  } catch (err) {
    next(err);
    return;
  }

  res.status(200).end();
};
