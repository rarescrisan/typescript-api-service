import { logger } from '@jakedeichert/http-utils/dist/logger';
import { knexClient } from './client';

export async function runMigrations(): Promise<void> {
    logger.info('Running migrations...');
    await knexClient.migrate.latest();
    logger.info('Migrations complete!');
}
