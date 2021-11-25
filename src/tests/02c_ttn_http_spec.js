import fs from 'fs';
import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const testTarget = 'nt'; // 'nt' for nano-things, 'lh' for localhost
const nsName = 'ttn'; // NS Specific !!!

const bodyExampleText = fs.readFileSync(
  new URL(`./uplink_data_sample_from_${nsName}.json`, import.meta.url),
);

const bodyDev1 = JSON.parse(bodyExampleText);
bodyDev1.end_device_ids.dev_eui = process.env.DEV_EUI; // NS Specific !!! "end_device_ids.dev_eui" field

const bodyMobileApp = JSON.parse(bodyExampleText);
bodyMobileApp.end_device_ids.dev_eui = process.env.DEV_EUI_MOBILE_APP; // NS Specific !!! "end_device_ids.dev_eui" field

const bodyRnd = JSON.parse(bodyExampleText);
bodyRnd.end_device_ids.dev_eui = process.env.DEV_EUI_RND; // NS Specific !!! "end_device_ids.dev_eui" field

const headerCommon = {
  'x-tts-domain': 'eu1.cloud.thethings.network',
  'x-downlink-replace': process.env.DL_WEBHOOK,
  // 'x-downlink-replace': 'https://eu1.cloud.thethings.network/api/v3/as/applications/abeeway-tpxle/webhooks/webhook-site/devices/smartbadge-3f5/down/replace',
  'x-downlink-push':
    'https://eu1.cloud.thethings.network/api/v3/as/applications/abeeway-tpxle/webhooks/webhook-site/devices/smartbadge-3f5/down/push',
  'x-downlink-apikey':
    'NNSXS.7DI3BJKOKZKAVR4WPRLWNAZB5R3M5IGUUBYF72I.T5EH35MYLSZJPEQ3H5LIZVTOLHR7UFAJWM3A2CMJLG6TW6OK33SQ',

  'content-type': 'application/json',
};

const headersDev1AccessToken = {
  'x-access-token': process.env.ACCESS_TOKEN,
  'x-realm': 'dev1',
  ...headerCommon,
};

const headersDev1Credentials = {
  'x-client-id': process.env.DEV1_CLIENT_ID,
  'x-client-secret': process.env.DEV1_CLIENT_SECRET,
  'x-realm': 'dev1',
  ...headerCommon,
};

const headersKeycloakCredentials = {
  'x-client-id': process.env.LELAB_CLIENT_ID,
  'x-client-secret': process.env.LELAB_CLIENT_SECRET,
  'x-realm': 'le-lab',
  ...headerCommon,
};

const headersRndCredentials = {
  'x-client-id': process.env.DEV1_CLIENT_ID,
  'x-client-secret': process.env.DEV1_CLIENT_SECRET,
  'x-realm': 'rnd',
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
