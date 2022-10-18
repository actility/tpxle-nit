import express from 'express';

// import logger from '../logger.js';

// import { tpxleAuth } from '../middlewares/tpxle-auth.middleware.js';

// import { uplinkFromHelium, downlinkToHelium } from '../controllers/helium.controller.js';
// import { uplinkFromTTN, downlinkToTTN } from '../controllers/ttn.controller.js';
// import { uplinkFromLoriot, downlinkToLoriot } from '../controllers/loriot.controller.js';
import {
  uplinkFromChirpstackAsync,
  downlinkToChirpstackAsync,
} from '../controllers/chirpstack.controller.js';
// import { uplinkFromEverynet, downlinkToEverynet } from '../controllers/everynet.controller.js';

import {
  uplinkControllerFactory,
  downlinkControllerFactory,
} from '../controllers/ctrl-factories.controller.js';
import { uplinkFromSenetAsync, downlinkToSenetAsync } from '../controllers/senet.controller.js';

// import { uplinkFromProximus } from '../controllers/proximus.controller.js';

import { downlinkMQTT, uplinkMQTT } from '../controllers/mqtt.controller.js';

const tpxleNITRouterFactory = (mqttClient) => {
  const router = express.Router();

  router.post('/uplink_from_senet/:nitapikey', uplinkControllerFactory(uplinkFromSenetAsync));
  router.post('/downlink_to_senet/:nitapikey', downlinkControllerFactory(downlinkToSenetAsync));

  // // router.use('/uplink_from_*', tpxleAuth);

  // // for legacy users that dont use nit key

  // router.use('/uplink_from_helium', tpxleAuth);
  // router.post('/uplink_from_helium', uplinkFromHelium);
  // router.post('/downlink_to_helium', downlinkToHelium);

  // router.use('/uplink_from_ttn', tpxleAuth);
  // router.post('/uplink_from_ttn', uplinkFromTTN);
  // router.post('/downlink_to_ttn', downlinkToTTN);

  // // downlink secured by nitapikey

  // router.use('/uplink_from_helium', tpxleAuth);
  // router.post('/uplink_from_helium/:nitapikey', uplinkFromHelium);
  // router.post('/downlink_to_helium/:nitapikey', downlinkToHelium);

  // router.use('/uplink_from_ttn', tpxleAuth);
  // router.post('/uplink_from_ttn/:nitapikey', uplinkFromTTN);
  // router.post('/downlink_to_ttn/:nitapikey', downlinkToTTN);

  // router.use('/uplink_from_loriot', tpxleAuth);
  // router.post('/uplink_from_loriot/:nitapikey', uplinkFromLoriot);
  // router.post('/downlink_to_loriot/:nitapikey', downlinkToLoriot);

  router.post(
    '/uplink_from_chirpstack/:nitapikey',
    uplinkControllerFactory(uplinkFromChirpstackAsync),
  );
  router.post(
    '/downlink_to_chirpstack/:nitapikey',
    downlinkControllerFactory(downlinkToChirpstackAsync),
  );

  // router.use('/uplink_from_everynet', tpxleAuth);
  // router.post('/uplink_from_everynet/:nitapikey', uplinkFromEverynet);
  // router.post('/downlink_to_everynet/:nitapikey', downlinkToEverynet);

  // // router.use('/uplink_from_senet', tpxleAuth);
  // // router.post('/uplink_from_senet/:nitapikey', uplinkFromSenet);
  // // router.post('/downlink_to_senet/:nitapikey', downlinkToSenet);

  // router.use('/uplink_from_proximus', tpxleAuth);
  // router.post('/uplink_from_proximus', uplinkFromProximus);

  if (mqttClient) {
    router.post('/downlink_mqtt/:subscriberId/:leId/:nsVendor', downlinkMQTT(mqttClient));
    router.post('/uplink_mqtt/:subscriberId/:leId', uplinkMQTT(mqttClient));
    // https://nano-things.net/tpxle-nit/uplink_mqtt/15499/le-lab
  }

  return router;
};

export default tpxleNITRouterFactory;
