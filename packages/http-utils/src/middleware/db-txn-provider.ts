import { Next, Middleware } from '../middleware';
import { Context } from '../index';
import { Txn, createTransactionProvider } from '@/db-utils/dist/txn';

// Create a new transaction provider for each request.
export default async (ctx: Context, next: Next): Middleware => {
    const txnProvider = createTransactionProvider();
    let doesTransactionExist = false;

    // A database transaction is lazily created on the first call to this
    // function. Once it's created, it's reused for all other database queries
    // within the lifecycle of this request.
    ctx.txn = async () => {
        doesTransactionExist = true;
        return txnProvider();
    };

    try {
        // Wait for the request logic to complete.
        const response = await next();

        // Try committing the transaction if one was created.
        await settleTransaction(ctx, doesTransactionExist, async txn => {
            await txn.commit();
        });

        return response;
    } catch (err) {
        // Try rolling back the transaction if there was any error in the request.
        await settleTransaction(ctx, doesTransactionExist, async txn => {
            await txn.rollback();
        });

        throw err;
    }
};

async function settleTransaction(
    ctx: Context,
    doesTransactionExist: boolean,
    txnCb: (txn: Txn) => Promise<void>
): Promise<void> {
    if (doesTransactionExist) {
        const txn = await ctx.txn();

        // Make sure the transaction hasn't been manually committed or
        // rolled back already.
        if (txn.isCompleted()) return;

        await txnCb(txn);
    }
}
