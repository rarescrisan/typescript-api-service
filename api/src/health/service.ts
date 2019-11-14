import { Context } from '@jakedeichert/http-utils';
import * as healthRepo from './repo';

interface DbHealth {
    healthy: boolean;
}

export async function checkDb(ctx: Context): Promise<DbHealth> {
    const healthy = await healthRepo.canConnect(ctx);
    return {
        healthy,
    };
}
