import { LOG_LEVEL } from '../src/config';
import { initDb } from '../src/db';
import { initLogger } from '@jakedeichert/logger';
import { getControllers, getMiddleware } from '../src/server';
import { createServer } from '@jakedeichert/http-utils/dist/server';
import { Context } from '@jakedeichert/http-utils';
import { Next, Middleware } from '@jakedeichert/http-utils/dist/middleware';
import { TestContext } from './utils';

export function buildTestServer(testContext: TestContext) {
    const middleware = [testMiddleware(testContext), ...getMiddleware()];
    return createServer(getControllers(), middleware);
}

function testMiddleware(
    testContext: TestContext
): (ctx: Context, next: Next) => Middleware {
    return (ctx, next) => {
        ctx.txn = testContext.ctx.txn;
        return next();
    };
}

export async function initEnvironment() {
    initLogger(LOG_LEVEL);
    await initDb();
}
