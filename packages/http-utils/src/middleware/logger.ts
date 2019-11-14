import _ from 'lodash';
import { logger } from '@/logger';
import { Next, Middleware } from '../middleware';
import { Context } from '../index';

export default async (ctx: Context, next: Next): Middleware => {
    const requestId = _.random(1000000, 9999999);
    ctx.logger = logger.child({ requestId, ctx });
    return next();
};
