import fetch from 'node-fetch';

import examplesHelium from './02b_helium_http_spec.js';
// import examplesTTN from './02c_ttn_http_spec.js';
// import examplesEverynet from './02e_everynet_http_spec.js';
// import examplesChirpstack from './02d_chirpstack_http_spec.js';
// import examplesSenet from './02f_senet_http_spec.js';

// import examplesActility from './02g_http-mqtt_spec.js';

(async () => {
  console.log('\nHelium tests:');
  for (let i = 0; i < examplesHelium.length; i += 1) {
    // for (let i = 6; i < 8; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesHelium[i].url, examplesHelium[i].options);
    // console.log(JSON.stringify(examplesHelium[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    // console.log(`Response text: ${res.Text}`);
  }

  /*   console.log('\nTTN tests:');
  for (let i = 0; i < examplesTTN.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesTTN[i].url, examplesTTN[i].options);
    // console.log(JSON.stringify(examplesTTN[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    // console.log(`Response text: ${res.Text}`);
  }

  console.log('\nEverynet tests:');
  for (let i = 0; i < examplesEverynet.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesEverynet[i].url, examplesEverynet[i].options);
    // console.log(JSON.stringify(examplesEverynet[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    // console.log(`Response text: ${res.Text}`);
  }

  console.log('\nChirpstack tests:');
  for (let i = 0; i < examplesChirpstack.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesChirpstack[i].url, examplesChirpstack[i].options);
    // console.log(JSON.stringify(examplesChirpstack[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    // console.log(`Response text: ${res.Text}`);
  }

  console.log('\nSenet tests:');
  for (let i = 0; i < examplesSenet.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesSenet[i].url, examplesSenet[i].options);
    // console.log(JSON.stringify(examplesSenet[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    // console.log(`Response text: ${res.Text}`);
  }

  console.log('\nHTTP - MQTT tests:');
  for (let i = 0; i < examplesActility.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(examplesActility[i].url, examplesActility[i].options);
    // console.log(JSON.stringify(examplesActility[i], null, 4));
    console.log(`Response status: ${res.status} ${res.statusText}`);
    // console.log(`Response text: ${res.Text}`);
  } */
})();
