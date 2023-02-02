import logger from '../logger.js';
import { translateUplink /* translateDownlink */ } from '../services/nit-proximus.service.js';
import sendToTPXLEAsync from '../services/send-to-tpxle.js';

export const uplinkFromProximusAsync = async (req) => {
  const devEUI = req.body.DevEUI;
  if (!devEUI) {
    logger.warn('UL: Missing "devEUI" from request body!');
    return;
  }

  logger.debug(`UL: DevEUI: ${devEUI}: UL message received from NS.`);

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

export const downlinkToProximusAsync = async (req) => {
  /* ** Check if request body is correct ** */
  logger.debug(`DL: Poximus Downlink is not implemented!.\n${req.body}`);
};
