import fs from 'fs';
import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const testTarget = 'lh'; // 'nt' for nano-things, 'lh' for localhost
const nsName = 'everynet'; // NS Specific !!!

const bodyExampleText = fs.readFileSync(
  new URL(`./uplink_data_sample_from_${nsName}.json`, import.meta.url),
);

const bodyDev1 = JSON.parse(bodyExampleText);
bodyDev1.meta.device = process.env.DEV_EUI.toLowerCase(); // NS Specific !!! "meta.device" field

const bodyMobileApp = JSON.parse(bodyExampleText);
bodyMobileApp.meta.device = process.env.DEV_EUI_MOBILE_APP.toLowerCase(); // NS Specific !!! "meta.device" field

const bodyRnd = JSON.parse(bodyExampleText);
bodyRnd.meta.device = process.env.DEV_EUI_RND.toLowerCase(); // NS Specific !!! "meta.device" field

const headerCommon = {
  'content-type': 'application/json',
};

const headersDev1AccessToken = {
  'x-access-token': process.env.ACCESS_TOKEN,
  'x-realm': 'dev1',

  'x-downlink-api': process.env.DL_WEBHOOK, // NS Specific !!! Only needed for Everynet and Chirpstack
  'x-downlink-apikey': 'myDownlinkApiKey', // NS Specific !!! Only needed for Everynet and Chirpstack

  ...headerCommon,
};

const headersDev1Credentials = {
  'x-client-id': process.env.DEV1_CLIENT_ID,
  'x-client-secret': process.env.DEV1_CLIENT_SECRET,
  'x-realm': 'dev1',

  'x-downlink-api': process.env.DL_WEBHOOK, // NS Specific !!! Only needed for Everynet and Chirpstack
  'x-downlink-apikey': 'myDownlinkApiKey', // NS Specific !!! Only needed for Everynet and Chirpstack

  ...headerCommon,
};

const headersKeycloakCredentials = {
  'x-client-id': process.env.LELAB_CLIENT_ID,
  'x-client-secret': process.env.LELAB_CLIENT_SECRET,
  'x-realm': 'le-lab',

  'x-downlink-api': process.env.DL_WEBHOOK, // NS Specific !!! Only needed for Everynet and Chirpstack
  'x-downlink-apikey': 'myDownlinkApiKey', // NS Specific !!! Only needed for Everynet and Chirpstack

  ...headerCommon,
};

const headersRndCredentials = {
  'x-client-id': process.env.DEV1_CLIENT_ID,
  'x-client-secret': process.env.DEV1_CLIENT_SECRET,
  'x-realm': 'rnd',

  'x-downlink-api': process.env.DL_WEBHOOK, // NS Specific !!! Only needed for Everynet and Chirpstack
  'x-downlink-apikey': 'myDownlinkApiKey', // NS Specific !!! Only needed for Everynet and Chirpstack

  ...headerCommon,
};

const method = 'POST';

const dlBodyDev1 = {
  type: 'downlink',
  deveui: process.env.DEV_EUI,
  port: '2',
  payload: '020402',
};

const dlBodyMobileApp = {
  type: 'downlink',
  deveui: process.env.DEV_EUI_MOBILE_APP,
  port: '2',
  payload: '020402',
};

const dlBodyRnd = {
  type: 'downlink',
  deveui: process.env.DEV_EUI_RND,
  port: '2',
  payload: '020402',
};

const dlHeaders = {
  'content-type': 'application/json',
};

const urls = {
  lh: {
    ul: `http://localhost:${cfg.NIT_SERVER_PORT}/uplink_from_${nsName}/${process.env.NITAPIKEY}`,
    dl: `http://localhost:${cfg.NIT_SERVER_PORT}/downlink_to_${nsName}/${process.env.NITAPIKEY}`,
  },
  nt: {
    ul: `https://nano-things.net/tpxle-nit/uplink_from_${nsName}/${process.env.NITAPIKEY}`,
    dl: `https://nano-things.net/tpxle-nit/downlink_to_${nsName}/${process.env.NITAPIKEY}`,
  },
};

const examples = [
  // Dev1 - Access Token
  {
    url: urls[testTarget].ul,
    options: { method, headers: headersDev1AccessToken, body: JSON.stringify(bodyDev1) },
  },
  {
    url: urls[testTarget].dl,
    options: { method, headers: dlHeaders, body: JSON.stringify(dlBodyDev1) },
  },

  // Dev1 - Credentials
  {
    url: urls[testTarget].ul,
    options: { method, headers: headersDev1Credentials, body: JSON.stringify(bodyDev1) },
  },
  {
    url: urls[testTarget].dl,
    options: { method, headers: dlHeaders, body: JSON.stringify(dlBodyDev1) },
  },

  // Mobile App
  {
    url: urls[testTarget].ul,
    options: { method, headers: headersKeycloakCredentials, body: JSON.stringify(bodyMobileApp) },
  },
  {
    url: urls[testTarget].dl,
    options: { method, headers: dlHeaders, body: JSON.stringify(dlBodyMobileApp) },
  },

  // RnD
  {
    url: urls[testTarget].ul,
    options: { method, headers: headersRndCredentials, body: JSON.stringify(bodyRnd) },
  },
  {
    url: urls[testTarget].dl,
    options: { method, headers: dlHeaders, body: JSON.stringify(dlBodyRnd) },
  },
];

export default examples;
