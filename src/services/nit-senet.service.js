// import moment from 'moment';

const translateUplink = (body) => {
  const feeds = {
    // deviceEUI: "",                                     // mandatory
    // time: "",
    // coordinates: [],                                   // [longitude, latitude, altitude]
    // used if NS provides resolved coordinates
    solverInput: {
      solverInputType: 'FeedInputForGpsSolver',
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

  if ('devEui' in body) {
    feeds.deviceEUI = body.devEui;
  } else {
    throw new Error('Missing property: devEui');
  }

  if ('txtime' in body && typeof body.txtime === 'string') {
    const t = new Date(body.txtime).toISOString();
    feeds.time = t;
    feeds.solverInput.receptionTime = t;
  }
  if (typeof body.seqno !== 'undefined') {
    feeds.solverInput.sequenceNumber = body.seqno;
  }
  if ('port' in body) {
    feeds.solverInput.port = body.port;
  }
  if ('datarate' in body) {
    feeds.solverInput.SF = 12 - body.datarate;
  } else {
    feeds.solverInput.SF = 10;
  } // TODO!

  const packet = {};
  if ('gwEui' in body) {
    packet.baseStationId = body.gwEui;
  }
  if ('rssi' in body) {
    packet.RSSI = body.rssi;
  } else {
    packet.RSSI = -100;
  } // TODO!
  if ('snr' in body) {
    packet.SNR = body.snr;
  } else {
    packet.SNR = -1;
  } // TODO!
  feeds.solverInput.packets.push(packet);

  if ('pdu' in body) {
    feeds.payload.payloadEncoded = body.pdu;
  }

  return feeds;
};

const translateDownlink = (body) => {
  const params = {
    eui: body.deveui,
    value: body.payload,
    confirmed: false,
    port: body.port,
    timeoutMinutes: 2,
  };
  // https://portal.senetco.io/rest/current/device/sendmsg?apikey={{params.apikey}}&eui={{params.eui}}&value={{params.value}}&confirmed={{params.confirmed}}&port={{params.port}}&timeoutMinutes={{params.timeoutMinutes}}
  // 'apikey' params to be added, and to convert to query string in the controller !!!
  return params;
};

export { translateUplink, translateDownlink };
