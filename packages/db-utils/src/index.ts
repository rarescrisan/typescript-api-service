import { QueryResult } from 'pg';
import { Txn } from './txn';

interface Context {
    txn(): Promise<Txn>;
}

export async function query(
    ctx: Context,
    sql: string,
    replacements: KeyValueMap = {}
): Promise<QueryResult> {
    // Lazily creates a transaction unless one already exists
    const txn = await ctx.txn();
    const results = await txn.raw(sql, replacements);
    return results as QueryResult;
}
