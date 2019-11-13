import knex from 'knex';
import { logger } from '@jakedeichert/http-utils/dist/logger';

export let knexClient: knex;

export function createClient(
    dbUser: string,
    dbPass: string,
    dbHost: string,
    dbPort: number,
    dbName: string
) {
    const conn = `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
    knexClient = knex({
        client: 'pg',
        debug: false,
        connection: conn,
        acquireConnectionTimeout: 10000,
    });
}

export async function closeDbConnection(): Promise<void> {
    await knexClient.destroy();
}

export async function testDbConnection(): Promise<void> {
    try {
        await knexClient.raw('SELECT 1;');
        logger.info('Database connection established successfully');
    } catch (err) {
        logger.error('Database connection failed');
        throw err;
    }
}
