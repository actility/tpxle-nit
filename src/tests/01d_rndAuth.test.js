import dotenv from 'dotenv';

import { getAccessTokenAsync } from '../middlewares/tpxle-auth.middleware.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

(async () => {
  const accessToken = await getAccessTokenAsync(
    process.env.DEV1_CLIENT_ID,
    process.env.DEV1_CLIENT_SECRET,
    'rnd',
    // process.env.DEV_EUI,
  );
  console.log(accessToken);
})();
