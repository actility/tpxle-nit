import express from 'express';

// import logger from '../logger.js';

// import { tpxleAuth } from '../middlewares/tpxle-auth.middleware.js';

const router = express.Router();

router.post('/getuser', (req, res) => {
  console.log('/mosquitto/getuser');
  console.log(req.body);
  // res.send(body);
  res.status(200).end();
});

router.post('/superuser', (req, res) => {
  console.log('/mosquitto/superuser');
  console.log(req.body);
  console.log('refused');
  // res.status(200).end();
  res.status(400).end();
});

router.post('/aclcheck', (req, res) => {
  console.log('/mosquitto/aclcheck');
  console.log(req.body);
  if (req.body.topic === '/data/sensors') {
    console.log('accepted');
    res.status(200).end();
  } else {
    console.log('refused');
    res.status(400).end();
  }
});

export default router;
