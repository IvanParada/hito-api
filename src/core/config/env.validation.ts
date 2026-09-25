import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number()
    .port()
    .default(3000),

  DATABASE_URL: Joi.string()
    .required(),

  REDIS_HOST: Joi.string()
    .required(),

  REDIS_PORT: Joi.number()
    .port()
    .required(),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),

  JWT_ACCESS_EXPIRES_IN: Joi.number()
    .integer()
    .positive()
    .default(900),

  REFRESH_TOKEN_EXPIRES_DAYS: Joi.number()
    .integer()
    .positive()
    .default(30),
});