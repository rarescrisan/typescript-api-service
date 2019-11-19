import { Next, Middleware } from '../middleware';
import { Context } from '../index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Err = any;

export default (shouldLogWarnings: boolean) => {
    return async (ctx: Context, next: Next): Middleware => {
        try {
            await next();
        } catch (err) {
            createErrorResponse(ctx, err);
            logError(ctx, ctx.status, err, shouldLogWarnings);
        }
    };
};

function createErrorResponse(ctx: Context, err: Err): void {
    const statusCode = err.isBoom ? err.output.statusCode : 500;

    ctx.status = statusCode;
    ctx.body = {
        err: true,
        msg: err.message,
    };

    if (statusCode >= 500) {
        // Don't let the client see any internal error details
        ctx.body.msg = 'Internal Service Error';
    }
}

function logError(
    ctx: Context,
    statusCode: number,
    err: Err,
    shouldLogWarnings: boolean
): void {
    const errMeta = err.data || {};

    // Possibly log a warning
    if (statusCode < 500) {
        if (!shouldLogWarnings) return;
        ctx.logger.warn(err, errMeta);
        ctx.app.emit('error', err, ctx);
        return;
    }

    // Log an error
    ctx.logger.error(err.stack, errMeta);
    ctx.app.emit('error', err, ctx);
}
