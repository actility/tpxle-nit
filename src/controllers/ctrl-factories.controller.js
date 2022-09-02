import logger from '../logger.js';
import { tpxleAuthAsync } from '../middlewares/tpxle-auth.middleware.js';

export const uplinkControllerFactory = (handlerAsync) => (req, res) => {
  (async () => {
    let tpxleToken;
    try {
      tpxleToken = await tpxleAuthAsync(req);
    } catch (err) {
      logger.error(`uplinkControllerFactory() error: ${err.stack}`);
    }
    req.tpxleToken = tpxleToken;
    try {
      await handlerAsync(req);
    } catch (err) {
      logger.error(`uplinkControllerFactory() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};

export const downlinkControllerFactory = (handlerAsync) => (req, res) => {
  (async () => {
    try {
      await handlerAsync(req);
    } catch (err) {
      logger.error(`downlinkControllerFactory() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};
