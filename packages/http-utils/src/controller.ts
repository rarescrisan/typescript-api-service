import joi from '@hapi/joi';
import { Context } from './index';
import { HttpResponse } from './response';

export enum Method {
    Get = 'get',
    Post = 'post',
    Put = 'put',
    Patch = 'patch',
    Del = 'del',
}

export interface Controller {
    endpoints(): HandlerConfig[];
}

export interface HandlerConfig {
    method: Method;
    route: string;
    handler: (ctx: Context) => HttpResponse;
    querySchema?: KeyValueMap<joi.Schema>;
    bodySchema?: KeyValueMap<joi.Schema>;
}
