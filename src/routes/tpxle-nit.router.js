import express from 'express';

import logger from '../logger.js';
import { uplinkFromHelium, downlinkToHelium } from '../controllers/helium.controller.js';
import { uplinkFromTTN, downlinkToTTN } from '../controllers/ttn.controller.js';

const router = express.Router();

router.post('/uplink_from_helium', uplinkFromHelium);
router.post('/downlink_to_helium', downlinkToHelium);
router.post('/uplink_from_ttn', uplinkFromTTN);
router.post('/downlink_to_ttn', downlinkToTTN);

router.get('/test', (req, res) => {
  logger.debug('Test request received on server');
  res.write('The server works\n');
  res.status(200).end();
});

export default router;
