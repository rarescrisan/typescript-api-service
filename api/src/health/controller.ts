import { Context } from '@jakedeichert/http-utils';
import {
    Method,
    HandlerConfig,
} from '@jakedeichert/http-utils/dist/controller';
import { response, HttpResponse } from '@jakedeichert/http-utils/dist/response';
import * as healthService from './service';

async function simpleHealthCheck(): HttpResponse {
    return response();
}

async function extensiveHealthCheck(ctx: Context): HttpResponse {
    const dbHealth = await healthService.checkDb(ctx);

    return response().json({
        db: dbHealth,
    });
}

export function endpoints(): HandlerConfig[] {
    const prefix = '/health';
    return [
        {
            method: Method.Get,
            route: prefix,
            handler: simpleHealthCheck,
        },
        {
            method: Method.Get,
            route: `${prefix}/extensive`,
            handler: extensiveHealthCheck,
        },
    ];
}
