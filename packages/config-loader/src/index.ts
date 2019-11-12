import joi from 'joi';
import dotenv from 'dotenv';

export function loadConfig(envFilename: string) {
    dotenv.config({ path: envFilename });
}

// Return a reference to joi so the client doesn't have to install it.
export function validator() {
    return joi;
}

export function assertValue<T>(
    name: string,
    value: T,
    schema: joi.AnySchema
): T {
    const { error } = schema.validate(value);
    if (error) {
        throw new Error(
            `Config validation failure >> ${name}=${value} ${error.message}`
        );
    }
    return value;
}
