import logger from '../logger.js';

const uplinkMQTT1 = (mqttClient) => async (req) => {
  /* ****************************** *
   * URL Pattern:                   *
   *   '/mqtt/:userId/LE_AS/:asId'  *
   * TOPIC Pattern:                 *
   *   `${userId}/LE_AS/${asId}`    *
   * ****************************** */

  const { userId, asId } = req.params;
  const devEUI = req.body.deviceEUI;
  const topic = `${userId}/LE_AS/${asId}/${devEUI}`;

  if (userId !== req.middleware?.userId) {
    logger.warn(`LE_AS: The user does not have right to publish to topic: "${topic}"`);
    return;
  }
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
