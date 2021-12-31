import dotenv from 'dotenv';
import logger from '../logger.js';

import { translateDownlinkAll } from '../services/nit-all.service.js';

dotenv.config({ path: new URL('../.env', import.meta.url) });

export const downlinkMQTT = (mqttClient) => async (req, res) => {
  /* ** Check if request body is correct ** */
  const devEUI = req.body.deveui?.toLowerCase();
  if (!devEUI) {
    logger.warn(`DL: There is no "deveui" field in request body.`);
    res.write('There is no "deveui" field in request body.');
    res.status(400).end();
    return;
  }

  const { leId, subscriberId, nsVendor } = req.params;

  // TODO: To verify validity of params!!!

  if (!leId) {
    logger.warn(`DL: There is no "leId" parameter in the url.`);
    res.write('There is no "leId" parameter in the url.');
    res.status(400).end();
    return;
  }

  if (!subscriberId) {
    logger.warn(`DL: There is no "subscriberId" parameter in the url.`);
    res.write('There is no "subscriberId" parameter in the url.');
    res.status(400).end();
    return;
  }

  if (!nsVendor) {
    logger.warn(`DL: There is no "ns" parameter in the url.`);
    res.write('There is no "ns" parameter in the url.');
    res.status(400).end();
    return;
  }

  logger.debug(`DL: DevEUI: ${devEUI}: DL message received from TPXLE.`);

  // console.log(JSON.stringify(req.body, null, 4));

  /* ** Translate message body ** */
  let translatedBody;
  try {
    translatedBody = translateDownlinkAll[nsVendor](req.body);
  } catch (err) {
    logger.error(err.stack);
    res.status(400).send('Invalid request body. (Failed to translate request body.)\n');
    return;
  }

  console.log(JSON.stringify(translatedBody, null, 4));

  // const topic = `${leId}/${subscriberId}/${linkId}/${ns}`;

  // const topic = `${subscriberId}/AS/LE/${leId}/NIT/${process.env.NIT_ID}/NS/${nsVendor}`;
  const topic = `${subscriberId}/NIT/${process.env.NIT_ID}/NS/${nsVendor}`;
  console.log(topic);

  mqttClient.publish(topic, JSON.stringify(translatedBody), { qos: 2 });

  res.status(201).end();
};

export const uplinkMQTT = (mqttClient) => (req, res) => {
  if (!req.body.deviceEUI) {
    res.status(400).end();
    return;
  }
  if (!req.body.customerId) {
    res.status(400).end();
    return;
  }

  // /uplink_mqtt/:subscriberId/:leId
  const { leId, subscriberId } = req.params;

  if (subscriberId !== req.body.customerId.replace(/^10+/, '')) {
    res.status(400).end();
    return;
  }

  mqttClient.publish(
    `${subscriberId}/LE/${leId}/AS/${req.body.deviceEUI}`,
    JSON.stringify(req.body),
    {
      qos: 0,
      retain: true,
    },
  );
  res.status(200).end();
};
