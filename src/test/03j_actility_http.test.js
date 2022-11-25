import fetch from 'node-fetch';

import '../config.js';
import './test_config.js';

import examplesActility from './02j_actility_http_spec.js';

(async () => {
  console.log('\nActility tests:');
  for (let i = 0; i < examplesActility.length; i += 1) {
    // for (let i = 2; i < 4; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesActility[i].url, examplesActility[i].options);
    // console.log(JSON.stringify(examplesActility[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    // console.log(`Response text: ${res.Text}`);
  }
})();
