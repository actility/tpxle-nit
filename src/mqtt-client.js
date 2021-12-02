import mqtt from 'mqtt';

import dotenv from 'dotenv';

dotenv.config({ path: new URL('./tests/.env', import.meta.url) });

const url = 'tls://DESKTOP-JE5MKR1:8883';
const options = {
  clean: true,
  connectTimeout: 4000,
  // clientId: 'emqx_test',
  username: encodeURIComponent(process.env.DEV1_CLIENT_ID),
  password: encodeURIComponent(process.env.DEV1_CLIENT_SECRET),
  rejectUnauthorized: false,
  ca: '/etc/mosquitto/certs/ca.crt',
};

export const createMQTTUplinkClient = () => {
  const mqttClient = mqtt.connect(url, options);
  mqttClient.on('connect', () => {
    console.log('MQTT Uplink Client Connected');
    mqttClient.subscribe('2167/uplink', (err) => {
      if (!err) {
        mqttClient.publish('2167/uplink', 'Hello mqtt Uplink');
      }
    });
  });

  mqttClient.on('message', (topic, message) => {
    console.log(topic);
    console.log(message.toString());
    // mqttClient.end();
  });

  return mqttClient;
};

export const createMQTTDownlinkClient = () => {
  const mqttClient = mqtt.connect(url, options);
  mqttClient.on('connect', () => {
    console.log('MQTT Downlink Client Connected');
    mqttClient.subscribe('2167/downlink', (err) => {
      if (!err) {
        mqttClient.publish('2167/downlink', 'Hello mqtt Downlink');
      }
    });
  });

  mqttClient.on('message', (topic, message) => {
    console.log(topic);
    console.log(message.toString());
    // mqttClient.end();
  });

  return mqttClient;
};
