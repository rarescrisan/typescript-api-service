import { ContentType, ResponseBuilder } from '../response';
import { Next, Middleware } from '../middleware';
import { Context } from '../index';

export default async (ctx: Context, next: Next): Middleware => {
    const responseBuilder: ResponseBuilder = await next();

    // The error-handler middleware would have created the response instead.
    if (ctx.body && ctx.body.err) return;
    if (!responseBuilder) return;

    // Build the response structure for koa
    const { code, contentType, bodyData } = responseBuilder.build();
    ctx.status = code;

    if (!bodyData) return;

    if (contentType === ContentType.JSON) {
        ctx.body = {
            data: {
                ...bodyData,
            },
        };
        return;
    }

    ctx.body = bodyData;
};
