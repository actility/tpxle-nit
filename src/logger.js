import cfg from './config.js';
import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
    levels: winston.config.npm.levels, // { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'} ),
        winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
      new winston.transports.DailyRotateFile({
        dirname: '../log',
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD_HH',
        createSymlink: true,
        symlinkName: 'current.log',
        frequency: '3h',
        maxFiles: '1d',
        level: cfg.LOG_LEVEL || 'error',
      })
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
      level: cfg.LOG_LEVEL || 'error',
    }));
}

export default logger;
