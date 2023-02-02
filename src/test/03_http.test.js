import fetch from 'node-fetch';

import '../config.js';
import './test_config.js';

// import examples from './02b_helium_http_spec.js';
import examples from './02c_ttn_http_spec.js';
// import examples from './02d_chirpstack_http_spec.js';
// import examples from './02e_everynet_http_spec.js';
// import examples from './02f_senet_http_spec.js';
// import examples from './02h_proximus_http_spec.js'; // /////////////////
// import examples from './02i_loriot_http_spec.js';
// import examples from './02j_actility_http_spec.js';

describe('Translator tests', () => {
  // const examples = examplesHelium;

  test.only('ECOKC_UL', async () => {
    const res = await fetch(examples.ECOKC_UL.url, examples.ECOKC_UL.options);
    console.log(`Response status: ${res.status} ${res.statusText}`);
    expect(res.status).toBe(200);
  });
  test('ECOKC_DL', async () => {
    const res = await fetch(examples.ECOKC_DL.url, examples.ECOKC_DL.options);
    console.log(`Response status: ${res.status} ${res.statusText}`);
    expect(res.status).toBe(200);
  });

  test('ECODX_UL', async () => {
    const res = await fetch(examples.ECODX_UL.url, examples.ECODX_UL.options);
    console.log(`Response status: ${res.status} ${res.statusText}`);
    expect(res.status).toBe(200);
  });
  test('ECODX_DL', async () => {
    const res = await fetch(examples.ECODX_DL.url, examples.ECODX_DL.options);
    console.log(`Response status: ${res.status} ${res.statusText}`);
    expect(res.status).toBe(200);
  });

  test('PREVKC_UL', async () => {
    const res = await fetch(examples.PREVKC_UL.url, examples.PREVKC_UL.options);
    console.log(`Response status: ${res.status} ${res.statusText}`);
    expect(res.status).toBe(200);
  });
  test('PREVKC_DL', async () => {
    const res = await fetch(examples.PREVKC_DL.url, examples.PREVKC_DL.options);
    console.log(`Response status: ${res.status} ${res.statusText}`);
    expect(res.status).toBe(200);
  });

  test('PREVDX_UL', async () => {
    const res = await fetch(examples.PREVDX_UL.url, examples.PREVDX_UL.options);
    console.log(`Response status: ${res.status} ${res.statusText}`);
    expect(res.status).toBe(200);
  });
  test('PREVDX_DL', async () => {
    const res = await fetch(examples.PREVDX_DL.url, examples.PREVDX_DL.options);
    console.log(`Response status: ${res.status} ${res.statusText}`);
    expect(res.status).toBe(200);
  });
});
