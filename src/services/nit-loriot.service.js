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

  if ('EUI' in body) {
    feeds.deviceEUI = body.EUI;
  } else {
    throw new Error('Missing property: EUI');
  }

  if ('ts' in body) {
    const date = new Date(body.ts);
    feeds.time = date.toISOString();
    feeds.solverInput.receptionTime = date.toISOString();
  }

  if ('fcnt' in body) {
    feeds.solverInput.sequenceNumber = body.fcnt;
  }
  if ('port' in body) {
    feeds.solverInput.port = body.port;
  }

  if ('dr' in body) {
    feeds.solverInput.SF = parseInt(body.dr.substring(2, 4), 10); // 'SF12 BW125 4/5'
  }

  const packet = {};

  // if ('gtw_id' in body) {
  //     packet.baseStationId = body.gtw_id;
  // }

  if ('snr' in body) {
    packet.SNR = body.snr;
  }
  if ('rssi' in body) {
    packet.RSSI = body.rssi;
  }

  // if (
  //     ('longitude' in body &&
  //     ('latitude' in body)
  // ) {
  //     packet.antennaCoordinates = [
  //         body.longitude,
  //         body.latitude
  //     ];
  //     if ('altitude' in body) {
  //         packet.antennaCoordinates.push(body.altitude);
  //     }
  // }

  feeds.solverInput.packets.push(packet);

  if ('data' in body) {
    feeds.payload.payloadEncoded = body.data;
  }

  return feeds;
};

const translateDownlink = (body) => {
  const result = {
    cmd: 'tx',
    EUI: body.deveui.toLowerCase(),
    port: body.port,
    confirmed: false,
    data: body.payload,
    // appid: 'BE01000D',
  };
  return result;
};
export { translateUplink, translateDownlink };
