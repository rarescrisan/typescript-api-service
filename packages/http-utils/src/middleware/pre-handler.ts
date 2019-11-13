import joi from 'joi';
import { Context, boom } from '../index';
import { HandlerConfig } from '../controller';

// Middleware that runs before the handler is executed.
export async function runPreHandlerMiddleware(
    ctx: Context,
    handler: HandlerConfig
): Promise<void> {
    await validateRequestBody(ctx, handler);
    await validateQueryParams(ctx, handler);
}

async function validateRequestBody(
    ctx: Context,
    handler: HandlerConfig
): Promise<void> {
    if (!handler.bodySchema) return;
    ctx.body = validate(ctx.koa.request.body, handler.bodySchema);
}

async function validateQueryParams(
    ctx: Context,
    handler: HandlerConfig
): Promise<void> {
    if (!handler.querySchema) return;
    ctx.query = validate(ctx.koa.query, handler.querySchema);
}

function validate(
    raw: KeyValueMap,
    schema: KeyValueMap<joi.Schema>
): KeyValueMap {
    const { error, value } = joi.validate(
        raw,
        joi.object().keys({
            ...schema,
        })
    );
    if (error) {
        throw boom.badRequest(error.message);
    }

    return value as KeyValueMap;
}
