import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Connected\n');
  } catch (error) {
    console.error('\n❌ PostgreSQL Connection Error:');
    console.error('Message:', error.message);
    console.error('\n⚠️  Troubleshooting:');
    console.error('1. Ensure PostgreSQL is running (docker compose up -d postgres)');
    console.error('2. Verify DATABASE_URL in backend/.env');
    console.error('3. Run: npm run db:migrate\n');
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export default prisma;
