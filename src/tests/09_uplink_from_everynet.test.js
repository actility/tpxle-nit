import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

let ulBody = fs.readFileSync(
  new URL('./uplink_data_sample_from_everynet.json', import.meta.url),
  'utf8',
);

const ulBodyParsed = JSON.parse(ulBody);
ulBodyParsed.meta.device = process.env.DEV_EUI.toLowerCase();
ulBody = JSON.stringify(ulBodyParsed);

// const url = 'https://nano-things.net/tpxle-nit/uplink_from_everynet';
const url = `http://localhost:${cfg.NIT_SERVER_PORT}/uplink_from_everynet/${process.env.NITAPIKEY}`;

(async () => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      // 'x-access-token': process.env.ACCESS_TOKEN,

      'x-client-id': process.env.DEV1_CLIENT_ID,
      'x-client-secret': process.env.DEV1_CLIENT_SECRET,
      'x-realm': 'dev1',

      // 'x-client-id': process.env.LELAB_CLIENT_ID,
      // 'x-client-secret': process.env.LELAB_CLIENT_SECRET,
      // 'x-realm': 'le-lab',

      'content-type': 'application/json',

      'x-downlink-api': process.env.DL_WEBHOOK,
      'x-downlink-apikey': 'myEverynetApiKey',
    },
    body: ulBody,
  });

  console.log(`Response status: ${res.status} ${res.statusText}`);
  // console.log(`Response status text: ${res.statusText}`);
  console.log(await res.text());
})();
