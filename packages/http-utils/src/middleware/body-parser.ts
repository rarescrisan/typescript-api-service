import koaBodyParser from 'koa-bodyparser';
import { MiddlewareHandler } from '../middleware';

export default (requestBodyMbLimit: number): MiddlewareHandler => {
    return koaBodyParser({
        jsonLimit: `${requestBodyMbLimit}mb`,
    });
};
