export const env = {
  PORT: Number(process.env.PORT) || 4000,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  BASE_URL: process.env.BASE_URL || "http://localhost:4000",
  APP_URL: process.env.APP_URL || "http://localhost:5173",
};
