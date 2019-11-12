import Koa from 'koa';

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
