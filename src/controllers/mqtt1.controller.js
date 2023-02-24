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
  // const topic = `${userId}/AS_LE/${asId}`;

  logger.info(`LE_AS: ${devEUI} : Message received and need to be forwarded to topic: ${topic}`);
  // logger.info(`LE_AS: ${devEUI} : ${req.middleware?.userId}`);

  // if (userId !== req.middleware?.userId) {
  //   logger.warn(`LE_AS: The user does not have right to publish to topic: "${topic}"`);
  //   return;
  // }
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
