import { LOG_LEVEL } from '../src/config';
import { initDb } from '../src/db';
import { initLogger } from '@jakedeichert/logger';

export async function initSystems() {
    initLogger(LOG_LEVEL);
    await initDb();
}