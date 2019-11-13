import knex from 'knex';
import { knexClient } from './client';

export type Txn = knex.Transaction;

// Returns a provider that lazily creates a reusable transaction on the first call.
export function createTransactionProvider(): () => Promise<knex.Transaction> {
    return knexClient.transactionProvider();
}
