import dotenv from 'dotenv';
import mqtt from 'mqtt';

dotenv.config({ path: new URL('./.env', import.meta.url) });

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

const mqttClient = mqtt.connect(url, options);
mqttClient.on('connect', () => {
  console.log('MQTT Uplink Client Connected');
  mqttClient.publish('2167/uplink', 'Hello mqtt Uplink');
  mqttClient.end();
});
