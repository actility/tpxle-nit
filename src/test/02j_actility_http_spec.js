import fs from 'fs';

const testTarget = process.env.TEST__TARGET; // 'nt' for nano-things, 'lh' for localhost
const nsName = 'actility'; // NS Specific !!!

const bodyExampleText = fs.readFileSync(
  new URL(`./uplink_data_sample_from_${nsName}.json`, import.meta.url),
);

const bodyDev1 = JSON.parse(bodyExampleText);
bodyDev1.DevEUI_uplink.DevEUI = process.env.TEST__DEV_EUI.toUpperCase(); // NS Specific !!! "meta.device" field
bodyDev1.DevEUI_uplink.downlinkUrl = process.env.TEST__DL_WEBHOOK;

const bodyMobileApp = JSON.parse(bodyExampleText);
bodyMobileApp.DevEUI_uplink.DevEUI = process.env.TEST__DEV_EUI_MOBILE_APP.toUpperCase(); // NS Specific !!! "meta.device" field
bodyMobileApp.DevEUI_uplink.downlinkUrl = process.env.TEST__DL_WEBHOOK;

const bodyRnd = JSON.parse(bodyExampleText);
bodyRnd.DevEUI_uplink.DevEUI = process.env.TEST__DEV_EUI_RND.toUpperCase(); // NS Specific !!! "meta.device" field
bodyRnd.DevEUI_uplink.downlinkUrl = process.env.TEST__DL_WEBHOOK;

const headerCommon = {
  'content-type': 'application/json',
};

const headersDev1AccessToken = {
  'x-access-token': process.env.TEST__ACCESS_TOKEN,
  'x-realm': 'dev1',

  //  'x-downlink-api': process.env.TEST__DL_WEBHOOK, // NS Specific !!!
  //  'x-downlink-apikey': 'myDownlinkApiKey', // NS Specific !!!

  ...headerCommon,
};

const headersDev1Credentials = {
  'x-client-id': process.env.TEST__DEV1_TEST__CLIENT_ID,
  'x-client-secret': process.env.TEST__DEV1_CLIENT_SECRET,
  'x-realm': 'dev1',

  //  'x-downlink-api': process.env.TEST__DL_WEBHOOK, // NS Specific !!!
  //  'x-downlink-apikey': 'myDownlinkApiKey', // NS Specific !!!

  ...headerCommon,
};

const headersKeycloakCredentials = {
  'x-client-id': process.env.TEST__LELAB_TEST__CLIENT_ID,
  'x-client-secret': process.env.TEST__LELAB_CLIENT_SECRET,
  'x-realm': 'le-lab',

  //  'x-downlink-api': process.env.TEST__DL_WEBHOOK, // NS Specific !!!
  //  'x-downlink-apikey': 'myDownlinkApiKey', // NS Specific !!!

  ...headerCommon,
};

const headersRndCredentials = {
  'x-client-id': process.env.TEST__DEV1_TEST__CLIENT_ID,
  'x-client-secret': process.env.TEST__DEV1_CLIENT_SECRET,
  'x-realm': 'rnd',

  //  'x-downlink-api': process.env.TEST__DL_WEBHOOK, // NS Specific !!!
  //  'x-downlink-apikey': 'myDownlinkApiKey', // NS Specific !!!

  ...headerCommon,
};

const method = 'POST';

const dlBodyDev1 = {
  type: 'downlink',
  deveui: process.env.TEST__DEV_EUI,
  port: '2',
  payload: '020402',
};

const dlBodyMobileApp = {
  type: 'downlink',
  deveui: process.env.TEST__DEV_EUI_MOBILE_APP,
  port: '2',
  payload: '020402',
};

const dlBodyRnd = {
  type: 'downlink',
  deveui: process.env.TEST__DEV_EUI_RND,
  port: '2',
  payload: '020402',
};

const dlHeaders = {
  'content-type': 'application/json',
};

const urls = {
  lh: {
    ul: `http://localhost:${process.env.NIT__SERVER_PORT}/uplink_from_${nsName}/${process.env.TEST__NITAPIKEY}`,
    dl: `http://localhost:${process.env.NIT__SERVER_PORT}/downlink_to_${nsName}/${process.env.TEST__NITAPIKEY}`,
  },
  nt: {
    ul: `https://nano-things.net:443/tpxle-nit/uplink_from_${nsName}/${process.env.TEST__NITAPIKEY}`,
    dl: `https://nano-things.net:443/tpxle-nit/downlink_to_${nsName}/${process.env.TEST__NITAPIKEY}`,
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
