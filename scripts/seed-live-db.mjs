import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function executeWithRetry(fn, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`[Attempt ${attempt}/${maxRetries}] Database connecting/waking up... retrying in 3s`);
      if (attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

async function main() {
  console.log("🌱 Starting complete VELOCE live database seeding & sync...");

  await executeWithRetry(async () => {
    // 1. Store Settings
    await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: {
        currencySymbol: "Rs.",
        currencyCode: "PKR",
        freeShippingThreshold: 5000,
        defaultShippingFee: 250,
        announcement: "Complimentary nationwide express shipping on orders over Rs. 5,000. Use code VELOCE20 for 20% off your first purchase.",
      },
      create: {
        id: "default",
        storeName: "VELOCE",
        logo: "/logo.png",
        currencySymbol: "Rs.",
        currencyCode: "PKR",
        supportEmail: "concierge@veloce-shoes.com",
        supportPhone: "+92 (51) 835-6231",
        address: "Blue Area, Islamabad, Pakistan",
        freeShippingThreshold: 5000,
        defaultShippingFee: 250,
        announcement: "Complimentary nationwide express shipping on orders over Rs. 5,000. Use code VELOCE20 for 20% off your first purchase.",
        isMaintenanceMode: false,
      },
    });
    console.log("✅ Store settings initialized.");

    // 2. Admin User (adminveloco@gmail.com / admin123)
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { email: "adminveloco@gmail.com" },
      update: { role: "ADMIN", passwordHash: adminPasswordHash, status: "ACTIVE" },
      create: {
        name: "Marcus Vance (Admin)",
        email: "adminveloco@gmail.com",
        passwordHash: adminPasswordHash,
        role: "ADMIN",
        phone: "+92 300 1234567",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        status: "ACTIVE",
      },
    });

    const customerPasswordHash = await bcrypt.hash("Customer@123456", 10);
    await prisma.user.upsert({
      where: { email: "customer@veloce.com" },
      update: { role: "CUSTOMER", status: "ACTIVE" },
      create: {
        name: "Alexander Hayes",
        email: "customer@veloce.com",
        passwordHash: customerPasswordHash,
        role: "CUSTOMER",
        phone: "+92 300 3498120",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        status: "ACTIVE",
      },
    });
    console.log("✅ Admin and customer users initialized.");

    // 3. Categories
    const categoriesData = [
      {
        name: "Running & Marathon",
        slug: "running",
        description: "Engineered with dual-density nitrogen infused foam and carbon propulsion plates for maximum energy return.",
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
        order: 1,
      },
      {
        name: "Lifestyle & Street",
        slug: "lifestyle",
        description: "Contemporary silhouettes crafted from buttery Italian nubuck, breathable mesh, and sculptured midsoles.",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
        order: 2,
      },
      {
        name: "Basketball & Court",
        slug: "basketball",
        description: "High-top lockdown with adaptive ankle support and multi-directional herringbone herringbone traction.",
        image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80",
        order: 3,
      },
      {
        name: "Training & Gym",
        slug: "training",
        description: "Flat, stable heel platform with reinforced lateral sidewalls for heavy lifting and explosive HIIT.",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
        order: 4,
      },
      {
        name: "Luxury Runway",
        slug: "luxury",
        description: "Handcrafted Tuscan leather couture trainers blending runway aesthetics with cloud-like orthotic comfort.",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
        order: 5,
      },
    ];

    const categoryMap = new Map();
    for (const cat of categoriesData) {
      const saved = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, description: cat.description, image: cat.image, order: cat.order },
        create: cat,
      });
      categoryMap.set(cat.slug, saved.id);
    }
    console.log("✅ Categories initialized:", categoryMap.size);

    // 4. Brands
    const brandsData = [
      { name: "VELOCE Atelier", slug: "veloce-atelier", logo: "/images/veloce-logo-icon.svg", description: "Bespoke high-performance footwear." },
      { name: "Nike", slug: "nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", description: "Just Do It." },
      { name: "Adidas", slug: "adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", description: "Impossible is Nothing." },
      { name: "Jordan", slug: "jordan", logo: "https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg", description: "Flight & Heritage." },
      { name: "New Balance", slug: "new-balance", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg", description: "Fearlessly Independent." },
      { name: "Puma", slug: "puma", logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Puma_complete_logo.svg", description: "Forever Faster." },
      { name: "On Running", slug: "on-running", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/On_Running_Logo.svg", description: "CloudTec Swiss Engineering." },
    ];

    const brandMap = new Map();
    for (const b of brandsData) {
      const saved = await prisma.brand.upsert({
        where: { slug: b.slug },
        update: { name: b.name, logo: b.logo, description: b.description },
        create: b,
      });
      brandMap.set(b.slug, saved.id);
    }
    console.log("✅ Brands initialized:", brandMap.size);

    // 5. Rich Products with sizes, variants, images
    const productsData = [
      {
        name: "VELOCE Carbon Strider Pro X",
        slug: "veloce-carbon-strider-pro-x",
        description: "Our flagship marathon super-shoe. Featuring a full-length 3D spoon-shaped carbon fibre plate suspended inside dual-density supercritical nitrogen foam.",
        details: "Full carbon plate, 40mm stack height, 8mm drop, ultra-breathable Matrix weave upper, continental rubber traction.",
        price: 38500,
        salePrice: 32000,
        sku: "VEL-CSP-001",
        categorySlug: "running",
        brandSlug: "veloce-atelier",
        isFeatured: true,
        isNew: true,
        rating: 4.9,
        reviewCount: 48,
        images: [
          { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=85", isPrimary: true, order: 0 },
          { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&q=85", isPrimary: false, order: 1 },
        ],
      },
      {
        name: "AeroPulse Carbon Elite",
        slug: "aeropulse-carbon-elite",
        description: "Engineered for pure cadence and personal records. Ultra-responsive rocker geometry propels every toe-off with 87% recorded energy return.",
        details: "Single-layer monomesh, dynamic arch saddle, featherweight 178 grams.",
        price: 34000,
        salePrice: 28500,
        sku: "VEL-APC-002",
        categorySlug: "running",
        brandSlug: "nike",
        isFeatured: true,
        isNew: true,
        rating: 4.8,
        reviewCount: 36,
        images: [
          { url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000&q=85", isPrimary: true, order: 0 },
        ],
      },
      {
        name: "Atelier Tuscan Leather Luxe",
        slug: "atelier-tuscan-leather-luxe",
        description: "Handcrafted in Florence using vegetable-tanned Italian calfskin leather with memory foam insoles and stitched margom cupsole.",
        details: "100% full-grain Tuscan leather, calf leather lining, waxed cotton laces, handcrafted in Italy.",
        price: 46000,
        salePrice: 39500,
        sku: "VEL-ATL-003",
        categorySlug: "luxury",
        brandSlug: "veloce-atelier",
        isFeatured: true,
        isNew: false,
        rating: 5.0,
        reviewCount: 29,
        images: [
          { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&q=85", isPrimary: true, order: 0 },
        ],
      },
      {
        name: "Phantom Stealth Court High",
        slug: "phantom-stealth-court-high",
        description: "Tournament grade high-top basketball sneaker with dual Zoom air cushioning pods and internal TPU shank for explosive lateral stability.",
        details: "Padded collar, herringbone multidirectional grip, reinforced toe drag guard.",
        price: 29500,
        salePrice: 24900,
        sku: "VEL-PSC-004",
        categorySlug: "basketball",
        brandSlug: "jordan",
        isFeatured: true,
        isNew: true,
        rating: 4.7,
        reviewCount: 42,
        images: [
          { url: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1000&q=85", isPrimary: true, order: 0 },
        ],
      },
      {
        name: "Metrix Ultra Retro Runner 990",
        slug: "metrix-ultra-retro-runner-990",
        description: "A heritage 90s running silhouette modernized with ENCAP midsole cushioning and hairy premium pigskin suede overlays.",
        details: "Made in USA heritage aesthetic, ENCAP polyurethane rim, dual-density foam core.",
        price: 26500,
        salePrice: 22000,
        sku: "VEL-MUR-005",
        categorySlug: "lifestyle",
        brandSlug: "new-balance",
        isFeatured: true,
        isNew: false,
        rating: 4.9,
        reviewCount: 64,
        images: [
          { url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1000&q=85", isPrimary: true, order: 0 },
        ],
      },
      {
        name: "Veloce Apex Cross-Trainer V",
        slug: "veloce-apex-cross-trainer-v",
        description: "Zero-drop anatomical cross-training shoe engineered for heavy squats, Olympic lifts, and high-intensity rope climbs.",
        details: "Rope-wrap sidewalls, wide toe box, high-density rubber heel wedge, breathable mesh forefoot.",
        price: 21500,
        salePrice: 18500,
        sku: "VEL-ACT-006",
        categorySlug: "training",
        brandSlug: "veloce-atelier",
        isFeatured: true,
        isNew: true,
        rating: 4.8,
        reviewCount: 23,
        images: [
          { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&q=85", isPrimary: true, order: 0 },
        ],
      },
      {
        name: "CyberCloud Horizon Runner",
        slug: "cybercloud-horizon-runner",
        description: "Swiss engineered CloudTec elements engineered with Zero-Gravity foam for soft landings followed by powerful explosive push-offs.",
        details: "Speedboard propulsion plate, antimicrobial mesh upper, molded heel counter.",
        price: 31000,
        salePrice: 26900,
        sku: "VEL-CCH-007",
        categorySlug: "running",
        brandSlug: "on-running",
        isFeatured: true,
        isNew: false,
        rating: 4.9,
        reviewCount: 51,
        images: [
          { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&q=85", isPrimary: true, order: 0 },
        ],
      },
      {
        name: "Monochrome Low Minimalist",
        slug: "monochrome-low-minimalist",
        description: "Crisp white minimalist luxury sneaker with clean lines, gold foil serial stamping, and supple Italian nappa leather.",
        details: "Clean court profile, padded leather footbed, tonal flat waxed laces, dust bag included.",
        price: 28000,
        salePrice: 23500,
        sku: "VEL-MLM-008",
        categorySlug: "lifestyle",
        brandSlug: "veloce-atelier",
        isFeatured: true,
        isNew: false,
        rating: 4.9,
        reviewCount: 38,
        images: [
          { url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1000&q=85", isPrimary: true, order: 0 },
        ],
      }
    ];

    const standardSizes = ["39", "40", "41", "42", "43", "44", "45"];

    for (const p of productsData) {
      const categoryId = categoryMap.get(p.categorySlug);
      const brandId = brandMap.get(p.brandSlug);

      const savedProduct = await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          name: p.name,
          description: p.description,
          details: p.details,
          price: p.price,
          salePrice: p.salePrice,
          sku: p.sku,
          categoryId: categoryId || Array.from(categoryMap.values())[0],
          brandId: brandId || null,
          isFeatured: p.isFeatured,
          isNew: p.isNew,
          status: "ACTIVE",
          rating: p.rating,
          reviewCount: p.reviewCount,
        },
        create: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          details: p.details,
          price: p.price,
          salePrice: p.salePrice,
          sku: p.sku,
          categoryId: categoryId || Array.from(categoryMap.values())[0],
          brandId: brandId || null,
          isFeatured: p.isFeatured,
          isNew: p.isNew,
          status: "ACTIVE",
          rating: p.rating,
          reviewCount: p.reviewCount,
        },
      });

      // Images
      for (const img of p.images) {
        const existingImg = await prisma.productImage.findFirst({
          where: { productId: savedProduct.id, url: img.url },
        });
        if (!existingImg) {
          await prisma.productImage.create({
            data: {
              productId: savedProduct.id,
              url: img.url,
              isPrimary: img.isPrimary,
              order: img.order,
            },
          });
        }
      }

      // Sizes with stock
      for (const size of standardSizes) {
        const existingSize = await prisma.productSize.findFirst({
          where: { productId: savedProduct.id, size },
        });
        if (!existingSize) {
          await prisma.productSize.create({
            data: {
              productId: savedProduct.id,
              size,
              stock: Math.floor(Math.random() * 12 + 6),
            },
          });
        }
      }
    }
    console.log("✅ Products with sizes & images seeded successfully!");

    // 6. Hero Banners
    await prisma.heroBanner.upsert({
      where: { id: "hero-1" },
      update: {},
      create: {
        id: "hero-1",
        heading: "ENGINEERED FOR SUPREME VELOCITY",
        subtitle: "Experience carbon-infused propulsion, hyper-cadence marathon performance, and Italian leather tailoring.",
        badge: "SPRING / SUMMER 2026 ARCHIVE",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=85",
        mediaType: "image",
        ctaText: "SHOP NEW ARRIVALS",
        ctaLink: "/shop",
        order: 0,
        isActive: true,
      },
    });

    // 7. Shop Banner
    await prisma.shopBanner.upsert({
      where: { id: "default" },
      update: {
        badge: "NEW ARRIVALS • SPRING/SUMMER 2026",
        heading: "FRESH STYLES. BOLD MOVES.",
        subtitle: "Step into the new season with premium comfort and effortless style. High performance meets runway aesthetics.",
        imageUrl: "/images/shop-banner.png",
        mediaType: "image",
        ctaText: "SHOP NEW ARRIVALS",
        ctaLink: "/shop?sort=newest",
        isActive: true,
      },
      create: {
        id: "default",
        badge: "NEW ARRIVALS • SPRING/SUMMER 2026",
        heading: "FRESH STYLES. BOLD MOVES.",
        subtitle: "Step into the new season with premium comfort and effortless style. High performance meets runway aesthetics.",
        imageUrl: "/images/shop-banner.png",
        mediaType: "image",
        ctaText: "SHOP NEW ARRIVALS",
        ctaLink: "/shop?sort=newest",
        isActive: true,
      },
    });

    // 8. Coupons
    await prisma.coupon.upsert({
      where: { code: "VELOCE20" },
      update: { discountValue: 20, isActive: true },
      create: {
        code: "VELOCE20",
        description: "20% Exclusive Member Acquisition Privilege",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minOrderAmount: 0,
        maxDiscount: 10000,
        isActive: true,
        expiresAt: new Date("2028-12-31"),
      },
    });

    console.log("🎉 Complete database seeding successfully finished!");
  });

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Seeding fatal error:", err);
  process.exit(1);
});
