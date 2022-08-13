import fetch from 'node-fetch';

import '../config.js';
import './test_config.js';

import examplesSenet from './02f_senet_http_spec.js';

(async () => {
  console.log('\nSenet tests:');
  for (let i = 0; i < examplesSenet.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesSenet[i].url, examplesSenet[i].options);
    // console.log(JSON.stringify(examplesSenet[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    // console.log(`Response text: ${res.Text}`);
  }
})();
