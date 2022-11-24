import fetch from 'node-fetch';

import '../config.js';
import './test_config.js';

import examplesLoriot from './02i_loriot_http_spec.js';

(async () => {
  console.log('\nLoriot tests:');
  for (let i = 0; i < examplesLoriot.length; i += 1) {
    // for (let i = 6; i < 8; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesLoriot[i].url, examplesLoriot[i].options);
    // console.log(JSON.stringify(examplesLoriot[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    // console.log(`Response text: ${res.Text}`);
  }
})();
