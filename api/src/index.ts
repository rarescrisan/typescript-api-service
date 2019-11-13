import { PORT, LOG_LEVEL } from './config';
import { buildServer } from './server';
import { initLogger } from '@jakedeichert/http-utils/dist/logger';

async function init(): Promise<void> {
    try {
        initLogger(LOG_LEVEL);
        buildServer().listen(PORT);
        console.log(`SERVING`, PORT);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

init();
