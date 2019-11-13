import Koa from 'koa';
import Router from '@koa/router';
import { Controller } from './controller';
import { Context } from './index';
import { runPreHandlerMiddleware } from './middleware/pre-handler';
import { MiddlewareHandler } from './middleware';

export function createServer(
    controllers: Controller[],
    middleware: MiddlewareHandler[]
): Koa {
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
            const handler = async (ctx: Context) => {
                await runPreHandlerMiddleware(ctx, endpoint);
                return endpoint.handler(ctx);
            };
            router[endpoint.method](endpoint.route, handler as any);
        });
    });

    app.use(router.routes());
}
