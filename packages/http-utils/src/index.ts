import Koa from 'koa';
import hapiBoom from '@hapi/boom';

export interface Context extends Koa.Context {
    // logger: Logger;
    // txn: () => Promise<knex.Transaction>;
    // auth: Auth;

    // Url parameters (added by @koa/router)
    params: KeyValueMap;

    state: {
        // Validated body structure
        body: KeyValueMap;

        // Validated query parameters
        query: KeyValueMap;
    };
}

// Expose boom so clients don't have to install it
export const boom = hapiBoom;
