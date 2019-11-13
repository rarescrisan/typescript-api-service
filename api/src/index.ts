import { PORT } from './config';
import { createServer } from '@jakedeichert/http-utils/dist/server';
import * as healthController from './health/controller';
import bodyParser from '@jakedeichert/http-utils/dist/middleware/body-parser';

export function buildServer() {
    return createServer([healthController], [bodyParser(1)]);
}

async function init(): Promise<void> {
    try {
        buildServer().listen(PORT);
        console.log(`SERVING`, PORT);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

init();
