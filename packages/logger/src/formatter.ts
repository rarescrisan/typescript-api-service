import { format } from 'winston';

export default () => {
    return format.combine(format.colorize(), format.timestamp(), formatter);
};

const formatter = format.printf(
    ({ level, message, timestamp, requestId, ctx }) => {
        if (ctx) {
            const reqUrl = ctx.request.url;
            const respCode = ctx.status;

            if (respCode && ctx.body) {
                return `${timestamp} [${level}] (id ${requestId} :: ${reqUrl} :: ${respCode}) >> ${message}`;
            }

            return `${timestamp} [${level}] (id ${requestId} :: ${reqUrl}) >> ${message}`;
        }

        return `${timestamp} [${level}] >> ${message}`;
    }
);
