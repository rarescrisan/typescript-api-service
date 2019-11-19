import _ from 'lodash';
import { logger } from '@/logger';
import { Next, Middleware } from '../middleware';
import { Context } from '../index';

export default async (ctx: Context, next: Next): Middleware => {
    // Attach a random id to every log in the lifecycle of a request.
    // This allows us to easily see which logs are related.
    const reqId = _.random(1000000, 9999999);
    ctx.logger = logger.child({ reqId, ctx });
    return next();
};
