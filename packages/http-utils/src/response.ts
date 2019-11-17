export type HttpResponse = Promise<ResponseBuilder>;

export enum ContentType {
    JSON = 'application/json',
    Plain = 'text/plain',
}

export interface ResponseBuilder {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: (bodyData: any) => ResponseBuilder;
    text: (msg: string) => ResponseBuilder;
    build: () => ResponseBuilderContext;
}

interface ResponseBuilderContext {
    code: number;
    contentType: ContentType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bodyData: any;
}

// Helps build responses rather than mutating Koa ctx directly.
// The response-structure middleware finalizes the response based
// on this ResponseBuilderContext
export function response(code = 200): ResponseBuilder {
    const ctx: ResponseBuilderContext = {
        code,
        contentType: ContentType.JSON, // by default
        bodyData: null,
    };

    const self: ResponseBuilder = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        json(bodyData: any): ResponseBuilder {
            ctx.bodyData = bodyData;
            ctx.contentType = ContentType.JSON;
            return self;
        },
        text(msg: string): ResponseBuilder {
            ctx.bodyData = msg;
            ctx.contentType = ContentType.Plain;
            return self;
        },
        build() {
            return ctx;
        },
    };

    return self;
}
