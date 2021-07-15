import express from 'express';

import logger from '../logger.js';

const router = express.Router();

import { uplink_from_helium, downlink_to_helium } from '../controllers/helium.controller.js'
import { uplink_from_ttn, downlink_to_ttn } from '../controllers/ttn.controller.js'

router.post('/uplink_from_helium', uplink_from_helium);
router.post('/downlink_to_helium', downlink_to_helium);
router.post('/uplink_from_ttn', uplink_from_ttn);
router.post('/downlink_to_ttn', downlink_to_ttn);

router.get('/test', (req, res) => {
    logger.debug('Test request received on server');
    res.write("The server works\n");
    res.status(200).end();
    return;
});

export { router };
