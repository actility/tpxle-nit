import fs from 'fs';

const testTarget = process.env.TEST__TARGET; // 'nt' for nano-things, 'lh' for localhost
const nsName = 'proximus'; // NS Specific !!!

const bodyExampleText = fs.readFileSync(
  new URL(`./uplink_data_sample_from_${nsName}.json`, import.meta.url),
);

const bodyDev1 = JSON.parse(bodyExampleText);
bodyDev1.devEUI = process.env.TEST__DEV_EUI; // NS Specific !!! "devEUI" field

const bodyMobileApp = JSON.parse(bodyExampleText);
bodyMobileApp.devEUI = process.env.TEST__DEV_EUI_MOBILE_APP; // NS Specific !!! "devEUI" field

const bodyRnd = JSON.parse(bodyExampleText);
bodyRnd.devEUI = process.env.TEST__DEV_EUI_RND; // NS Specific !!! "devEUI" field

const headersDev1AccessToken = {
  'x-access-token': process.env.TEST__ACCESS_TOKEN,
  'x-realm': 'dev1',

  'content-type': 'application/json',
};

const headersDev1Credentials = {
  'x-client-id': process.env.TEST__DEV1_TEST__CLIENT_ID,
  'x-client-secret': process.env.TEST__DEV1_CLIENT_SECRET,
  'x-realm': 'dev1',

  'content-type': 'application/json',
};

const headersKeycloakCredentials = {
  'x-client-id': process.env.TEST__LELAB_TEST__CLIENT_ID,
  'x-client-secret': process.env.TEST__LELAB_CLIENT_SECRET,
  'x-realm': 'le-lab',

  'content-type': 'application/json',
};

const headersRndCredentials = {
  'x-client-id': process.env.TEST__DEV1_TEST__CLIENT_ID,
  'x-client-secret': process.env.TEST__DEV1_CLIENT_SECRET,
  'x-realm': 'rnd',

  'content-type': 'application/json',
};

const method = 'POST';

const urls = {
  lh: {
    ul: `http://localhost:${process.env.NIT__SERVER_PORT}/uplink_from_${nsName}`,
    dl: `http://localhost:${process.env.NIT__SERVER_PORT}/downlink_to_${nsName}`,
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
