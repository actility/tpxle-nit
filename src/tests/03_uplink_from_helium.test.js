import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const ulBody = fs.readFileSync(
  new URL('./uplink_data_sample_from_helium.json', import.meta.url),
  'utf8',
);

// const url = 'https://nano-things.net/tpxle-nit/uplink_from_helium';
const url = `http://localhost:${cfg.NIT_SERVER_PORT}/uplink_from_helium`;

(async () => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      // 'x-access-token': process.env.ACCESS_TOKEN,

      // 'x-client-id': process.env.DEV1_CLIENT_ID,
      // 'x-client-secret': process.env.DEV1_CLIENT_SECRET,
      // 'x-realm': cfg.DEV1_REALM,

      'x-client-id': process.env.LELAB_CLIENT_ID,
      'x-client-secret': process.env.LELAB_CLIENT_SECRET,
      'x-realm': cfg.LELAB_REALM,

      'content-type': 'application/json',
    },
    body: ulBody, // uplink_data_sample_from_helium.json
  });

  console.log(`Response status: ${res.status} ${res.statusText}`);
  console.log(`Response status text: ${res.statusText}`);
  console.log(`Response text: ${res.Text}`);
})();
