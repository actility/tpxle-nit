import logger from '../logger.js';
import { tpxleAuthMiddlewareAsync } from '../middlewares/tpxle-auth.middleware.js';

export const uplinkControllerFactory = (handlerAsync) => async (req, res) => {
  (async () => {
    try {
      await tpxleAuthMiddlewareAsync(req); // Adds tpxleToken and userId to req
    } catch (err) {
      logger.error(`uplinkControllerFactory() error: ${err.stack}`);
    }
    try {
      await handlerAsync(req);
    } catch (err) {
      logger.error(`uplinkControllerFactory() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};

export const downlinkControllerFactory = (handlerAsync) => async (req, res) => {
  (async () => {
    try {
      await handlerAsync(req);
    } catch (err) {
      logger.error(`downlinkControllerFactory() error: ${err.stack}`);
    }
  })();
  res.status(200).send('This is an async response. See details in server logs.');
};
