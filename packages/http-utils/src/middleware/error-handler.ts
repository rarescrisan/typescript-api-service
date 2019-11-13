import { Next, Middleware } from '../middleware';
import { Context } from '../index';

export default (shouldLogErrors: boolean) => {
    return async (ctx: Context, next: Next): Middleware => {
        try {
            await next();
        } catch (err) {
            // Format non-500 errors
            if (err.isBoom && err.output.statusCode < 500) {
                ctx.status = err.output.statusCode;
                ctx.body = {
                    err: true,
                    msg: err.message,
                };
                if (!shouldLogErrors) return; // Possibly skip logging of errors
                ctx.logger.warn(err, getErrorMeta(err));
                ctx.app.emit('error', err, ctx);
            } else {
                ctx.status = 500;
                ctx.body = {
                    err: true,
                    msg: 'Internal Service Error',
                };
                ctx.logger.error(err.stack, getErrorMeta(err));
                ctx.app.emit('error', err, ctx);
            }
        }
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getErrorMeta(err: any): KeyValueMap {
    return (err && err.data) || {};
}
