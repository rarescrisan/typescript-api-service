import { ContentType, ResponseBuilder } from '../response';
import { Next, Middleware } from '../middleware';
import { Context } from '../index';

export default async (ctx: Context, next: Next): Middleware => {
    const responseBuilder: ResponseBuilder = await next();

    // The error-handler middleware must have created the response body already
    if ((ctx.body && ctx.body.err) || !responseBuilder) return;

    // Build the response structure for koa
    const { code, contentType, bodyData } = responseBuilder.build();
    ctx.status = code;

    if (bodyData) {
        if (contentType === ContentType.JSON) {
            ctx.body = {
                data: {
                    ...bodyData,
                },
            };
        } else {
            ctx.body = bodyData;
        }
    }
};
