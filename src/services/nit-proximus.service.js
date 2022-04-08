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

  if ('DevEUI' in body) {
    feeds.deviceEUI = body.DevEUI;
  } else {
    throw new Error('Missing property: DevEUI');
  }

  if ('timestamp' in body) {
    const t = new Date(body.timestamp).toISOString();
    feeds.time = t;
    feeds.solverInput.receptionTime = t;
  } else {
    feeds.time = new Date().toISOString();
  }

  feeds.solverInput.port = 18;
  feeds.solverInput.SF = 10;
  // workaround for sequence number
  const n = Math.floor(new Date().getTime() / 20000);
  feeds.solverInput.sequenceNumber = n - 100000 * Math.floor(n / 100000);

  /*
  if ('FCntUp' in body) {
    feeds.solverInput.sequenceNumber = body.FCntUp;
  }
  if ('FPort' in body) {
    feeds.solverInput.port = body.FPort;
  }
  if ('Time' in body) {
    feeds.solverInput.receptionTime = body.Time;
  }
  if ('SpFact' in body) {
    feeds.solverInput.SF = body.SpFact;
  }

  if ('Lrrs' in body && 'Lrr' in body.Lrrs && Array.isArray(body.Lrrs.Lrr)) {
    const lrr = body.Lrrs.Lrr; // Array of base stations
    let packet;
    for (let i = 0; i < lrr.length; i += 1) {
      packet = {};
      if ('Lrrid' in lrr[i]) {
        packet.baseStationId = lrr[i].Lrrid;
      }
      if ('LrrSNR' in lrr[i]) {
        packet.SNR = lrr[i].LrrSNR;
      }
      if ('LrrRSSI' in lrr[i]) {
        packet.RSSI = lrr[i].LrrRSSI;
      }
      if ('LrrLAT' in lrr[i] && 'LrrLON' in lrr[i]) {
        packet.antennaCoordinates = [lrr[i].LrrLON, lrr[i].LrrLAT];
      } else if (
        'Lrrid' in body &&
        body.Lrrid === lrr[i].Lrrid &&
        'LrrLAT' in body &&
        'LrrLON' in body
      ) {
        packet.antennaCoordinates = [body.LrrLON, body.LrrLAT];
      }
      feeds.solverInput.packets.push(packet);
    }
  }

*/

  if ('value' in body) {
    feeds.payload.payloadEncoded = body.value;
  }

  console.log(feeds);

  return feeds;
};

const translateDownlink = (body) => {
  // TODO: To be written
  const translatedBody = body;
  return translatedBody;
};

export { translateUplink, translateDownlink };
