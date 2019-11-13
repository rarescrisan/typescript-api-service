import Koa from 'koa';
import Router from '@koa/router';
import { Controller } from './controller';
import { Context } from './index';
import { runPreHandlerMiddleware } from './middleware/pre-handler';

export function createServer(controllers: Controller[]): Koa {
    const app = new Koa();
    // initMiddleware(app);
    initRoutes(app, controllers);
    return app;
}

export function initRoutes(app: Koa, controllers: Controller[]): void {
    const router = new Router();

    controllers.forEach(controller => {
        controller.endpoints().forEach(endpoint => {
            router[endpoint.method](
                endpoint.route,
                async (koaCtx: Koa.Context) => {
                    const ctx = { koa: koaCtx } as Context;
                    await runPreHandlerMiddleware(ctx, endpoint);
                    return endpoint.handler(ctx);
                }
            );
        });
    });

    app.use(router.routes());
}
