import dotenv from 'dotenv';

dotenv.config({ path: new URL('./config/.env', import.meta.url) });
dotenv.config({ path: new URL('./config/config.env', import.meta.url) });
