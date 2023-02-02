import '../config.js';
import './test_config.js';

import { redisClient } from '../redis.client.js';
import { getAccessTokenAsync } from '../middlewares/tpxle-auth.middleware.js';

describe('Auth Tests', () => {
  beforeAll(() => {
    // redisClient.connect();
  });

  afterAll(() => {
    redisClient.quit();
  });

  test('ECOKC', async () => {
    let accessToken;
    let err;
    try {
      accessToken = await getAccessTokenAsync(
        process.env.TEST__ECOKC_CLIENT_ID,
        process.env.TEST__ECOKC_CLIENT_SECRET,
        'ECOKC',
      );
      console.log(accessToken);
    } catch (e) {
      err = e.message;
      console.log(err);
    }
    expect(accessToken).toBeDefined();
    expect(err).toBeUndefined();
  });

  test('ECODX', async () => {
    let accessToken;
    let err;
    try {
      accessToken = await getAccessTokenAsync(
        process.env.TEST__ECODX_CLIENT_ID,
        process.env.TEST__ECODX_CLIENT_SECRET,
        'ECODX',
      );
      console.log(accessToken);
    } catch (e) {
      err = e.message;
      console.log(err);
    }
    expect(accessToken).toBeDefined();
    expect(err).toBeUndefined();
  });

  test('PREVKC', async () => {
    let accessToken;
    let err;
    try {
      accessToken = await getAccessTokenAsync(
        process.env.TEST__PREVKC_CLIENT_ID,
        process.env.TEST__PREVKC_CLIENT_SECRET,
        'PREVKC',
      );
      console.log(accessToken);
    } catch (e) {
      err = e.message;
      console.log(err);
    }
    expect(accessToken).toBeDefined();
    expect(err).toBeUndefined();
  });

  test('PREVDX', async () => {
    let accessToken;
    let err;
    try {
      accessToken = await getAccessTokenAsync(
        process.env.TEST__PREVDX_CLIENT_ID,
        process.env.TEST__PREVDX_CLIENT_SECRET,
        'PREVDX',
      );
      console.log(accessToken);
    } catch (e) {
      err = e.message;
      console.log(err);
    }
    expect(accessToken).toBeDefined();
    expect(err).toBeUndefined();
  });
});
