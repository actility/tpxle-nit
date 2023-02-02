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

  if ('dev_eui' in body) {
    feeds.deviceEUI = body.dev_eui;
  } else {
    throw new Error('Missing property: dev_eui');
  }

  if ('reported_at' in body && typeof body.reported_at === 'number') {
    // let t = (new Date(body.reported_at * 1000)).toISOString();
    const t = moment().format();
    feeds.time = t;
    feeds.solverInput.receptionTime = t;
  }
  if (typeof body.fcnt !== 'undefined') {
    feeds.solverInput.sequenceNumber = body.fcnt;
  }
  if ('port' in body) {
    feeds.solverInput.port = body.port;
  }

  if ('hotspots' in body) {
    if ('hotspots' in body && Array.isArray(body.hotspots)) {
      const gateways = body.hotspots;
      let packet;
      for (let i = 0; i < gateways.length; i += 1) {
        packet = {};
        if ('name' in gateways[i]) {
          packet.baseStationId = gateways[i].name;
        }
        if ('spreading' in gateways[i]) {
          // spreading = "SF9BW125"
          feeds.solverInput.SF = parseInt(
            gateways[i].spreading.slice(2, gateways[i].spreading.indexOf('BW')),
            10,
          );
        } else {
          feeds.solverInput.SF = 10;
        } // TODO!

        if ('snr' in gateways[i]) {
          packet.SNR = gateways[i].snr;
        }
        if ('rssi' in gateways[i]) {
          packet.RSSI = gateways[i].rssi;
        }
        if (
          'long' in gateways[i] &&
          parseFloat(gateways[i].long) &&
          'lat' in gateways[i] &&
          parseFloat(gateways[i].lat)
        ) {
          packet.antennaCoordinates = [gateways[i].long, gateways[i].lat];
          if ('altitude' in gateways[i]) {
            packet.antennaCoordinates.push(gateways[i].altitude);
          }
        }
        feeds.solverInput.packets.push(packet);
      }
    }
  }

  if ('payload' in body) {
    feeds.payload.payloadEncoded = Buffer.from(body.payload, 'base64').toString('hex');
  }

  return feeds;
};

const translateDownlink = (body) => {
  const result = {
    // "dev_eui": body.deveui.toLowerCase(),
    port: parseInt(body.port, 10),
    confirmed: false,
    payload_raw: Buffer.from(body.payload, 'hex').toString('base64'),
  };
  return result;
};

export { translateUplink, translateDownlink };
