import { createServer } from '@jakedeichert/http-utils/dist/server';
import * as healthController from './health/controller';
import logger from '@jakedeichert/http-utils/dist/middleware/logger';
import errorHandler from '@jakedeichert/http-utils/dist/middleware/error-handler';
import bodyParser from '@jakedeichert/http-utils/dist/middleware/body-parser';
import responseBuilder from '@jakedeichert/http-utils/dist/middleware/response-builder';
import dbTxnProvider from '@jakedeichert/http-utils/dist/middleware/db-txn-provider';
import { IS_TEST_MODE } from './config';

export function buildServer() {
    const controllers = [healthController];

    const middleware = [
        logger,
        errorHandler(!IS_TEST_MODE),
        bodyParser(1),
        responseBuilder,
        IS_TEST_MODE ? null : dbTxnProvider,
    ];

    return createServer(controllers, middleware);
}
