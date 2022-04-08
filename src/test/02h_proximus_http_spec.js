import fs from 'fs';
import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const testTarget = process.env.TEST_TARGET; // 'nt' for nano-things, 'lh' for localhost
const nsName = 'proximus'; // NS Specific !!!

const bodyExampleText = fs.readFileSync(
  new URL(`./uplink_data_sample_from_${nsName}.json`, import.meta.url),
);

const bodyDev1 = JSON.parse(bodyExampleText);
bodyDev1.devEUI = process.env.DEV_EUI; // NS Specific !!! "devEUI" field

const bodyMobileApp = JSON.parse(bodyExampleText);
bodyMobileApp.devEUI = process.env.DEV_EUI_MOBILE_APP; // NS Specific !!! "devEUI" field

const bodyRnd = JSON.parse(bodyExampleText);
bodyRnd.devEUI = process.env.DEV_EUI_RND; // NS Specific !!! "devEUI" field

const headersDev1AccessToken = {
  'x-access-token': process.env.ACCESS_TOKEN,
  'x-realm': 'dev1',

  'content-type': 'application/json',
};

const headersDev1Credentials = {
  'x-client-id': process.env.DEV1_CLIENT_ID,
  'x-client-secret': process.env.DEV1_CLIENT_SECRET,
  'x-realm': 'dev1',

  'content-type': 'application/json',
};

const headersKeycloakCredentials = {
  'x-client-id': process.env.LELAB_CLIENT_ID,
  'x-client-secret': process.env.LELAB_CLIENT_SECRET,
  'x-realm': 'le-lab',

  'content-type': 'application/json',
};

const headersRndCredentials = {
  'x-client-id': process.env.DEV1_CLIENT_ID,
  'x-client-secret': process.env.DEV1_CLIENT_SECRET,
  'x-realm': 'rnd',

  'content-type': 'application/json',
};

const method = 'POST';

const urls = {
  lh: {
    ul: `http://localhost:${cfg.NIT_SERVER_PORT}/uplink_from_${nsName}`,
    dl: `http://localhost:${cfg.NIT_SERVER_PORT}/downlink_to_${nsName}`,
  },
  nt: {
    ul: `https://nano-things.net/tpxle-nit/uplink_from_${nsName}`,
    dl: `https://nano-things.net/tpxle-nit/downlink_to_${nsName}`,
  },
};

const examples = [
  // Dev1 - Access Token
  {
    url: urls[testTarget].ul,
    options: { method, headers: headersDev1AccessToken, body: JSON.stringify(bodyDev1) },
  },

  // Dev1 - Credentials
  {
    url: urls[testTarget].ul,
    options: { method, headers: headersDev1Credentials, body: JSON.stringify(bodyDev1) },
  },

  // Mobile App
  {
    url: urls[testTarget].ul,
    options: { method, headers: headersKeycloakCredentials, body: JSON.stringify(bodyMobileApp) },
  },

  // RnD
  {
    url: urls[testTarget].ul,
    options: { method, headers: headersRndCredentials, body: JSON.stringify(bodyRnd) },
  },
];

export default examples;
