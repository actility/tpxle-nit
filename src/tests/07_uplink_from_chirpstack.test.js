import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

let ulBody = fs.readFileSync(
  new URL('./uplink_data_sample_from_chirpstack.json', import.meta.url),
  'utf8',
);

const ulBodyParsed = JSON.parse(ulBody);
ulBodyParsed.devEUI = Buffer.from(process.env.DEV_EUI, 'hex').toString('base64');
ulBody = JSON.stringify(ulBodyParsed);

// const url = 'https://nano-things.net/tpxle-nit/uplink_from_chirpstack';
const url = `http://localhost:${cfg.NIT_SERVER_PORT}/uplink_from_chirpstack/${process.env.NITAPIKEY}`;

(async () => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      // 'x-access-token': process.env.ACCESS_TOKEN,

      'x-client-id': process.env.DEV1_CLIENT_ID,
      'x-client-secret': process.env.DEV1_CLIENT_SECRET,
      // 'x-client-secret': 'wrongPasswd',
      'x-realm': 'rnd-b2b',

      // 'x-client-id': process.env.LELAB_CLIENT_ID,
      // 'x-client-secret': process.env.LELAB_CLIENT_SECRET,
      // 'x-realm': 'le-lab',

      'content-type': 'application/json',

      'x-downlink-api': process.env.DL_WEBHOOK,
      'x-downlink-apikey': 'myChirpstackApiKey',
    },
    body: ulBody,
  });

  console.log(`Response status: ${res.status} ${res.statusText}`);
  // console.log(`Response status text: ${res.statusText}`);
  // console.log(`Response text: ${res.Text}`);
})();
