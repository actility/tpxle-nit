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

router.use('/uplink_from_helium', tpxleAuth);
router.post('/uplink_from_helium', uplinkFromHelium);
router.post('/downlink_to_helium', downlinkToHelium);

router.use('/uplink_from_ttn', tpxleAuth);
router.post('/uplink_from_ttn', uplinkFromTTN);
router.post('/downlink_to_ttn', downlinkToTTN);

router.use('/uplink_from_helium/:nitapikey', tpxleAuth);
router.post('/uplink_from_helium/:nitapikey', uplinkFromHelium);
router.post('/downlink_to_helium/:nitapikey', downlinkToHelium);

router.use('/uplink_from_ttn/:nitapikey', tpxleAuth);
router.post('/uplink_from_ttn/:nitapikey', uplinkFromTTN);
router.post('/downlink_to_ttn/:nitapikey', downlinkToTTN);

router.use('/uplink_from_chirpstack/:nitapikey', tpxleAuth);
router.post('/uplink_from_chirpstack/:nitapikey', uplinkFromChirpstack);
router.post('/downlink_to_chirpstack/:nitapikey', downlinkToChirpstack);

router.use('/uplink_from_everynet/:nitapikey', tpxleAuth);
router.post('/uplink_from_everynet/:nitapikey', uplinkFromEverynet);
router.post('/downlink_to_everynet/:nitapikey', downlinkToEverynet);

router.get('/test', (req, res) => {
  logger.debug('Test request received on server');
  res.write('The server works\n');
  res.status(200).end();
});

export default router;
