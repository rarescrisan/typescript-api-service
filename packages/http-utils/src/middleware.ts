import KoaRouter from '@koa/router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware = Promise<any>;

export type Next = () => Response;
export type Router = KoaRouter;
