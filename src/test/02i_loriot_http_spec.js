import fs from 'fs';

const testTarget = process.env.TEST__TARGET; // 'nt' for nano-things, 'lh' for localhost
const nsName = 'loriot'; // NS Specific !!!

const bodyExampleText = fs.readFileSync(
  new URL(`./uplink_data_sample_from_${nsName}.json`, import.meta.url),
);

const bodyDev1 = JSON.parse(bodyExampleText);
bodyDev1.EUI = process.env.TEST__DEV_EUI; // NS Specific !!! "dev_eui" field
bodyDev1.downlink_url = process.env.TEST__DL_WEBHOOK; // NS Specific !!! "downlink_url" field

const bodyMobileApp = JSON.parse(bodyExampleText);
bodyMobileApp.EUI = process.env.TEST__DEV_EUI_MOBILE_APP; // NS Specific !!! "dev_eui" field
bodyMobileApp.downlink_url = process.env.TEST__DL_WEBHOOK; // NS Specific !!! "downlink_url" field

const bodyRnd = JSON.parse(bodyExampleText);
bodyRnd.EUI = process.env.TEST__DEV_EUI_RND; // NS Specific !!! "dev_eui" field
bodyRnd.downlink_url = process.env.TEST__DL_WEBHOOK; // NS Specific !!! "downlink_url" field

const headerCommon = {
  'content-type': 'application/json',
};

const headersDev1AccessToken = {
  Authorization: `|${process.env.TEST__ACCESS_TOKEN}|dev1|${process.env.TEST__DL_WEBHOOK}|${process.env.TEST__DL_API_KEY}`,
  ...headerCommon,
};

const headersDev1Credentials = {
  Authorization: `${process.env.TEST__DEV1_TEST__CLIENT_ID}|${process.env.TEST__DEV1_CLIENT_SECRET}|dev1|${process.env.TEST__DL_WEBHOOK}|${process.env.TEST__DL_API_KEY}`,
  ...headerCommon,
};

const headersKeycloakCredentials = {
  Authorization: `${process.env.TEST__LELAB_TEST__CLIENT_ID}|${process.env.TEST__LELAB_CLIENT_SECRET}|le-lab|${process.env.TEST__DL_WEBHOOK}|${process.env.TEST__DL_API_KEY}`,
  ...headerCommon,
};

const headersRndCredentials = {
  Authorization: `${process.env.TEST__DEV1_TEST__CLIENT_ID}|${process.env.TEST__DEV1_CLIENT_SECRET}|rnd|${process.env.TEST__DL_WEBHOOK}|${process.env.TEST__DL_API_KEY}`,
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
  Authorization: process.env.TEST__DL_API_KEY,
};

const urls = {
  lh: {
    ul: `http://localhost:${process.env.NIT__SERVER_PORT}/uplink_from_${nsName}/${process.env.TEST__NITAPIKEY}`,
    dl: `http://localhost:${process.env.NIT__SERVER_PORT}/downlink_to_${nsName}/${process.env.TEST__NITAPIKEY}`,
  },
  nt: {
    ul: `https://nano-things.net/tpxle-nit/uplink_from_${nsName}/${process.env.TEST__NITAPIKEY}`,
    dl: `https://nano-things.net/tpxle-nit/downlink_to_${nsName}/${process.env.TEST__NITAPIKEY}`,
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
