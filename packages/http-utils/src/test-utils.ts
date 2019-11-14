import { Server } from 'http';
import { Next, Middleware } from './middleware';
import { createTransactionProvider } from '@/db-utils/dist/txn';
import { Context } from './index';
import { logger } from '@/logger';
import { closeConnection } from '@/db-utils/dist/client';
import supertest from 'supertest';
import { HttpServer } from './server';

type SuperTest = supertest.SuperTest<supertest.Test>;

export interface TestContext {
    ctx: Context;
}

export interface TestServer {
    api: SuperTest;
}

export function createTestContext(): TestContext {
    const newCtx = (): Context => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ctx: any = { logger };
        const txnProvider = createTransactionProvider();

        ctx.txn = async () => {
            return txnProvider();
        };

        return ctx as Context;
    };

    const testCtx = {} as TestContext;

    beforeEach(async () => {
        testCtx.ctx = newCtx();
    });

    afterEach(async () => {
        if (!testCtx.ctx) return;
        const txn = await testCtx.ctx.txn();
        if (!txn.isCompleted()) {
            await txn.rollback();
        }
    });

    return testCtx;
}

export function createTestServer(
    buildTestServer: (ctx: TestContext) => HttpServer,
    testContext?: TestContext
): TestServer {
    let server: Server;
    const testCtx = testContext || createTestContext();
    const testServer = {} as TestServer;

    const startNewServer = async (): Promise<SuperTest> => {
        server = await new Promise(resolve => {
            const listeningServer = buildTestServer(testCtx).listen(0);
            listeningServer.on('listening', () => resolve(listeningServer));
        });
        return supertest(server);
    };

    beforeAll(async () => {
        testServer.api = await startNewServer();
    });

    afterAll(async () => {
        if (!server) return;
        await new Promise(resolve => server.close(resolve));
    });

    return testServer;
}

export function testDbTxnMiddleware(
    testContext: TestContext
): (ctx: Context, next: Next) => Middleware {
    return (ctx, next) => {
        ctx.txn = testContext.ctx.txn;
        return next();
    };
}

afterAll(async () => {
    // Close any open DB connections to prevent jest from hanging
    await closeConnection();
});
