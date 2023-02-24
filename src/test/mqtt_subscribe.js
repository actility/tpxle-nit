import mqtt from 'mqtt';

import '../config.js';
import './test_config.js';

// const topics = [
//   'dev-ope|100001180|le-lab|dc76a497-f97b-418e-a621-5ea2ecd0b74e/#',
//   'dev-ope|100001180/#',
// ];
const topics = [
  'dev-ope|100023878/#',
  // 'dev-ope|100023878/LE_AS/abeemap',
];

const line = '-------------------------------------------------------------------------------';

const url = process.env.NIT__BROKER_URL;
const options = {
  clean: true,
  connectTimeout: 4000,
  username: process.env.NIT__MQTT_SUPER_USER,
  password: process.env.NIT__MQTT_SUPER_PASSWD,
  rejectUnauthorized: false,
};

const mqttClient = mqtt.connect(url, options);

mqttClient.on('connect', () => {
  console.log(`\n\nMQTT Uplink Client Connected to ${url}`);

  mqttClient.subscribe(topics, (err) => {
    if (!err) {
      console.log(`You subscribed to the following topics:\n${JSON.stringify(topics, null, 2)}\n`);
    }
  });
});

mqttClient.on('message', async (topic, message) => {
  console.log(`${line}\nMSG RECEIVED AT TOPIC: "${topic}"\n${line}\n${message.toString()}`);
});
