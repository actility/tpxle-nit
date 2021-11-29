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

  if (body.end_device_ids?.dev_eui) {
    feeds.deviceEUI = body.end_device_ids.dev_eui;
  } else {
    throw new Error('Missing property: end_device_ids.dev_eui');
  }

  if (body.received_at) {
    feeds.time = moment(body.received_at).format();
    feeds.solverInput.receptionTime = feeds.time;
  }

  if (body.uplink_message) {
    if (typeof body.uplink_message.f_cnt !== 'undefined') {
      feeds.solverInput.sequenceNumber = body.uplink_message.f_cnt;
    }

    if (body.uplink_message.f_port) {
      feeds.solverInput.port = body.uplink_message.f_port;
    }

    if (body.uplink_message.frm_payload) {
      feeds.payload.payloadEncoded = Buffer.from(
        body.uplink_message.frm_payload,
        'base64',
      ).toString('hex');
    }

    if (body.uplink_message.settings?.data_rate?.lora?.spreading_factor) {
      feeds.solverInput.SF = body.uplink_message.settings.data_rate.lora.spreading_factor;
    }

    const gateways = body.uplink_message.rx_metadata;
    if (gateways && Array.isArray(gateways)) {
      let packet;
      for (let i = 0; i < gateways.length; i += 1) {
        packet = {};
        if (gateways[i].gateway_ids?.gateway_id) {
          packet.baseStationId = gateways[i].gateway_ids.gateway_id;
        }
        if (gateways[i].snr) {
          packet.SNR = gateways[i].snr;
        }
        if (gateways[i].rssi) {
          packet.RSSI = gateways[i].rssi;
        }

        if (gateways[i].location) {
          if (gateways[i].location.longitude && gateways[i].location.latitude) {
            packet.antennaCoordinates = [
              gateways[i].location.longitude,
              gateways[i].location.latitude,
            ];
            if (gateways[i].location.altitude) {
              packet.antennaCoordinates.push(gateways[i].location.altitude);
            }
          }
        }

        feeds.solverInput.packets.push(packet);
      }
    }
  }

  return feeds;
};

const translateDownlink = (body) => {
  const result = {
    // "dev_eui": body.deveui.toLowerCase(),
    downlinks: [
      {
        frm_payload: Buffer.from(body.payload, 'hex').toString('base64'),
        f_port: body.port,
        priority: 'NORMAL',
      },
    ],
  };
  return result;
};

export { translateUplink, translateDownlink };
