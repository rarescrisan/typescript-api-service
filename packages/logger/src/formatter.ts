import { inspect } from 'util';
import { format } from 'winston';

export default () => {
    return format.combine(format.colorize(), format.timestamp(), formatter);
};

const formatter = format.printf(
    ({ level, message, timestamp, requestId, ctx, ...other }) => {
        const meta = collectRequestMeta(other);

        if (ctx) {
            const requestUrl = ctx.request.url;
            const responseCode = ctx.status;

            if (responseCode && ctx.body) {
                return `${timestamp} [${level}] (id ${requestId} :: ${requestUrl} :: ${responseCode}) >> ${message} ${meta}`;
            }

            return `${timestamp} [${level}] (id ${requestId} :: ${requestUrl}) >> ${message} ${meta}`;
        }

        return `${timestamp} [${level}] >> ${message} ${meta}`;
    }
);

function collectRequestMeta(meta: KeyValueMap): string {
    if (!Object.keys(meta).length) {
        return '';
    }

    let requestMeta;
    try {
        requestMeta = JSON.stringify(meta);
    } catch (err) {
        // Likely failed because of circular references
        requestMeta = inspect(meta, { depth: 3 });
    }

    return requestMeta ? `|| ${requestMeta}` : '';
}
