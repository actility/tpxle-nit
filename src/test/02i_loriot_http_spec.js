import fs from 'fs';

const testTarget = process.env.TEST__TARGET; // 'nt' for nano-things, 'lh' for localhost
const nsName = 'loriot'; // NS Specific !!!

// *****************************
// PREPARE UPLINK REQUEST BODIES
// *****************************

const bodyExampleText = fs.readFileSync(
  new URL(`./uplink_data_sample_from_${nsName}.json`, import.meta.url),
);

const bodyEcoKcUl = JSON.parse(bodyExampleText);
bodyEcoKcUl.EUI = process.env.TEST__ECOKC_DEVEUI; // NS Specific !!! "EUI" field
bodyEcoKcUl.downlink_url = process.env.TEST__DL_WEBHOOK; // NS Specific !!! "downlink_url" field

const bodyEcoDxUl = JSON.parse(bodyExampleText);
bodyEcoDxUl.EUI = process.env.TEST__ECODX_DEVEUI; // NS Specific !!! "EUI" field
bodyEcoDxUl.downlink_url = process.env.TEST__DL_WEBHOOK; // NS Specific !!! "downlink_url" field

const bodyPrevKcUl = JSON.parse(bodyExampleText);
bodyPrevKcUl.EUI = process.env.TEST__PREVKC_DEVEUI; // NS Specific !!! "EUI" field
bodyPrevKcUl.downlink_url = process.env.TEST__DL_WEBHOOK; // NS Specific !!! "downlink_url" field

const bodyPrevDxUl = JSON.parse(bodyExampleText);
bodyPrevDxUl.EUI = process.env.TEST__PREVDX_DEVEUI; // NS Specific !!! "EUI" field
bodyPrevDxUl.downlink_url = process.env.TEST__DL_WEBHOOK; // NS Specific !!! "downlink_url" field

// *****************************
// PREPARE UPLINK REQUEST HEADERS
// *****************************

const headerCommonUl = {
  'content-type': 'application/json',
};

const headersEcoKcUl = {
  Authorization: `${process.env.TEST__ECOKC_CLIENT_ID}|${process.env.TEST__ECOKC_CLIENT_SECRET}|ECOKC|${process.env.TEST__DL_WEBHOOK}|${process.env.TEST__DL_API_KEY}`,
  ...headerCommonUl,
};

const headersEcoDxUl = {
  Authorization: `${process.env.TEST__ECODX_CLIENT_ID}|${process.env.TEST__ECODX_CLIENT_SECRET}|ECODX|${process.env.TEST__DL_WEBHOOK}|${process.env.TEST__DL_API_KEY}`,
  ...headerCommonUl,
};

const headersPrevKcUl = {
  Authorization: `${process.env.TEST__PREVKC_CLIENT_ID}|${process.env.TEST__PREVKC_CLIENT_SECRET}|PREVKC|${process.env.TEST__DL_WEBHOOK}|${process.env.TEST__DL_API_KEY}`,
  ...headerCommonUl,
};

const headersPrevDxUl = {
  Authorization: `${process.env.TEST__PREVDX_CLIENT_ID}|${process.env.TEST__PREVDX_CLIENT_SECRET}|PREVDX|${process.env.TEST__DL_WEBHOOK}|${process.env.TEST__DL_API_KEY}`,
  ...headerCommonUl,
};

// *****************************
// PREPARE DOWNLINK REQUEST BODYS
// *****************************

const bodyEcoKcDl = {
  type: 'downlink',
  deveui: process.env.TEST__ECOKC_DEVEUI,
  port: '2',
  payload: '020402',
};

const bodyEcoDxDl = {
  type: 'downlink',
  deveui: process.env.TEST__ECODX_DEVEUI,
  port: '2',
  payload: '020402',
};

const bodyPrevKcDl = {
  type: 'downlink',
  deveui: process.env.TEST__PREVKC_DEVEUI,
  port: '2',
  payload: '020402',
};

const bodyPrevDxDl = {
  type: 'downlink',
  deveui: process.env.TEST__PREVDX_DEVEUI,
  port: '2',
  payload: '020402',
};

// *****************************
// PREPARE DOWNLINK REQUEST HEADERS
// *****************************

const headerCommonDl = {
  'content-type': 'application/json',
};

// *****************************
// PREPARE URLS
// *****************************

const urls = {
  lh: {
    ul: `http://localhost:${process.env.NIT__SERVER_PORT}/uplink_from_${nsName}/${process.env.TEST__NITAPIKEY}`,
    dl: `http://localhost:${process.env.NIT__SERVER_PORT}/downlink_to_${nsName}/${process.env.TEST__NITAPIKEY}`,
  },
  nt: {
    ul: `https://nano-things.net/tpxle-nit/uplink_from_${nsName}/${process.env.TEST__NITAPIKEY}`,
    dl: `https://nano-things.net/tpxle-nit/downlink_to_${nsName}/${process.env.TEST__NITAPIKEY}`,
  },
  community: {
    ul: `https://community.thingpark.io/tpxle-nit/uplink_from_${nsName}/${process.env.TEST__NITAPIKEY}`,
    dl: `https://community.thingpark.io/tpxle-nit/downlink_to_${nsName}/${process.env.TEST__NITAPIKEY}`,
  },
};

// *****************************
// DEFINE TEST EXAMPLES
// *****************************

const method = 'POST';

const examples = {
  ECOKC_UL: {
    name: 'ECOKC_UL',
    url: urls[testTarget].ul,
    options: { method, headers: headersEcoKcUl, body: JSON.stringify(bodyEcoKcUl) },
  },
  ECOKC_DL: {
    name: 'ECOKC_DL',
    url: urls[testTarget].dl,
    options: { method, headers: headerCommonDl, body: JSON.stringify(bodyEcoKcDl) },
  },

  ECODX_UL: {
    name: 'ECODX_UL',
    url: urls[testTarget].ul,
    options: { method, headers: headersEcoDxUl, body: JSON.stringify(bodyEcoDxUl) },
  },
  ECODX_DL: {
    name: 'ECODX_DL',
    url: urls[testTarget].dl,
    options: { method, headers: headerCommonDl, body: JSON.stringify(bodyEcoDxDl) },
  },

  PREVKC_UL: {
    name: 'PREVKC_UL',
    url: urls[testTarget].ul,
    options: { method, headers: headersPrevKcUl, body: JSON.stringify(bodyPrevKcUl) },
  },
  PREVKC_DL: {
    name: 'PREVKC_DL',
    url: urls[testTarget].dl,
    options: { method, headers: headerCommonDl, body: JSON.stringify(bodyPrevKcDl) },
  },

  PREVDX_UL: {
    name: 'PREVDX_UL',
    url: urls[testTarget].ul,
    options: { method, headers: headersPrevDxUl, body: JSON.stringify(bodyPrevDxUl) },
  },
  PREVDX_DL: {
    name: 'PREVDX_DL',
    url: urls[testTarget].dl,
    options: { method, headers: headerCommonDl, body: JSON.stringify(bodyPrevDxDl) },
  },
};

export default examples;
