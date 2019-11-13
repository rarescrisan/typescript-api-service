import KoaRouter from '@koa/router';
import { Context } from './index';
import { HttpResponse } from './response';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware = Promise<any>;
export type MiddlewareHandler = (ctx: Context, next: Next) => Middleware;

export type Next = () => HttpResponse;
export type Router = KoaRouter;
