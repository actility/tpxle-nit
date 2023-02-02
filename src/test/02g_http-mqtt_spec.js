const testTarget = process.env.TEST__TARGET;

const method = 'POST';

const bodyEcoDxDl = {
  type: 'downlink',
  deveui: process.env.TEST__ECODX_DEVEUI,
  port: '2',
  payload: '020402',
};

const headerCommonDl = {
  'content-type': 'application/json',
};

const urls = {
  lh: {
    dl: `http://localhost:${process.env.NIT__SERVER_PORT}/downlink_mqtt`,
  },
  nt: {
    dl: `https://nano-things.net/tpxle-nit/downlink_mqtt`,
  },
};

const examples = [
  {
    url: `${urls[testTarget].dl}/${process.env.TEST__CLIENT_ID}/dev1/actility`,
    options: { method, headers: headerCommonDl, body: JSON.stringify(bodyEcoDxDl) },
  },
  {
    url: `${urls[testTarget].dl}/${process.env.TEST__CLIENT_ID}/dev1/senet`,
    options: { method, headers: headerCommonDl, body: JSON.stringify(bodyEcoDxDl) },
  },
  {
    url: `${urls[testTarget].dl}/${process.env.TEST__CLIENT_ID_KEYCLOAK}/le-lab/senet`,
    options: { method, headers: headerCommonDl, body: JSON.stringify(bodyEcoDxDl) },
  },
];

export default examples;
