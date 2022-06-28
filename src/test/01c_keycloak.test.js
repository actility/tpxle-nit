import '../config.js';
import './test_config.js';

import { getAccessTokenAsync } from '../middlewares/tpxle-auth.middleware.js';

(async () => {
  const accessToken = await getAccessTokenAsync(
    process.env.TEST__LELAB_TEST__CLIENT_ID,
    process.env.TEST__LELAB_CLIENT_SECRET,
    'le-lab',
    // process.env.TEST__DEV_EUI,
  );
  console.log(accessToken);
})();
