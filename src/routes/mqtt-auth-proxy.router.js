import express from 'express';

import { getAccessTokenAsync } from '../middlewares/tpxle-auth.middleware.js';

// import logger from '../logger.js';

// import { tpxleAuth } from '../middlewares/tpxle-auth.middleware.js';

const router = express.Router();

router.post('/getuser', async (req, res) => {
  console.log('/mosquitto/getuser');
  console.log(req.body);

  try {
    const accessToken = await getAccessTokenAsync(
      decodeURIComponent(req.body.username),
      // req.body.username,
      decodeURIComponent(req.body.password),
      'dev1',
    );
    const subscriberId = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString(),
    ).scope[0].split(':')[1];
    console.log(subscriberId);
    res.status(200).end();
  } catch (err) {
    res.status(403).end();
  }
  // res.status(200).end();
  // res.send(body);
});

router.post('/superuser', async (req, res) => {
  console.log('/mosquitto/superuser');
  console.log(req.body);
  console.log('refused');
  // res.status(200).end();
  res.status(400).end();
});

router.post('/aclcheck', async (req, res) => {
  console.log('/mosquitto/aclcheck');
  console.log(req.body);

  try {
    const accessToken = await getAccessTokenAsync(
      decodeURIComponent(req.body.username),
      '',
      'dev1',
    );
    const subscriberId = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString(),
    ).scope[0].split(':')[1];
    console.log(subscriberId);

    const topicElements = req.body.topic.split('/');
    if (topicElements[0] === subscriberId && ['uplink', 'downlink'].includes(topicElements[1])) {
      console.log('accepted');
      res.status(200).end();
      return;
    }

    console.log('refused');
    res.status(400).end();
  } catch (err) {
    res.status(403).end();
  }
});

export default router;
