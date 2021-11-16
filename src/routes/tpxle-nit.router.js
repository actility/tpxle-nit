import express from 'express';

import logger from '../logger.js';

import { tpxleAuth } from '../middlewares/tpxle-auth.middleware.js';

import { uplinkFromHelium, downlinkToHelium } from '../controllers/helium.controller.js';
import { uplinkFromTTN, downlinkToTTN } from '../controllers/ttn.controller.js';
import {
  uplinkFromChirpstack,
  downlinkToChirpstack,
} from '../controllers/chirpstack.controller.js';
import { uplinkFromEverynet, downlinkToEverynet } from '../controllers/everynet.controller.js';

const router = express.Router();

router.use('/uplink_from_*', tpxleAuth);

// for legacy users that dont use nit key

router.post('/uplink_from_helium', uplinkFromHelium);
router.post('/downlink_to_helium', downlinkToHelium);

router.post('/uplink_from_ttn', uplinkFromTTN);
router.post('/downlink_to_ttn', downlinkToTTN);

router.post('/uplink_from_chirpstack', uplinkFromChirpstack);
router.post('/downlink_to_chirpstack', downlinkToChirpstack);

router.post('/uplink_from_everynet', uplinkFromEverynet);
router.post('/downlink_to_everynet', downlinkToEverynet);

// downlink secured by nitapikey

router.post('/uplink_from_helium/:nitapikey', uplinkFromHelium);
router.post('/downlink_to_helium/:nitapikey', downlinkToHelium);

router.post('/uplink_from_ttn/:nitapikey', uplinkFromTTN);
router.post('/downlink_to_ttn/:nitapikey', downlinkToTTN);

router.post('/uplink_from_chirpstack/:nitapikey', uplinkFromChirpstack);
router.post('/downlink_to_chirpstack/:nitapikey', downlinkToChirpstack);

router.post('/uplink_from_everynet/:nitapikey', uplinkFromEverynet);
router.post('/downlink_to_everynet/:nitapikey', downlinkToEverynet);

// test route

router.get('/test', (req, res) => {
  logger.debug('Test request received on server');
  res.write('The server works\n');
  res.status(200).end();
});

export default router;
