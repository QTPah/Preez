import pino from 'pino';
import fs from 'fs';
import path from 'path';

const logDir = './logs';

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: path.join(logDir, 'application.log') },
    },
    {
      target: 'pino-pretty',
      options: { destination: 1 }, // stdout
    },
  ],
});

const baseLogger = pino({
  level: 'trace',
  timestamp: pino.stdTimeFunctions.isoTime,
}, transport);

export const createLogger = (module) => baseLogger.child({ module });

export default baseLogger;
