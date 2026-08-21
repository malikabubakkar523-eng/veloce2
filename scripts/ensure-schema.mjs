import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function executeWithRetry(fn, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`[Attempt ${attempt}/${maxRetries}] Database waking up... retrying in 3s`);
      if (attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

async function main() {
  console.log("Connecting to PostgreSQL...");
  try {
    await executeWithRetry(async () => {
      const cols = await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'User' OR table_name = 'user' OR table_name = 'users';
      `);
      console.log("Current User table columns count:", cols.length);
    });

    console.log("Adding missing columns to User table if any...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "preferredCategories" TEXT[] DEFAULT ARRAY[]::TEXT[];`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referralSource" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isOnboarded" BOOLEAN DEFAULT FALSE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "orderNotifs" BOOLEAN DEFAULT TRUE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dealNotifs" BOOLEAN DEFAULT TRUE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "promoEmails" BOOLEAN DEFAULT TRUE;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'ACTIVE';`);

    console.log("Ensuring HomeVideo table exists...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "HomeVideo" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "subtitle" TEXT,
        "badge" TEXT DEFAULT 'CINEMATIC FOOTWEAR ATELIER',
        "videoUrl" TEXT NOT NULL,
        "posterUrl" TEXT,
        "ctaText" TEXT DEFAULT 'EXPLORE COLLECTION',
        "ctaLink" TEXT DEFAULT '/shop',
        "secondaryCtaText" TEXT DEFAULT 'View In Lookbook',
        "secondaryCtaLink" TEXT DEFAULT '/gallery',
        "specs" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "HomeVideo_isActive_order_idx" ON "HomeVideo"("isActive", "order");`);

    console.log("Checking HomeVideo row count...");
    const videoCount = await prisma.homeVideo.count();
    console.log("Current HomeVideo count:", videoCount);
    if (videoCount === 0) {
      await prisma.homeVideo.create({
        data: {
          title: "ENGINEERED TO OUTPACE GRAVITY.",
          subtitle: "Every curve, seam, and carbon fibre strand is optimized inside our high-velocity biomechanical test chambers. Experience uninterrupted forward thrust.",
          badge: "PROPULSION IN MOTION",
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-athlete-getting-ready-to-run-on-the-track-42525-large.mp4",
          posterUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&q=85",
          ctaText: "EXPLORE MARATHON RACERS",
          ctaLink: "/shop?category=running",
          secondaryCtaText: "View Full Lookbook",
          secondaryCtaLink: "/gallery",
          order: 0,
          isActive: true,
        },
      });
      console.log("Seeded default HomeVideo entry.");
    }
  } catch (err) {
    console.error("Error executing schema patch:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
