import * as Joi from 'joi';

export interface AppConfig {
  NODE_ENV: string;
  PORT: number;
}

export interface DatabaseConfig {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
}

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),

  // Database configuration
  DB_HOST: Joi.string().hostname().default('localhost'),
  DB_PORT: Joi.number().port().default(5432),
  DB_USER: Joi.string().min(1).required().messages({
    'string.empty': 'DB_USER cannot be empty',
    'any.required': 'DB_USER is required',
  }),
  DB_PASSWORD: Joi.string().min(1).required().messages({
    'string.empty': 'DB_PASSWORD cannot be empty',
    'any.required': 'DB_PASSWORD is required',
  }),
  DB_NAME: Joi.string().min(1).required().messages({
    'string.empty': 'DB_NAME cannot be empty',
    'any.required': 'DB_NAME is required',
  }),
});

export const config = (): Config => ({
  app: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
  },
  database: {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,
  },
});
