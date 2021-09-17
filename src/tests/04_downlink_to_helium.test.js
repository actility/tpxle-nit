import fetch from 'node-fetch';
import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const dlBody = {
  type: 'downlink',
  deveui: process.env.DEV_EUI,
  port: '2',
  payload: '020402',
};

// const url = 'https://nano-things.net/tpxle-nit/uplink_from_helium';
const url = `http://localhost:${cfg.NIT_SERVER_PORT}/uplink_from_helium`;

(async () => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(dlBody),
  });

  console.log(`Response status: ${res.status} ${res.statusText}`);
  console.log(`Response status text: ${res.statusText}`);
  console.log(`Response text: ${res.Text}`);
})();
