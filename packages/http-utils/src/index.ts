import Koa from 'koa';
import hapiBoom from '@hapi/boom';
import { Logger } from '@jakedeichert/logger';
import { Txn } from '@jakedeichert/db-utils/dist/txn';

export interface Context extends Koa.Context {
    logger: Logger;
    txn: () => Promise<Txn>;

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
