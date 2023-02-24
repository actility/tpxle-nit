import logger from '../logger.js';

const uplinkMQTT1 = (mqttClient) => async (req) => {
  /* ********************************************************** *
   * URL Pattern:                                               *
   *   '/mqtt/:operatorId/:subscriberId/LE_AS/:asId'            *
   * TOPIC Pattern:                                             *
   *   `${operatorId}|${subscriberId}/LE_AS/${asId}/${devEUI}`  *
   * ********************************************************** */

  const { operatorId, subscriberId, asId } = req.params;
  const devEUI = req.body.deviceEUI;
  const topic = `${operatorId}|${subscriberId}/LE_AS/${asId}/${devEUI}`;

  logger.info(`LE_AS: ${devEUI} : Message received and need to be forwarded to topic: ${topic}`);

  if (!devEUI) {
    logger.warn(`LE_AS: Missing "deviceEUI" field from request body.`);
    return;
  }

  mqttClient.publish(topic, JSON.stringify(req.body), {
    qos: 0,
    retain: true,
  });
};

export default uplinkMQTT1;
