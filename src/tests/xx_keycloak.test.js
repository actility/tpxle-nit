import dotenv from 'dotenv';

import cfg from '../config.js';
import { getAccessTokenLelabAsync } from '../services/send-to-tpxle.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

(async () => {
  const accessToken = await getAccessTokenLelabAsync(
    process.env.LELAB_CLIENT_ID,
    process.env.LELAB_CLIENT_SECRET,
    cfg.LELAB_REALM,
    process.env.DEV_EUI,
  );
  console.log(accessToken);
})();
