const getVerifiedArchitectureName = (architectureName) => {
  switch (architectureName) {
    case 'ECOKC':
    case 'ECODX':
    case 'PREVKC':
    case 'PREVDX':
      return architectureName;
    case 'abeeway-mobile-app':
      return 'ECOKC';
    case 'dev1':
      return 'ECODX';
    case 'le-lab':
      return 'PREVKC';
    case 'rnd':
      return 'PREVDX';
    default:
      return undefined;
  }
};

const getConfParam = (architectureName, paramName) => {
  const verifiedArchitectureName = getVerifiedArchitectureName(architectureName);
  switch (paramName) {
    case 'PUBLISHED_NIT_URL':
    case 'FEED_URL':
    case 'TOKEN_REQUEST_URL':
    case 'APIKEY_MGMT_URL':
    case 'OPERATOR_ID':
    case 'REALM':
    case 'GRANT_TYPE':
    case 'SCOPE':
    case 'CLIENT_ID':
      return process.env[`NIT__${verifiedArchitectureName}_${paramName}`];
    default:
      return undefined;
  }
};

export default getConfParam;
