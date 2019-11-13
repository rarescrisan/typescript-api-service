import { createLogger, transports, Logger } from 'winston';
import formatter from './formatter';

export let logger: Logger;

export function initLogger(logLevel: string) {
    logger = createLogger({
        level: logLevel,
        format: formatter(),
        exitOnError: false,
        transports: [new transports.Console()],
    });
    return logger;
}
