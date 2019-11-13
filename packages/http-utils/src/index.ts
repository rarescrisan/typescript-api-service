import Koa from 'koa';
import hapiBoom from '@hapi/boom';

export interface Context {
    // The raw koa context
    koa: Koa.Context;

    // logger: Logger;
    // txn: () => Promise<knex.Transaction>;
    // auth: Auth;

    // Url parameters
    params: KeyValueMap;

    // Validated body structure
    body: KeyValueMap;

    // Validated query parameters
    query: KeyValueMap;
}

// Expose boom so clients don't have to install it
export const boom = hapiBoom;
