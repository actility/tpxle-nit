import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';

dotenv.config({ path: '../config/.env' });

const loadConfig = (configFile) => {
  let config;
  try {
    config = yaml.load(fs.readFileSync(configFile, 'utf8'));
  } catch (err) {
    console.error(`CONFIG FILE error: \n${err.stack}`);
    process.exit(1);
  }
  return config;
};

const globalConfig = loadConfig('../config/config.global.yml');
let selectedConfig;
switch (process.env.NODE_ENV) {
  case 'production':
    selectedConfig = loadConfig('../config/config.production.yml');
    break;
  case 'development':
    selectedConfig = loadConfig('../config/config.development.yml');
    break;
  case 'test':
    selectedConfig = loadConfig('../config/config.test.yml');
    break;
  default:
    selectedConfig = loadConfig('../config/config.development.yml');
}

const config = { ...globalConfig, ...selectedConfig };

if (process.env.FILTER) {
  config.FILTER = process.env.FILTER === 'true';
}
if (process.env.LOG_LEVEL) {
  config.LOG_LEVEL = process.env.LOG_LEVEL;
}

export default Object.freeze(config);
