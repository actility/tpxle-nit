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

  if (body.meta?.device) {
    feeds.deviceEUI = body.meta.device;
  } else {
    throw new Error('Missing property: body.meta.device');
  }

  if (body.meta?.time) {
    feeds.time = moment(body.meta.time * 1000).format();
  }

  if (typeof body.params?.counter_up !== 'undefined') {
    feeds.solverInput.sequenceNumber = body.params.counter_up;
  }

  if (body.params?.port) {
    feeds.solverInput.port = body.params.port;
  }

  if (body.params?.rx_time) {
    feeds.solverInput.receptionTime = moment(body.params.rx_time * 1000).format();
  }

  if (body.params?.radio?.modulation?.spreading) {
    feeds.solverInput.SF = body.params?.radio?.modulation?.spreading;
  }

  if (body.params?.payload) {
    feeds.payload.payloadEncoded = Buffer.from(body.params.payload, 'base64').toString('hex');
  }

  const packet = {};
  if (body.meta?.gateway) {
    packet.baseStationId = body.meta.gateway;
  }
  if (body.params?.radio?.hardware?.snr) {
    packet.SNR = body.params.radio.hardware.snr;
  }
  if (body.params?.radio?.hardware?.rssi) {
    packet.RSSI = body.params.radio.hardware.rssi;
  }

  if (body.params?.radio?.hardware?.gps) {
    if (body.params.radio.hardware.gps.lat && body.params.radio.hardware.gps.lng) {
      packet.antennaCoordinates = [
        body.params.radio.hardware.gps.lng,
        body.params.radio.hardware.gps.lat,
      ];
      if (body.params.radio.hardware.gps.alt) {
        packet.antennaCoordinates.push(body.params.radio.hardware.gps.alt);
      }
    }
  }
  feeds.solverInput.packets.push(packet);

  // console.log(JSON.stringify(body, null, 4));
  // console.log(JSON.stringify(feeds, null, 4));

  return feeds;
};

const translateDownlink = (body) => {
  /*
  const result1 = {
    deviceQueueItem: {
      confirmed: false,
      data: Buffer.from(body.payload, 'hex').toString('base64'),
      devEUI: Buffer.from(body.deveui, 'hex').toString('base64'),
      // "fCnt": 0,
      fPort: body.port,
      // "jsonObject": "string"
    },
  };
  */

  /*
  const result = {
    meta: {
      // "network": "75697b95",
      // "gateway": "7c95bd79864622a4",
      device: body.deveui.toLowerCase(),
      // "device_addr": "36c365b4",
      // "application": "70b3d54b17db0106",
      // "packet_id": "fdbb09021c4523d9f28bb815ca872c70",
      // "packet_hash": "79f664df2c2073af798fa87497305d8d"
    },
    params: {
      // "counter_down": 71,
      confirmed: false,
      payload: Buffer.from(body.payload, 'hex').toString('base64'),
      port: body.port, // ??????? not documented I just guess!!
    },
    type: 'downlink_response',
  };
  */

  const result = {
    payload: Buffer.from(body.payload, 'hex').toString('base64'),
    port: body.port, // ??????? not documented I just guess!!
  };
  return result;
};

export { translateUplink, translateDownlink };
