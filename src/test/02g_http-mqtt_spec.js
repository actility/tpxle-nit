import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const testTarget = process.env.TEST_TARGET;

const method = 'POST';

const dlBodyDev1 = {
  type: 'downlink',
  deveui: process.env.DEV_EUI,
  port: '2',
  payload: '020402',
};

const dlHeaders = {
  'content-type': 'application/json',
};

const urls = {
  lh: {
    dl: `http://localhost:${cfg.NIT_SERVER_PORT}/downlink_mqtt`,
  },
  nt: {
    dl: `https://nano-things.net/tpxle-nit/downlink_mqtt`,
  },
};

const examples = [
  {
    url: `${urls[testTarget].dl}/${process.env.CLIENT_ID}/dev1/actility`,
    options: { method, headers: dlHeaders, body: JSON.stringify(dlBodyDev1) },
  },
  {
    url: `${urls[testTarget].dl}/${process.env.CLIENT_ID}/dev1/senet`,
    options: { method, headers: dlHeaders, body: JSON.stringify(dlBodyDev1) },
  },
  {
    url: `${urls[testTarget].dl}/${process.env.CLIENT_ID_KEYCLOAK}/le-lab/senet`,
    options: { method, headers: dlHeaders, body: JSON.stringify(dlBodyDev1) },
  },
];

export default examples;
