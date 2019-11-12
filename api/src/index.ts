import { PORT } from './config';

async function init(): Promise<void> {
    try {
        console.log(`SERVING`, PORT);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

init();
