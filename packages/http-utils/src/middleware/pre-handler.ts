import * as joi from '@hapi/joi';
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
    ctx.state.body = validate(ctx.request.body, handler.bodySchema);
}

async function validateQueryParams(
    ctx: Context,
    handler: HandlerConfig
): Promise<void> {
    if (!handler.querySchema) return;
    ctx.state.query = validate(ctx.query, handler.querySchema);
}

function validate(
    raw: KeyValueMap,
    schema: KeyValueMap<joi.Schema>
): KeyValueMap {
    const structure = joi.object().keys({
        ...schema,
    });
    const { error, value } = structure.validate(raw);
    if (error) {
        throw boom.badRequest(error.message);
    }

    return value as KeyValueMap;
}
