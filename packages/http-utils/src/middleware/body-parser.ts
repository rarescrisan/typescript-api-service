import koaBodyParser from 'koa-bodyparser';

export default (requestBodyMbLimit: number) => {
    return koaBodyParser({
        jsonLimit: `${requestBodyMbLimit}mb`,
    });
};
