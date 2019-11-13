import { createServer } from '@jakedeichert/http-utils/dist/server';
import * as healthController from './health/controller';
import bodyParser from '@jakedeichert/http-utils/dist/middleware/body-parser';
import responseBuilder from '@jakedeichert/http-utils/dist/middleware/response-builder';

export function buildServer() {
    const controllers = [healthController];

    const middleware = [bodyParser(1), responseBuilder];

    return createServer(controllers, middleware);
}
