import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating videos in database...");

  // 1. Upper Hero Video
  const heroVidUrl = "https://flow-content.google/video/81f46eb0-cea5-47ab-8f7f-c34123c49f40?Expires=1787335594&KeyName=labs-flow-prod-cdn-key&Signature=q3atGIo_cTIsaxdY-dxeLXzowvk";
  
  await prisma.heroBanner.upsert({
    where: { id: "hero-1" },
    update: {
      videoUrl: heroVidUrl,
      mediaType: "video",
      isActive: true,
    },
    create: {
      id: "hero-1",
      heading: "ENGINEERED FOR SUPREME VELOCITY",
      subtitle: "Experience carbon-infused propulsion, hyper-cadence marathon performance, and Italian leather tailoring.",
      badge: "SPRING / SUMMER 2026 ARCHIVE",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=85",
      videoUrl: heroVidUrl,
      mediaType: "video",
      ctaText: "SHOP THE COLLECTION",
      ctaLink: "/shop",
      order: 0,
      isActive: true,
    },
  });
  console.log("✅ Hero Banner updated with new upper video.");

  // 2. Cinematic Home Video
  const cinematicVidUrl = "https://flow-content.google/video/80539032-ba2a-45cf-9626-801998cdd22c?Expires=1787332291&KeyName=labs-flow-prod-cdn-key&Signature=0Els_0ql5uQDd6yMxyIzhWRMiBQ";
  
  const existingHomeVid = await prisma.homeVideo.findFirst();
  if (existingHomeVid) {
    await prisma.homeVideo.update({
      where: { id: existingHomeVid.id },
      data: {
        videoUrl: cinematicVidUrl,
        isActive: true,
      },
    });
  } else {
    await prisma.homeVideo.create({
      data: {
        id: "home-vid-1",
        title: "ENGINEERED TO OUTPACE GRAVITY.",
        subtitle: "Every curve, seam, and carbon fibre strand is optimized inside our high-velocity biomechanical test chambers. Experience uninterrupted forward thrust.",
        badge: "PROPULSION IN MOTION",
        videoUrl: cinematicVidUrl,
        posterUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&q=85",
        ctaText: "EXPLORE MARATHON RACERS",
        ctaLink: "/shop?category=running",
        secondaryCtaText: "View Full Lookbook",
        secondaryCtaLink: "/gallery",
        order: 0,
        isActive: true,
      },
    });
  }
  console.log("✅ Cinematic Home Video updated with new video.");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Error updating videos:", err);
  process.exit(1);
});
