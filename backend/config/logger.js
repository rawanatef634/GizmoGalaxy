import { transports, createLogger, format } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';

const transport = new winstonDailyRotateFile({
  filename: 'logs/%DATE%-results.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console({ format: format.simple() }),
    transport
  ],
});

export default logger;
