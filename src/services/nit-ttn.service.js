import moment from 'moment';

let translate_uplink = body => {

    let feeds = {
        // deviceEUI: "",                                     // mandatory
        // time: "",
        // coordinates: [],                                   // [longitude, latitude, altitude]
                                                            // used if NS provides resolved coordinates
        solverInput: {
            solverInputType: "FeedInputForGenericSolver",
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
            ]
            // dynamicMotionState: "string",    // ['MOVING', 'STATIC', 'UNKNOWN']
            // temperatureMeasure: 0,           // in Celsius
            // accelerometerMeasures: [],       // measures per axis, i.e. [x, y, z]
            // gyroscopeMeasures: [],           // measures per axis, i.e. [roll, pitch, yaw]
            // barometerMeasure: 0,             // in mBar
            // lastContext: "string"            // Base64 encoded binary solver state
                                                // with the last calculated position
        },
        payload: {
            deviceProfileId: "ABEEWAY/MICRO",   // Currently only Abeeway Microtracker and
                                                // Industrial Tracker are supported. "deviceProfileId"
                                                // should be set to "ABEEWAY/MICRO" for both
            payloadEncoded: ""
        }
    }
         
    try {
        feeds.deviceEUI = body.end_device_ids.dev_eui;
    } catch (err) {
        throw new Error("Missing property: end_device_ids.dev_eui");
    }

    try {
        feeds.time = moment(body.received_at).format();
        feeds.solverInput.receptionTime = feeds.time;
    } catch (err) {}

    try {
        feeds.solverInput.sequenceNumber = body.uplink_message.f_cnt;
    } catch (err) {}

    try {
        feeds.solverInput.port = body.uplink_message.f_port;
    } catch (err) {}
        
    try {
        feeds.payload.payloadEncoded = Buffer.from(body.uplink_message.frm_payload, 'base64').toString('hex');
    } catch (err) {}

    try {
        feeds.solverInput.SF = body.uplink_message.settings.data_rate.lora.spreading_factor;;
    } catch (err) {}

    let gateways;
    try {
        gateways = body.uplink_message.rx_metadata;
    } catch (err) {}
    if (gateways && Array.isArray(gateways)) {
        let packet;
        for (let i=0; i<gateways.length; i++) {
            packet = {};
            try { 
                packet.baseStationId = gateways[i].gateway_ids.gateway_id; 
            } catch (err) {}
            try { 
                packet.SNR = gateways[i].snr; 
            } catch (err) {}
            try { 
                packet.RSSI = gateways[i].rssi; 
            } catch (err) {}


            try { 
                packet.antennaCoordinates = [ 
                    gateways[i].location.longitude,
                    gateways[i].location.latitude
                ];
                try {
                    packet.antennaCoordinates.push(gateways[i].location.altitude);
                } catch (err) {}
            } catch (err) {}

            feeds.solverInput.packets.push(packet);
        }
    }

    return feeds;

}

let translate_downlink = body => {

    return {
        // "dev_eui": body.deveui.toLowerCase(),
        "downlinks": [{
            "frm_payload": Buffer.from(body.payload, 'hex').toString('base64'),
            "f_port": body.port,
            "priority": "NORMAL"
        }]
    };

}

export {
    translate_uplink,
    translate_downlink
};

