import fetch from 'node-fetch';

import examplesHelium from './02b_helium_http_spec.js';
import examplesTTN from './02c_ttn_http_spec.js';
import examplesEverynet from './02e_everynet_http_spec.js';
import examplesChirpstack from './02d_chirpstack_http_spec.js';

console.log('\nHelium tests:');
for (let i = 0; i < examplesHelium.length; i += 1) {
  const res = await fetch(examplesHelium[i].url, examplesHelium[i].options);
  // console.log(JSON.stringify(example, null, 4));
  console.log(`Response status: ${res.status} ${res.statusText}`);
  // console.log(`Response text: ${res.Text}`);
}

console.log('\nTTN tests:');
for (let i = 0; i < examplesTTN.length; i += 1) {
  const res = await fetch(examplesTTN[i].url, examplesTTN[i].options);
  // console.log(JSON.stringify(example, null, 4));
  console.log(`Response status: ${res.status} ${res.statusText}`);
  // console.log(`Response text: ${res.Text}`);
}

console.log('\nEverynet tests:');
for (let i = 0; i < examplesEverynet.length; i += 1) {
  const res = await fetch(examplesEverynet[i].url, examplesEverynet[i].options);
  // console.log(JSON.stringify(example, null, 4));
  console.log(`Response status: ${res.status} ${res.statusText}`);
  // console.log(`Response text: ${res.Text}`);
}

console.log('\nChirpstack tests:');
for (let i = 0; i < examplesChirpstack.length; i += 1) {
  const res = await fetch(examplesChirpstack[i].url, examplesChirpstack[i].options);
  // console.log(JSON.stringify(example, null, 4));
  console.log(`Response status: ${res.status} ${res.statusText}`);
  // console.log(`Response text: ${res.Text}`);
}
