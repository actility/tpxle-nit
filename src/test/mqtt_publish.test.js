import fs from 'fs';
import dotenv from 'dotenv';
import mqtt from 'mqtt';

dotenv.config({ path: new URL('./.env', import.meta.url) });

// const testTarget = process.env.TEST_TARGET;
// const nsName = 'actility'; // NS Specific !!!
const nsName = 'senet'; // NS Specific !!!

// const leId = 'dev1';
const leId = 'le-lab';

const bodyExampleText = fs.readFileSync(
  new URL(`./uplink_data_sample_from_${nsName}.json`, import.meta.url),
);

const bodyDev1 = JSON.parse(bodyExampleText);

// bodyDev1.DevEUI_uplink.DevEUI = process.env.DEV_EUI; // NS Specific !!! Actility
// bodyDev1.devEui = process.env.DEV_EUI.toLowerCase(); // NS Specific !!! Senet
bodyDev1.devEui = process.env.DEV_EUI_MOBILE_APP.toLowerCase(); // NS Specific !!! Senet

const url = process.env.BROKER_URL;
const options = {
  clean: true,
  connectTimeout: 4000,
  // clientId: 'emqx_test',
  // username: process.env.DEV1_CLIENT_ID,
  // password: process.env.DEV1_CLIENT_SECRET,
  username: process.env.LELAB_CLIENT_ID,
  password: process.env.LELAB_CLIENT_SECRET,
  rejectUnauthorized: false,
  // ca: process.env.CA_CERT_LOCATION,
};

// const topic = `${process.env.CLIENT_ID}/NS/${nsName}/NIT/${process.env.NIT_ID}/LE/${leId}/AS`;
const topic = `${process.env.CLIENT_ID_KEYCLOAK}/NS/${nsName}/NIT/${process.env.NIT_ID}/LE/${leId}/AS`;
console.log(topic);

const mqttClient = mqtt.connect(url, options);
mqttClient.on('connect', () => {
  console.log('MQTT Uplink Client Connected');
  // console.log(JSON.stringify(bodyDev1));
  mqttClient.publish(topic, JSON.stringify(bodyDev1));
  mqttClient.end();
});
