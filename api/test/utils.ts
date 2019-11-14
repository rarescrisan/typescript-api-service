import { Server } from 'http';
import { buildTestServer } from './server';
import { initEnvironment } from './server';
import { createTransactionProvider } from '@jakedeichert/db-utils/dist/txn';
import { closeConnection } from '@jakedeichert/db-utils/dist/client';
import { Context } from '@jakedeichert/http-utils';
import { logger } from '@jakedeichert/logger';
import supertest from 'supertest';

type SuperTest = supertest.SuperTest<supertest.Test>;

export interface TestContext {
    ctx: Context;
}

export interface TestServer {
    api: SuperTest;
}

beforeAll(async () => {
    await initEnvironment();
});

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

export function createTestServer(testContext?: TestContext): TestServer {
    let server: Server;
    const testCtx = testContext || createTestContext();
    const testServer = {
        api: (null as unknown) as SuperTest,
    };

    const startNewServer = async (): Promise<SuperTest> => {
        server = await new Promise(resolve => {
            const listeningServer = buildTestServer(testCtx).listen(0);
            listeningServer.on('listening', () => resolve(listeningServer));
        });

        const testApiHandle = supertest(server);

        return testApiHandle;
    };

    beforeAll(async () => {
        testServer.api = await startNewServer();
    });

    afterAll(async () => {
        if (!server) return;
        await new Promise(resolve => {
            server.close(resolve);
        });
    });

    return testServer as TestServer;
}

afterAll(async () => {
    // Close any open DB connections to prevent jest from hanging
    await closeConnection();
});
