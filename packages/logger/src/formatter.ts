import { format } from 'winston';

const formatter = format.printf(({ level, message, timestamp, reqId, ctx }) => {
    if (!ctx) return `${timestamp} [${level}] >> ${message}`;

    const reqUrl = ctx.request.url;
    const respCode = ctx.status;

    if (respCode && ctx.body) {
        return `${timestamp} [${level}] (id ${reqId} :: ${reqUrl} :: ${respCode}) >> ${message}`;
    }

    return `${timestamp} [${level}] (id ${reqId} :: ${reqUrl}) >> ${message}`;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (): any => {
    return format.combine(format.colorize(), format.timestamp(), formatter);
};
