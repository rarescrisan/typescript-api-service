import { PORT } from './config';
import { createServer } from '@jakedeichert/http-utils/dist/server';
import * as healthController from './health/controller';

async function init(): Promise<void> {
    try {
        const server = createServer([healthController]);
        server.listen(PORT);
        console.log(`SERVING`, PORT);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

init();
