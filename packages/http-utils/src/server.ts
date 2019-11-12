import Koa from 'koa';
import Router from '@koa/router';

export function createServer(): Koa {
    const app = new Koa();
    // initMiddleware(app);
    initRoutes(app);

    return app;
}


export function initRoutes(app: Koa): void {
    const router = new Router();

    app.use(router.routes());
}
