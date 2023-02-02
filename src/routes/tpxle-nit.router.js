import express from 'express';

import {
  uplinkFromActilityAsync,
  downlinkToActilityAsync,
} from '../controllers/actility.controller.js';

import { uplinkFromHeliumAsync, downlinkToHeliumAsync } from '../controllers/helium.controller.js';

import { uplinkFromTTNAsync, downlinkToTTNAsync } from '../controllers/ttn.controller.js';

import { uplinkFromLoriotAsync, downlinkToLoriotAsync } from '../controllers/loriot.controller.js';

import {
  uplinkFromChirpstackAsync,
  downlinkToChirpstackAsync,
} from '../controllers/chirpstack.controller.js';

import {
  uplinkFromEverynetAsync,
  downlinkToEverynetAsync,
} from '../controllers/everynet.controller.js';

import { uplinkFromSenetAsync, downlinkToSenetAsync } from '../controllers/senet.controller.js';

import {
  uplinkFromProximusAsync,
  downlinkToProximusAsync,
} from '../controllers/proximus.controller.js';

import uplinkMQTT1 from '../controllers/mqtt1.controller.js';
import { uplinkMQTT, downlinkMQTT } from '../controllers/mqtt.controller.js';

import {
  uplinkControllerFactory,
  downlinkControllerFactory,
} from '../controllers/controller-factories.js';

const tpxleNITRouterFactory = (mqttClient) => {
  const router = express.Router();

  // // for legacy users that dont use nit key

  router.post('/uplink_from_helium', uplinkControllerFactory(uplinkFromHeliumAsync));
  router.post('/downlink_to_helium', downlinkControllerFactory(downlinkToHeliumAsync));

  router.post('/uplink_from_ttn', uplinkControllerFactory(uplinkFromTTNAsync));
  router.post('/downlink_to_ttn', downlinkControllerFactory(downlinkToTTNAsync));

  router.post('/uplink_from_proximus', uplinkControllerFactory(uplinkFromProximusAsync));
  router.post('/downlink_to_proximus', downlinkControllerFactory(downlinkToProximusAsync));

  // // downlink secured by nitapikey

  router.post('/uplink_from_actility/:nitapikey', uplinkControllerFactory(uplinkFromActilityAsync));
  router.post(
    '/downlink_to_actility/:nitapikey',
    downlinkControllerFactory(downlinkToActilityAsync),
  );

  router.post('/uplink_from_helium/:nitapikey', uplinkControllerFactory(uplinkFromHeliumAsync));
  router.post('/downlink_to_helium/:nitapikey', downlinkControllerFactory(downlinkToHeliumAsync));

  router.post('/uplink_from_ttn/:nitapikey', uplinkControllerFactory(uplinkFromTTNAsync));
  router.post('/downlink_to_ttn/:nitapikey', downlinkControllerFactory(downlinkToTTNAsync));

  router.post('/uplink_from_proximus/:nitapikey', uplinkControllerFactory(uplinkFromProximusAsync));
  router.post(
    '/downlink_to_proximus/:nitapikey',
    downlinkControllerFactory(downlinkToProximusAsync),
  );

  router.post('/uplink_from_loriot/:nitapikey', uplinkControllerFactory(uplinkFromLoriotAsync));
  router.post('/downlink_to_loriot/:nitapikey', downlinkControllerFactory(downlinkToLoriotAsync));

  router.post('/uplink_from_everynet/:nitapikey', uplinkControllerFactory(uplinkFromEverynetAsync));
  router.post(
    '/downlink_to_everynet/:nitapikey',
    downlinkControllerFactory(downlinkToEverynetAsync),
  );

  router.post('/uplink_from_senet/:nitapikey', uplinkControllerFactory(uplinkFromSenetAsync));
  router.post('/downlink_to_senet/:nitapikey', downlinkControllerFactory(downlinkToSenetAsync));

  router.post(
    '/uplink_from_chirpstack/:nitapikey',
    uplinkControllerFactory(uplinkFromChirpstackAsync),
  );
  router.post(
    '/downlink_to_chirpstack/:nitapikey',
    downlinkControllerFactory(downlinkToChirpstackAsync),
  );

  if (mqttClient) {
    router.post('/mqtt/:userId/LE_AS/:asId', uplinkControllerFactory(uplinkMQTT1(mqttClient)));

    router.post('/downlink_mqtt/:subscriberId/:leId/:nsVendor', downlinkMQTT(mqttClient));
    router.post('/uplink_mqtt/:subscriberId/:leId', uplinkMQTT(mqttClient));
  }

  return router;
};

export default tpxleNITRouterFactory;
