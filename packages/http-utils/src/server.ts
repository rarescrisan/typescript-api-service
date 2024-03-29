import Koa from 'koa';
import Router from '@koa/router';
import { Controller } from './controller';
import { Context } from './index';
import { runPreHandlerMiddleware } from './middleware/pre-handler';
import { MiddlewareHandler } from './middleware';
import { ResponseBuilder } from './response';

export type HttpServer = Koa;

export function createServer(
    controllers: Controller[],
    middleware: Array<MiddlewareHandler | null>
): HttpServer {
    const app = new Koa();

    // Inject all middleware
    middleware.forEach(m => m && app.use(m));

    initRoutes(app, controllers);
    return app;
}

function initRoutes(app: Koa, controllers: Controller[]): void {
    const router = new Router();

    controllers.forEach(controller => {
        controller.endpoints().forEach(endpoint => {
            const handler = async (ctx: Context): Promise<ResponseBuilder> => {
                await runPreHandlerMiddleware(ctx, endpoint);
                return endpoint.handler(ctx);
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router[endpoint.method](endpoint.route, handler as any);
        });
    });

    app.use(router.routes());
}
