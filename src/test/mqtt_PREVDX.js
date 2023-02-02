import mqtt from 'mqtt';

import '../config.js';
import './test_config.js';

// import examples from './02b_helium_http_spec.js';
// import examples from './02c_ttn_http_spec.js';
// import examples from './02d_chirpstack_http_spec.js';
// import examples from './02e_everynet_http_spec.js';
// import examples from './02f_senet_http_spec.js';
// import examples from './02h_proximus_http_spec.js'; // /////////////////
// import examples from './02i_loriot_http_spec.js';
import examples from './02j_actility_http_spec.js';

const nsVendor = 'actility';
const testCase = 'UL'; // UL|UL_WRONG|DL|DL_WRONG

const line = '-------------------------------------------------------------------------------';

const msgUL = examples.PREVDX_UL.options.body;
const msgULWrong = `${msgUL};`;
const msgDL = examples.PREVDX_DL.options.body;
const msgDLWrong = `${msgDL};`;

const url = process.env.NIT__BROKER_URL;
const options = {
  clean: true,
  connectTimeout: 4000,
  // clientId: 'emqx_test',

  // username: 'test_mqtt_user',
  // password: process.env.TEST__MQTT_API_KEY,

  username: process.env.NIT__MQTT_SUPER_USER,
  password: process.env.NIT__MQTT_SUPER_PASSWD,

  rejectUnauthorized: false,
  // ca: process.env.TEST__CA_CERT_LOCATION,
};

// {userId}/NS_LE/{nsVendor}/{asId}
// {userId}/leSolver_leNIT

const receiveULTopic = `${process.env.TEST__MQTT_TOPIC_USER_ID}/NS_LE/${nsVendor}/${process.env.TEST__MQTT_TOPIC_AS_ID}`;
const receiveULFeedbackTopic = `${process.env.TEST__MQTT_TOPIC_USER_ID}/LE_NS_feedback/${nsVendor}`;
const forwardULTopic = `${process.env.TEST__MQTT_TOPIC_USER_ID}/leNIT_leSolver/${process.env.TEST__MQTT_TOPIC_AS_ID}`;

const receiveDLTopic = `${process.env.TEST__MQTT_TOPIC_USER_ID}/leSolver_leNIT`;
const receiveDLFeedbackTopic = `${process.env.TEST__MQTT_TOPIC_USER_ID}/leNIT_leSolver_feedback`;
const forwardDLTopic = `${process.env.TEST__MQTT_TOPIC_USER_ID}/LE_NS/${nsVendor}`;

// const subscribeTopic = '#';

const mqttClient = mqtt.connect(url, options);

mqttClient.on('connect', () => {
  console.log(`\n\nMQTT Uplink Client Connected to ${url}`);

  mqttClient.subscribe(
    [
      receiveULTopic,
      receiveULFeedbackTopic,
      forwardULTopic,
      receiveDLTopic,
      receiveDLFeedbackTopic,
      forwardDLTopic,
    ],
    (err) => {
      if (!err) {
        console.log(
          `You subscribed to the following topics:\n    "${receiveULTopic}"\n    "${receiveULFeedbackTopic}"\n    "${forwardULTopic}"\n    "${receiveDLTopic}"\n    "${receiveDLFeedbackTopic}"\n    "${forwardDLTopic}"\n`,
        );

        // eslint-disable-next-line default-case
        switch (testCase) {
          case 'UL':
            mqttClient.publish(receiveULTopic, msgUL);
            console.log(`${line}\nMSG SENT TO TOPIC: "${receiveULTopic}"\n${line}\n${msgUL}`);
            break;

          case 'UL_WRONG':
            mqttClient.publish(receiveULTopic, msgULWrong);
            console.log(`${line}\nMSG SENT TO TOPIC: "${receiveULTopic}"\n${line}\n${msgULWrong}`);
            break;

          case 'DL':
            mqttClient.publish(receiveDLTopic, msgDL);
            console.log(`${line}\nMSG SENT TO TOPIC: "${receiveDLTopic}"\n${line}\n${msgDL}`);
            break;

          case 'DL_WRONG':
            mqttClient.publish(receiveDLTopic, msgDLWrong);
            console.log(`${line}\nMSG SENT TO TOPIC: "${receiveDLTopic}"\n${line}\n${msgDLWrong}`);
            break;
        }

        // mqttClient.end();
      } else {
        console.log(
          `You couldn't subscribe to the following topics:\n    "${receiveULTopic}"\n    "${receiveULFeedbackTopic}"\n    "${forwardULTopic}"\n    "${receiveDLTopic}"\n    "${receiveDLFeedbackTopic}"\n    "${forwardDLTopic}"\n`,
        );
        console.error(err.message);
      }
    },
  );
});

mqttClient.on('message', async (topic, message) => {
  console.log(`${line}\nMSG RECEIVED AT TOPIC: "${topic}"\n${line}\n${message.toString()}`);
});
