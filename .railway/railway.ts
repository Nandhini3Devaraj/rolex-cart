// Railway Configuration
export const project = {
  name: "rolex-cart",
  services: [
    {
      name: "backend",
      source: ".",
      buildCommand: "npm install && npx prisma generate --schema=backend/prisma/schema.prisma",
      startCommand: "node backend/server.js",
      variables: {
        PORT: "5000",
        NODE_ENV: "production",
        JWT_SECRET: "your_super_secret_jwt_key_change_in_production_12345",
        JWT_EXPIRE: "7d",
        APP_NAME: "RoleX Cart",
        APP_VERSION: "1.0.0"
      }
    }
  ]
};