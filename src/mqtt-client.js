import mqtt from 'mqtt';

import logger from './logger.js';
import { translateUplinkAll, translateDownlinkAll } from './services/nit-all.service.js';
import NSVendorsModel from './models/ns-vendors.model.js';

const url = process.env.NIT__BROKER_URL;
const options = {
  clean: false,
  connectTimeout: 30_000,
  clientId: `NIT_${process.env.NIT__ID}`,
  username: process.env.NIT__MQTT_SUPER_USER,
  password: process.env.NIT__MQTT_SUPER_PASSWD,
  rejectUnauthorized: false,
  // ca: process.env.NIT__CA_CERT_LOCATION,
};

// console.log(options);

const topics = [`+/NS_LE/+/+/#`, `+/leSolver_leNIT/#`];
// {userId}/NS_LE/{nsVendor}/{asId}
// {userId}/leSolver_leNIT

const mqttClientFactory = () => {
  const mqttClient = mqtt.connect(url, options);

  const handleError = (err, text, feedbackTopic) => {
    logger.error(
      `MQTT Error reported; feedbackTopic: ${feedbackTopic}; text: ${text};\n${err.stack}`,
    );
    mqttClient.publish(feedbackTopic, text);
  };

  mqttClient.on('connect', () => {
    logger.info('MQTT client connected!');
    mqttClient.subscribe(topics, (err) => {
      if (!err) {
        logger.info(`MQTT Client subscribed to the "${JSON.stringify(topics)}" topics.`);
      }
    });
  });

  mqttClient.on('message', async (incomingTopic, msgBytes) => {
    const topicSegments = incomingTopic.split('/');
    // {userId}/NS_LE/{nsVendor}/{asId}
    // {userId}/leSolver_leNIT
    let feedbackTopic;
    let forwardTopic;

    const [userId, linkId] = topicSegments;

    let nsVendor;
    let asId;

    const msgString = msgBytes.toString();
    let msg;
    let translatedMsg;
    let translatedMsgString;

    logger.debug(`MQTT msg received from topic: "${incomingTopic}"!\n${msgString}`);

    switch (linkId) {
      case 'NS_LE': {
        [, , nsVendor, asId] = topicSegments;

        if (!(nsVendor && asId)) {
          handleError(new Error('Invalid topic pattern!'), 'Invalid topic pattern!', feedbackTopic);
          break;
        }

        feedbackTopic = `${userId}/LE_NS_feedback/${nsVendor}`;
        forwardTopic = `${userId}/leNIT_leSolver/${asId}`;

        try {
          msg = JSON.parse(msgString);
        } catch (err) {
          handleError(err, 'Error while parsing JSON string!', feedbackTopic);
          break;
        }

        try {
          translatedMsg = translateUplinkAll[nsVendor](msg);
        } catch (err) {
          handleError(err, 'Error while translating message!', feedbackTopic);
          break;
        }

        translatedMsgString = JSON.stringify(translatedMsg, null, 2);

        try {
          mqttClient.publish(forwardTopic, translatedMsgString);
          logger.debug(
            `Translated MQTT msg forwarded to topic: "${forwardTopic}"!\n${translatedMsgString}`,
          );
        } catch (err) {
          handleError(err, `Error while publishing to topic: "${forwardTopic}"!`, feedbackTopic);
          break;
        }

        try {
          await NSVendorsModel.setNSVendor(userId, translatedMsg.deviceEUI, nsVendor);
        } catch (err) {
          handleError(err, `Cannot save NSVendor to cache: "${forwardTopic}"!`, feedbackTopic);
          break;
        }

        break;
      }

      case 'leSolver_leNIT':
        feedbackTopic = `${userId}/leNIT_leSolver_feedback`;

        try {
          msg = JSON.parse(msgString);
        } catch (err) {
          handleError(err, 'Error while parsing JSON string!', feedbackTopic);
          break;
        }

        try {
          nsVendor = await NSVendorsModel.getNSVendor(userId, msg.deveui);
        } catch (err) {
          handleError(err, 'Error while getting NSVendor from Cache!', feedbackTopic);
          break;
        }

        forwardTopic = `${userId}/LE_NS/${nsVendor}`;

        try {
          translatedMsg = translateDownlinkAll[nsVendor](msg);
        } catch (err) {
          handleError(err, 'Error while translating message!', feedbackTopic);
          break;
        }

        translatedMsgString = JSON.stringify(translatedMsg, null, 2);

        try {
          mqttClient.publish(forwardTopic, translatedMsgString);
          logger.debug(
            `Translated MQTT msg forwarded to topic: "${forwardTopic}"!\n${translatedMsgString}`,
          );
        } catch (err) {
          handleError(err, `Error while publishing to topic: "${forwardTopic}"!`, feedbackTopic);
          break;
        }

        break;

      default:
        handleError(new Error('Invalid topic pattern!'), 'Invalid topic pattern!', feedbackTopic);
    }
  });

  return mqttClient;
};

export default mqttClientFactory;
