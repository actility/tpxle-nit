import fetch from 'node-fetch';

import '../config.js';
import './test_config.js';

import examplesChirpstack from './02d_chirpstack_http_spec.js';

(async () => {
  console.log('\nChirpstack tests:');
  // for (let i = 0; i < examplesChirpstack.length; i += 1) {
  for (let i = 2; i < 3; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesChirpstack[i].url, examplesChirpstack[i].options);
    console.log(JSON.stringify(examplesChirpstack[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    console.log(`Response text: ${res.Text}`);
  }
})();
