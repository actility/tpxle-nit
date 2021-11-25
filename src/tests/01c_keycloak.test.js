import dotenv from 'dotenv';

import { getAccessTokenAsync } from '../middlewares/tpxle-auth.middleware.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

(async () => {
  const accessToken = await getAccessTokenAsync(
    process.env.LELAB_CLIENT_ID,
    process.env.LELAB_CLIENT_SECRET,
    'le-lab',
    // process.env.DEV_EUI,
  );
  console.log(accessToken);
})();
