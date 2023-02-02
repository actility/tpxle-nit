import fetch from 'node-fetch';

import '../config.js';
import './test_config.js';

const testBodies = [
  {
    architectureId: 'ECODX',
    clientId: process.env.TEST__ECODX_CLIENT_ID,
    clientSecret: process.env.TEST__ECODX_CLIENT_SECRET,
    asId: '01',
    nsVendor: 'actility',
  },
  {
    architectureId: 'ECOKC',
    clientId: process.env.TEST__ECOKC_CLIENT_ID,
    clientSecret: process.env.TEST__ECOKC_CLIENT_SECRET,
    asId: '01',
    nsVendor: 'actility',
  },
  {
    architectureId: 'PREVDX',
    clientId: process.env.TEST__PREVDX_CLIENT_ID,
    clientSecret: process.env.TEST__PREVDX_CLIENT_SECRET,
    asId: '01',
    nsVendor: 'actility',
  },
  {
    architectureId: 'PREVKC',
    clientId: process.env.TEST__PREVKC_CLIENT_ID,
    clientSecret: process.env.TEST__PREVKC_CLIENT_SECRET,
    asId: '01',
    nsVendor: 'actility',
  },
];

const method = 'POST';
const headers = {
  'content-type': 'application/json',
};

for (let i = 0; i < testBodies.length; i += 1) {
  (async () => {
    const res = await fetch(`http://localhost:${process.env.NIT__SERVER_PORT}/get-topic`, {
      method,
      headers,
      body: JSON.stringify(testBodies[i]),
    });
    console.log(`Response status: ${res.status} ${res.statusText}`);
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  })();
}
