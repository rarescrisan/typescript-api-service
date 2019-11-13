import { PORT } from './config';
import { buildServer } from './server';

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
