import {
  translateUplink as translateUplinkActility,
  translateDownlink as translateDownlinkActility,
} from './nit-actility.service.js';

import {
  translateUplink as translateUplinkChirpstack,
  translateDownlink as translateDownlinkChirpstack,
} from './nit-chirpstack.service.js';

import {
  translateUplink as translateUplinkEverynet,
  translateDownlink as translateDownlinkEverynet,
} from './nit-everynet.service.js';

import {
  translateUplink as translateUplinkHelium,
  translateDownlink as translateDownlinkHelium,
} from './nit-helium.service.js';

import {
  translateUplink as translateUplinkSenet,
  translateDownlink as translateDownlinkSenet,
} from './nit-senet.service.js';

import {
  translateUplink as translateUplinkTTN,
  translateDownlink as translateDownlinkTTN,
} from './nit-ttn.service.js';

import {
  translateUplink as translateUplinkSptel,
  translateDownlink as translateDownlinkSptel,
} from './nit-sptel.service.js';

export const translateUplinkAll = {
  actility: translateUplinkActility,
  chirpstack: translateUplinkChirpstack,
  everynet: translateUplinkEverynet,
  helium: translateUplinkHelium,
  senet: translateUplinkSenet,
  ttn: translateUplinkTTN,
  sptel: translateUplinkSptel,
};

export const translateDownlinkAll = {
  actility: translateDownlinkActility,
  chirpstack: translateDownlinkChirpstack,
  everynet: translateDownlinkEverynet,
  helium: translateDownlinkHelium,
  senet: translateDownlinkSenet,
  ttn: translateDownlinkTTN,
  sptel: translateDownlinkSptel,
};
