import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to PostgreSQL...");
  try {
    const cols = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User' OR table_name = 'user' OR table_name = 'users';
    `);
    console.log("Current User table columns:", cols);

    console.log("Adding missing columns to User table if any...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "preferredCategories" TEXT[] DEFAULT ARRAY[]::TEXT[];`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralSource" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isOnboarded" BOOLEAN DEFAULT FALSE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "orderNotifs" BOOLEAN DEFAULT TRUE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dealNotifs" BOOLEAN DEFAULT TRUE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "promoEmails" BOOLEAN DEFAULT TRUE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'ACTIVE';`);

    console.log("Adding missing columns to other tables if any...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "StoreSettings" ADD COLUMN IF NOT EXISTS "isMaintenanceMode" BOOLEAN DEFAULT FALSE;`);
    
    console.log("Checking User table columns after update:");
    const updatedCols = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User';
    `);
    console.log("Updated columns:", updatedCols.map(c => c.column_name));
    console.log("✅ Database schema successfully verified and patched!");
  } catch (err) {
    console.error("Error executing schema patch:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
