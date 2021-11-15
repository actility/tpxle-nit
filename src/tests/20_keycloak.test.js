import dotenv from 'dotenv';

import { getAccessTokenKeycloakAsync } from '../services/send-to-tpxle.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

(async () => {
  const accessToken = await getAccessTokenKeycloakAsync(
    process.env.LELAB_CLIENT_ID,
    process.env.LELAB_CLIENT_SECRET,
    'le-lab',
    process.env.DEV_EUI,
  );
  console.log(accessToken);
})();
