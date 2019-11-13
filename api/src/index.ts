import { PORT, LOG_LEVEL } from './config';
import { buildServer } from './server';
import { initLogger, logger } from '@jakedeichert/logger';

async function init(): Promise<void> {
    try {
        initLogger(LOG_LEVEL);
        buildServer().listen(PORT);
        logger.info(`Service running on port ${PORT}`);
    } catch (err) {
        logger.error('Failed to start the service');
        console.error(err);
        process.exit(1);
    }
}

init();
