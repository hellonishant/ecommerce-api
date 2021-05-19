const { createLogger, format, transports } = require('winston');

const { combine, timestamp, label, printf, json, colorize } = format;

const myFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} [${label}] ${level}: ${message}`
);

const logger = createLogger({
  format: combine(label({ label: 'express-api' }), timestamp(), json()),
  transports: [
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), myFormat),
      level: 'silly',
      silent: false,
    })
  );
}

exports.logger = logger;
