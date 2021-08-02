import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const ulBody = fs.readFileSync(
  new URL('./uplink_data_sample_from_helium.json', import.meta.url),
  'utf8',
);

(async () => {
  const res = await fetch(
    `http://localhost:${cfg.NIT_SERVER_PORT}/uplink_from_helium`,
    // 'https://nano-things.net/tpxle-nit/uplink_from_helium',
    {
      method: 'POST',
      headers: {
        // 'x-access-token': process.env.ACCESS_TOKEN,
        'x-client-id': process.env.CLIENT_ID,
        'x-client-secret': process.env.CLIENT_SECRET,
        'content-type': 'application/json',
      },
      body: ulBody, // uplink_data_sample_from_helium.json
    },
  );

  console.log(`Response status: ${res.status} ${res.statusText}`);
  console.log(`Response status text: ${res.statusText}`);
  console.log(`Response text: ${res.Text}`);
})();
