import pkg from '../package.json';
import {
    loadConfig,
    assertValue,
    validator,
} from '@jakedeichert/config-loader';

// In production, there's no env file since kube owns the config.
loadConfig('.env');

export enum AppEnv {
    Production = 'production',
    Staging = 'staging',
    Development = 'development',
}

//=============================================================
// ENVIRONMENT
//=============================================================
export const VERSION: string = assertValue(
    'VERSION',
    pkg.version,
    validator()
        .string()
        .required()
);

export const IS_TEST_MODE = assertValue(
    'IS_TEST_MODE',
    process.env.NODE_ENV === 'test',
    validator()
        .bool()
        .required()
);

export const APP_ENV = assertValue(
    'APP_ENV',
    process.env.APP_ENV as AppEnv,
    validator()
        .string()
        .valid(AppEnv.Development, AppEnv.Staging, AppEnv.Production)
        .required()
);

//=============================================================
// SERVER
//=============================================================
export const PORT = assertValue(
    'PORT',
    Number(process.env.PORT),
    validator()
        .number()
        .port()
        .required()
);

export const LOG_LEVEL = assertValue(
    'LOG_LEVEL',
    process.env.LOG_LEVEL as string,
    validator()
        .string()
        .valid('error', 'warn', 'info', 'verbose', 'debug', 'silly')
        .required()
);

//=============================================================
// DATABASE
//=============================================================
export const DB_USER = assertValue(
    'DB_USER',
    process.env.DB_USER as string,
    validator()
        .string()
        .required()
);

export const DB_PASS = assertValue(
    'DB_PASS',
    process.env.DB_PASS as string,
    validator()
        .string()
        .required()
);

export const DB_HOST = assertValue(
    'DB_HOST',
    process.env.DB_HOST as string,
    validator()
        .string()
        .required()
);

export const DB_PORT = assertValue(
    'DB_PORT',
    Number(process.env.DB_PORT),
    validator()
        .number()
        .port()
        .required()
);

export const DB_NAME = assertValue(
    'DB_NAME',
    process.env.DB_NAME as string,
    validator()
        .string()
        .required()
);
