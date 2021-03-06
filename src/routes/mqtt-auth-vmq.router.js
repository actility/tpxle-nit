import express from 'express';

import { getAccessTokenAsync } from '../middlewares/tpxle-auth.middleware.js';

const router = express.Router();

// Only valid if usung Webhooks Plugin
const CACHE_AGE_IN_SECONDS = 300;

router.use((req, res, next) => {
  console.log(`${req.socket.remoteAddress}:${req.socket.remotePort} ${req.method} ${req.path}`);
  return next();
});

router.post('/lua', async (req, res) => {
  console.log(JSON.stringify(req.body));

  const headers = {
    'content-type': 'application/json',
    'cache-control': `max-age=${CACHE_AGE_IN_SECONDS}`,
  };
  res.header(headers);

  let responseBody;

  if (
    req.body.username === process.env.NIT__MQTT_SUPER_USER &&
    req.body.password === process.env.NIT__MQTT_SUPER_PASSWD
  ) {
    responseBody = {
      result: 'ok',
      publish_acl: [{ pattern: '#' }],
      subscribe_acl: [{ pattern: '#' }],
    };
    console.log(JSON.stringify(responseBody));
    res.status(200).json(responseBody);
    return;
  }

  const { username } = req.body;
  let realm;

  const r = username.split('/')[0];
  if (process.env.NIT__VALID_REALMS.split(',').includes(r)) {
    realm = r;
  } else {
    // this is here for compatibility
    realm = username.includes('/') ? 'dev1' : 'le-lab';
  }

  try {
    const accessToken = await getAccessTokenAsync(username, req.body.password, realm);

    const accessTokenDecoded = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString(),
    );
    let subscriberId;
    if (realm === 'le-lab' || realm === 'abeeway-mobile-app') {
      // subscriberId = accessTokenDecoded.parentSubscriptions['actility-sup/tpx'][0].subscriberId;
      subscriberId = accessTokenDecoded.sub;
    } else {
      // eslint-disable-next-line prefer-destructuring
      subscriberId = accessTokenDecoded.scope[0].split(':')[1];
    }

    console.log(subscriberId);

    responseBody = {
      result: 'ok',
      publish_acl: [{ pattern: `${subscriberId}/#` }, { pattern: `${subscriberId}/#` }],
      subscribe_acl: [
        // { pattern: '#' },
        { pattern: `${subscriberId}/#` },
        { pattern: `${subscriberId}/#` },
      ],
    };
    console.log(JSON.stringify(responseBody));
    res.status(200).json(responseBody);
  } catch (err) {
    res.status(403).end();
  }
});

router.post('/auth', async (req, res) => {
  console.log(JSON.stringify(req.body));

  try {
    // const accessToken = await getAccessTokenAsync(
    getAccessTokenAsync(req.body.username, req.body.password, 'dev1');
    const responeBody = {
      result: 'ok',
    };
    const headers = {
      'content-type': 'application/json',
      'cache-control': `max-age=${CACHE_AGE_IN_SECONDS}`,
    };
    res.header(headers);

    console.log(JSON.stringify(responeBody));

    res.status(200).json(responeBody);
  } catch (err) {
    res.status(403).end();
  }
});

router.post('/sub', async (req, res) => {
  console.log(JSON.stringify(req.body));

  const responeBody = {
    result: 'ok',
  };

  console.log(JSON.stringify(responeBody));

  const headers = {
    'content-type': 'application/json',
    'cache-control': `max-age=${CACHE_AGE_IN_SECONDS}`,
  };
  res.header(headers);

  console.log(JSON.stringify(responeBody));

  res.status(200).json(responeBody);
});

router.post('/pub', async (req, res) => {
  console.log(JSON.stringify(req.body));

  const responeBody = {
    result: 'ok',
  };

  console.log(JSON.stringify(responeBody));

  const headers = {
    'content-type': 'application/json',
    'cache-control': `max-age=${CACHE_AGE_IN_SECONDS}`,
  };
  res.header(headers);

  console.log(JSON.stringify(responeBody));

  res.status(200).json(responeBody);
});

export default router;
