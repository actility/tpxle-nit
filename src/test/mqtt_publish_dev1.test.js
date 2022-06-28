import fs from 'fs';
import dotenv from 'dotenv';
import mqtt from 'mqtt';

dotenv.config({ path: new URL('./.env', import.meta.url) });

// const testTarget = process.env.TEST__TARGET;
// const nsName = 'actility'; // NS Specific !!!
// const nsName = 'senet'; // NS Specific !!!
const nsName = 'sptel'; // NS Specific !!!

const leId = 'dev1';
// const leId = 'le-lab';

const bodyExampleText = fs.readFileSync(
  new URL(`./uplink_data_sample_from_${nsName}.json`, import.meta.url),
);

const bodyDev1 = JSON.parse(bodyExampleText);

// bodyDev1.DevEUI_uplink.DevEUI = process.env.TEST__DEV_EUI; // NS Specific !!! Actility
// bodyDev1.devEui = process.env.TEST__DEV_EUI.toLowerCase(); // NS Specific !!! Senet
// bodyDev1.devEui = process.env.TEST__DEV_EUI_MOBILE_APP.toLowerCase(); // NS Specific !!! Senet
bodyDev1.devEUI = process.env.TEST__DEV_EUI.toLowerCase(); // NS Specific !!! Sptel

const url = process.env.TEST__BROKER_URL;
const options = {
  clean: true,
  connectTimeout: 4000,
  // clientId: 'emqx_test',
  username: process.env.TEST__DEV1_TEST__CLIENT_ID,
  password: process.env.TEST__DEV1_CLIENT_SECRET,
  // username: process.env.TEST__LELAB_TEST__CLIENT_ID,
  // password: process.env.TEST__LELAB_CLIENT_SECRET,
  rejectUnauthorized: false,
  // ca: process.env.TEST__CA_CERT_LOCATION,
};

const topic = `${process.env.TEST__CLIENT_ID}/NS/${nsName}/NIT/${process.env.TEST__NITID}/LE/${leId}/AS`;
// const topic = `${process.env.TEST__CLIENT_ID_KEYCLOAK}/NS/${nsName}/NIT/${process.env.TEST__NITID}/LE/${leId}/AS`;
console.log(topic);

const mqttClient = mqtt.connect(url, options);
mqttClient.on('connect', () => {
  console.log('MQTT Uplink Client Connected');
  // console.log(JSON.stringify(bodyDev1));
  mqttClient.publish(topic, JSON.stringify(bodyDev1));
  mqttClient.end();
});
