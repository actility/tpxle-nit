import { translateUplink } from '../services/nit-helium.service.js';

const data = {
  app_eui: '20635F000A000017',
  dev_eui: '20635F01E10003F5',
  devaddr: '47000048',
  downlink_url:
    'https://console.helium.com/api/v1/down/602d5ed3-9f7a-46a8-8f2f-fc708934a6df/aqT-TV_bzcXZ6VbU3pp8v_oohvwX-0eR/ac79ea27-c83c-46ea-8ac8-3061532f8bcb',
  fcnt: 347,
  hotspots: [
    {
      channel: 6,
      frequency: 867.7000122070312,
      hold_time: 2428,
      id: '11ZcDysWK8ziGNGoYQfw2gcwTUmC14cMEbQX7LcBcQzJnYPoPpd',
      lat: 47.491569623186855,
      long: 19.112110896787716,
      name: 'huge-boysenberry-toad',
      reported_at: 1621521170543,
      rssi: -109,
      snr: -14.800000190734863,
      spreading: 'SF10BW125',
      status: 'success',
    },
  ],
  id: 'ac79ea27-c83c-46ea-8ac8-3061532f8bcb',
  metadata: {
    adr_allowed: false,
    labels: [
      {
        id: '74b7c220-bea1-47f8-a05e-45fed81fa74d',
        name: 'TPXLE',
        organization_id: 'f06c5fc1-41e8-492c-b4a9-7abc2f023ed8',
      },
    ],
    multi_buy: 1,
    organization_id: 'f06c5fc1-41e8-492c-b4a9-7abc2f023ed8',
  },
  name: 'Microtracker-496-Norbert',
  payload: 'BSC2hgBAAQkBAgAA',
  payload_size: 12,
  port: 17,
  reported_at: 1621521170543,
  uuid: '0c9fa607-6079-4b2f-b1a6-1d6659b320f1',
};

console.log(JSON.stringify(translateUplink(data), null, 4));
