// import moment from 'moment';

// import logger from '../logger.js';

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
    feeds.deviceEUI = body.devEUI;
  } else {
    throw new Error('Missing property: body.devEUI');
  }

  const t = body.time ? new Date(body.time).toISOString() : new Date().toISOString();
  feeds.time = t;
  feeds.solverInput.receptionTime = t;

  if (typeof body.fCnt !== 'undefined') {
    feeds.solverInput.sequenceNumber = body.fCnt;
  }

  if (typeof body.fPort !== 'undefined') {
    feeds.solverInput.port = body.fPort;
  }

  if (typeof body.txInfo?.dr !== 'undefined') {
    feeds.solverInput.SF = 12 - body.txInfo.dr;
  } else {
    feeds.solverInput.SF = 10;
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
        packet.baseStationId = gw.gatewayID;
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

  // console.log(`SPTEL: Before Translate: DevEUI: ${feeds.deviceEUI}: ${JSON.stringify(body)}`);
  // console.log(`SPTEL: After Translate: DevEUI: ${feeds.deviceEUI}: ${JSON.stringify(feeds)}`);

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

/*

// Testing

const sampleULMsg = {
  applicationID: '1',
  applicationName: 'testbed-app-2',
  deviceName: 'watermeter',
  devEUI: '09000000ffff1033',
  rxInfo: [
    {
      gatewayID: '7276ff000b031dc7',
      uplinkID: 'f735f45a-65d5-4d72-92ca-d3b3d03362fc',
      name: 'kerlink-gw-01-423',
      rssi: -98,
      loRaSNR: 9,
      location: {
        latitude: 1,
        longitude: 2,
        altitude: 0,
      },
    },
    {
      gatewayID: '24e124fffef3304f',
      uplinkID: 'e83005f5-3685-4a99-883a-fd42a24a5b1e',
      name: 'innomiletest-531',
      time: '2022-01-12T06:11:55.046425Z',
      rssi: -108,
      loRaSNR: 10.2,
      location: {
        latitude: 4,
        longitude: 5,
        altitude: 0,
      },
    },
  ],
  txInfo: {
    frequency: 923400000,
    dr: 5,
  },
  adr: false,
  fCnt: 17905,
  fPort: 102,
  data: 'CAAM5EAkBgAGP9g=',
  object: {
    battery: '1.56',
    hum: '105.33',
    period: '18560 sec',
    temp: '-38.61',
  },
  device_id: '16905f5cd1205f2b',
  time: '2022-01-12 06:13:56',
};

console.log(JSON.stringify(translateUplink(sampleULMsg), null, 4));

*/
