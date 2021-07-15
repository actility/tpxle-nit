const data = {
  "end_device_ids": {
    "device_id": "smartbadge-3f5",
    "application_ids": {
      "application_id": "abeeway-tpxle"
    },
    "dev_eui": "20635F01E10003F5",
    "join_eui": "20635F000A000017",
    "dev_addr": "260B14FD"
  },
  "correlation_ids": [
    "as:up:01FAJMCPVH8JJNRS1WGPV0M2X0",
    "gs:conn:01FAJM2YBR80Z3DQT5XF1M3WK7",
    "gs:up:host:01FAJM2YBX46QHKYMFQE05Q84Q",
    "gs:uplink:01FAJMCPMZJW3ASQMDKFG38TTK",
    "ns:uplink:01FAJMCPN07XXGXYHG50D3HNRW",
    "rpc:/ttn.lorawan.v3.GsNs/HandleUplink:01FAJMCPN0GRFP7RA7VC0KYD3X",
    "rpc:/ttn.lorawan.v3.NsAs/HandleUplink:01FAJMCPVGYFQ24Z885PM2TK9M"
  ],
  "received_at": "2021-07-14T13:48:09.459082030Z",
  "uplink_message": {
    "session_key_id": "AXqlQzYRgJNIwl/L8XRaBg==",
    "f_port": 18,
    "f_cnt": 1,
    "frm_payload": "A0wUlgEAnn9/dQ==",
    "rx_metadata": [
      {
        "gateway_ids": {
          "gateway_id": "tek-micro-01",
          "eui": "647FDAFFFE005610"
        },
        "timestamp": 323682596,
        "rssi": -43,
        "channel_rssi": -43,
        "snr": 7,
        "location": {
          "latitude": 47.43838566699402,
          "longitude": 18.926505613096722,
          "source": "SOURCE_REGISTRY"
        },
        "uplink_token": "ChoKGAoMdGVrLW1pY3JvLTAxEghkf9r//gBWEBCkgqyaARoLCJnWu4cGENy553UgoOnx57UJ",
        "channel_index": 2
      }
    ],
    "settings": {
      "data_rate": {
        "lora": {
          "bandwidth": 125000,
          "spreading_factor": 10
        }
      },
      "data_rate_index": 2,
      "coding_rate": "4/5",
      "frequency": "867500000",
      "timestamp": 323682596
    },
    "received_at": "2021-07-14T13:48:09.248945739Z",
    "consumed_airtime": "0.411648s",
    "version_ids": {
      "brand_id": "abeeway",
      "model_id": "abeeway-smart-badge",
      "hardware_version": "1.0",
      "firmware_version": "2.1",
      "band_id": "EU_863_870"
    }
  }
}

import { translate_uplink, translate_downlink } from '../services/nit-ttn.service.js';

console.log(JSON.stringify(translate_uplink(data), null, 4));