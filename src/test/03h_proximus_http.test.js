import fetch from 'node-fetch';

import '../config.js';
import './test_config.js';

import examplesProximus from './02h_proximus_http_spec.js';

(async () => {
  console.log('\nProximus tests:');
  for (let i = 0; i < examplesProximus.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesProximus[i].url, examplesProximus[i].options);
    console.log(JSON.stringify(examplesProximus[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    console.log(`Response text: ${res.Text}`);
  }
})();
