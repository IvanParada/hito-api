export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    environment: process.env.NODE_ENV ?? 'development',
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: parseInt(
      process.env.JWT_ACCESS_EXPIRES_IN ?? '900',
      10,
    ),
  },

  auth: {
    refreshTokenExpiresDays: parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? '30',
      10,
    ),
  },
});