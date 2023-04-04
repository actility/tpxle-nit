import moment from 'moment';

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

  if (typeof body.endDevice?.devEui === 'string') {
    feeds.deviceEUI = body.endDevice?.devEui;
  } else {
    throw new Error('Missing property: DevEUI');
  }

  if (typeof body.recvTime === 'number') {
    feeds.time = moment(body.recvTime).format();
  } else {
    feeds.time = moment().format();
  }

  if (typeof body.fCntUp === 'number') {
    feeds.solverInput.sequenceNumber = body.fCntUp;
  }

  if (typeof body.fPort === 'number') {
    feeds.solverInput.port = body.fPort;
  }

  feeds.solverInput.receptionTime = feeds.time;

  if (typeof body.dataRate === 'string') {
    feeds.solverInput.SF = parseInt(body.dataRate.substring(2, 4), 10); // 'SF10BW125'
  }

  if (typeof body.payload === 'string') {
    if (body.encodingType === 'BASE64') {
      feeds.payload.payloadEncoded = Buffer.from(body.payload, 'base64').toString('hex');
    } else {
      feeds.payload.payloadEncoded = body.payload;
    }
  }

  if (Array.isArray(body.gwInfo)) {
    let packet;
    body.gwInfo.forEach((gw) => {
      packet = {};
      if (typeof gw.gwEui === 'string') {
        packet.baseStationId = gw.gwEui;
      }
      if (typeof gw.snr === 'number') {
        packet.SNR = gw.snr;
      }
      if (typeof gw.rssi === 'number') {
        packet.RSSI = gw.rssi;
      }

      if (typeof gw.longitude === 'number' && typeof gw.latitude === 'number') {
        packet.antennaCoordinates = [gw.longitude, gw.latitude];
        if (typeof gw.altitude === 'number') {
          packet.antennaCoordinates.push(gw.altitude);
        }
      }

      feeds.solverInput.packets.push(packet);
    });
  }

  return feeds;
};

const translateDownlink = (body) => {
  const translatedBody = {
    confirmed: false,
    contentType: 'HEXA',
    endDevice: {
      devEui: body.deveui,
    },
    fPort: body.port,
    payload: body.payload,
  };

  return translatedBody;
};

export { translateUplink, translateDownlink };

// const msg = {
//   id: '642beaccd03c4a000169f047',
//   endDevice: {
//     devEui: '20635F028100003E',
//     devAddr: '02597230',
//     cluster: {
//       id: 1422,
//     },
//   },
//   fPort: 18,
//   fCntDown: 2,
//   fCntUp: 11790,
//   adr: false,
//   confirmed: false,
//   encrypted: false,
//   payload: '034c649d090014ebb6adad4be600ad24ba311acfe063da03a2becd908d7863ff3cca',
//   encodingType: 'HEXA',
//   recvTime: 1680599756526,
//   gwRecvTime: 1680599756526,
//   classB: false,
//   delayed: false,
//   gwCnt: '2',
//   gwInfo: [
//     {
//       gwEui: '7276FF0039030872',
//       rfRegion: 'EU868',
//       rssi: -47,
//       snr: 7.5,
//       channel: 7,
//       radioId: 1,
//       latitude: 0,
//       longitude: 0,
//       altitude: 0,
//     },
//     {
//       gwEui: '7276FF0039030873',
//       rfRegion: 'EU868',
//       rssi: -44,
//       snr: 7.4,
//       channel: 7,
//       radioId: 1,
//       latitude: 1,
//       longitude: 2,
//       altitude: 3,
//     },
//   ],
//   codingRate: '4/5',
//   dataRate: 'SF10BW125',
//   modulation: 'LORA',
//   ulFrequency: '868.5',
// };

// const msg1 = {
//   id: '642bf60cd03c4a00016a028a',
//   endDevice: { devEui: '20635F028100003E', devAddr: '02597230', cluster: { id: 1422 } },
//   fPort: 18,
//   fCntDown: 2,
//   fCntUp: 11882,
//   adr: false,
//   confirmed: false,
//   encrypted: false,
//   payload: '034c649c090014ebb6adad4bd800ad24ba311acf908d7863ff3cc8302303e85f81bc',
//   encodingType: 'HEXA',
//   recvTime: 1680602636307,
//   gwRecvTime: 1680602636307,
//   classB: false,
//   delayed: false,
// };

// console.log(JSON.stringify(translateUplink(msg1), null, 2));

// console.log();

// console.log(
//   JSON.stringify(
//     translateDownlink({
//       deveui: 'aabbccddaabbccdd',
//       payload: 'aabbcc',
//       port: 2,
//     }),
//     null,
//     2,
//   ),
// );
