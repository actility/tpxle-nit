import moment from 'moment';

import logger from '../logger.js';

const translateUplink = (body) => {
  const feeds = {
    // deviceEUI: "",                                     // mandatory
    // time: "",
    // coordinates: [],                                   // [longitude, latitude, altitude]
    // used if NS provides resolved coordinates
    solverInput: {
      solverInputType: 'FeedInputForGenericSolver',
      // sequenceNumber: 1,                             // LoRaWAN FCntUp
      // port: 1,                                       // LoRaWAN FPort
      // receptionTime: "",
      // SF: 12,                                        // LoRaWAN Spreading Factor
      packets: [
        // {
        // baseStationId: "0805022D",
        // antennaId: 0,
        // antennaCoordinates: [7.0513, 43.6181], // [longitude, latitude, altitude]
        // antennaHeight: 150,                    // in cm
        // SNR: 10,                               // in dB
        // RSSI: -29,                             // in dBm
        // barometerMeasure: 0,                   // in mB
        // arrivalSeconds: 1,                     // in seconds
        // arrivalAdditionalNanos: 7275           // in nanoseconds
        // }
      ],
      // dynamicMotionState: "string",    // ['MOVING', 'STATIC', 'UNKNOWN']
      // temperatureMeasure: 0,           // in Celsius
      // accelerometerMeasures: [],       // measures per axis, i.e. [x, y, z]
      // gyroscopeMeasures: [],           // measures per axis, i.e. [roll, pitch, yaw]
      // barometerMeasure: 0,             // in mBar
      // lastContext: "string"            // Base64 encoded binary solver state
      // with the last calculated position
    },
    payload: {
      deviceProfileId: 'ABEEWAY/MICRO', // Currently only Abeeway Microtracker and
      // Industrial Tracker are supported. "deviceProfileId"
      // should be set to "ABEEWAY/MICRO" for both
      payloadEncoded: '',
    },
  };

  if (body.devEUI) {
    feeds.deviceEUI = Buffer.from(body.devEUI, 'base64').toString('hex');
  } else {
    throw new Error('Missing property: body.devEUI');
  }

  let time;
  if (body.rxInfo && Array.isArray(body.rxInfo)) {
    if (body.rxInfo[0].time) {
      time = moment(body.rxInfo[0].time);
    }
    if (!time?.isValid() && body.rxInfo[0].timeSinceGPSEpoch) {
      time = moment(parseFloat(body.rxInfo[0].timeSinceGPSEpoch) * 1000);
    }
  }
  if (!time?.isValid()) {
    time = moment();
  }

  feeds.time = time.format();
  feeds.solverInput.receptionTime = feeds.time;

  if (typeof body.fCnt !== 'undefined') {
    feeds.solverInput.sequenceNumber = body.fCnt;
  }

  if (body.fPort) {
    feeds.solverInput.port = body.fPort;
  }

  if (body.txInfo?.spreadingFactor) {
    feeds.solverInput.SF = body.body.txInfo.spreadingFactor;
  }

  if (body.data) {
    feeds.payload.payloadEncoded = Buffer.from(body.data, 'base64').toString('hex');
    // feeds.payload.payloadEncoded = body.data;
  }

  const gateways = body.rxInfo;
  if (gateways && Array.isArray(gateways)) {
    let packet;
    gateways.forEach((gw) => {
      packet = {};
      if (gw.gatewayID) {
        packet.baseStationId = Buffer.from(gw.gatewayID, 'base64').toString('hex');
      }
      if (gw.loRaSNR) {
        packet.SNR = gw.loRaSNR;
      }
      if (gw.rssi) {
        packet.RSSI = gw.rssi;
      }

      if (gw.location) {
        if (gw.location.longitude && gw.location.latitude) {
          packet.antennaCoordinates = [gw.location.longitude, gw.location.latitude];
          if (gw.location.altitude) {
            packet.antennaCoordinates.push(gw.location.altitude);
          }
        }
      }
      feeds.solverInput.packets.push(packet);
    });
  }

  logger.debug(`Before Translate: DevEUI: ${feeds.deviceEUI}: ${JSON.stringify(body)}`);
  logger.debug(`After Translate: DevEUI: ${feeds.deviceEUI}: ${JSON.stringify(feeds)}`);

  return feeds;
};

const translateDownlink = (body) => {
  const result = {
    deviceQueueItem: {
      confirmed: false,
      data: Buffer.from(body.payload, 'hex').toString('base64'),
      devEUI: Buffer.from(body.deveui, 'hex').toString('base64'),
      // "fCnt": 0,
      fPort: body.port,
      // "jsonObject": "string"
    },
  };

  return result;
};

export { translateUplink, translateDownlink };
