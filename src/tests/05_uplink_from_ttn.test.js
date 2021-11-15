import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

import cfg from '../config.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

let ulBody = fs.readFileSync(
  new URL('./uplink_data_sample_from_ttn.json', import.meta.url),
  'utf8',
);

const ulBodyParsed = JSON.parse(ulBody);
// ulBodyParsed.end_device_ids.dev_eui = process.env.DEV_EUI;
ulBodyParsed.end_device_ids.dev_eui = process.env.DEV_EUI_MOBILE_APP;
ulBody = JSON.stringify(ulBodyParsed);

// console.log(JSON.stringify(ulBodyParsed, null, 4));

// const url = 'https://nano-things.net/tpxle-nit/uplink_from_ttn';
const url = `http://localhost:${cfg.NIT_SERVER_PORT}/uplink_from_ttn/${process.env.NITAPIKEY}`;

(async () => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      // 'x-access-token': process.env.ACCESS_TOKEN,

      // 'x-client-id': process.env.DEV1_CLIENT_ID,
      // 'x-client-secret': process.env.DEV1_CLIENT_SECRET,
      // 'x-realm': 'dev1',

      'x-client-id': process.env.LELAB_CLIENT_ID,
      'x-client-secret': process.env.LELAB_CLIENT_SECRET,
      'x-realm': 'le-lab',

      'content-type': 'application/json',
      'x-tts-domain': 'eu1.cloud.thethings.network',
      // 'x-downlink-replace': 'https://eu1.cloud.thethings.network/api/v3/as/applications/abeeway-tpxle/webhooks/webhook-site/devices/smartbadge-3f5/down/replace',
      'x-downlink-replace': process.env.DL_WEBHOOK,
      'x-downlink-push':
        'https://eu1.cloud.thethings.network/api/v3/as/applications/abeeway-tpxle/webhooks/webhook-site/devices/smartbadge-3f5/down/push',
      'x-downlink-apikey':
        'NNSXS.7DI3BJKOKZKAVR4WPRLWNAZB5R3M5IGUUBYF72I.T5EH35MYLSZJPEQ3H5LIZVTOLHR7UFAJWM3A2CMJLG6TW6OK33SQ',
    },
    body: ulBody,
  });

  console.log(`Response status: ${res.status} ${res.statusText}`);
  // console.log(`Response status text: ${res.statusText}`);
  // console.log(`Response text: ${res.Text}`);
})();
