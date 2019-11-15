import { logger } from '@/logger';
import { knexClient } from './client';

export async function runMigrations(): Promise<void> {
    logger.info('Running database migrations...');
    await knexClient.migrate.latest();
    logger.info('Database migrations complete!');
}
