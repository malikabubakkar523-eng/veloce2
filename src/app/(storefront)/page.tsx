import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { HeroBannerSlider } from "@/components/storefront/HeroBannerSlider";
import { ProductCard } from "@/components/storefront/ProductCard";
import { DealsCountdown } from "@/components/storefront/DealsCountdown";
import { HomeGalleryShowcase } from "@/components/storefront/HomeGalleryShowcase";
import { CinematicFootwearShowcase } from "@/components/storefront/CinematicFootwearShowcase";
import { AIRecommendedSection } from "@/components/storefront/AIRecommendedSection";
import { AINewDropsMatchingSection } from "@/components/storefront/AINewDropsMatchingSection";
import { CURATED_GALLERY_ITEMS } from "@/lib/galleryData";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  ChevronRight,
  Flame,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CURATED_DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "Running & Marathon", slug: "running", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80", _count: { products: 12 } },
  { id: "cat-2", name: "Lifestyle & Street", slug: "lifestyle", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", _count: { products: 18 } },
  { id: "cat-3", name: "Basketball & Court", slug: "basketball", image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80", _count: { products: 8 } },
  { id: "cat-4", name: "Training & Gym", slug: "training", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80", _count: { products: 10 } },
  { id: "cat-5", name: "Luxury Runway", slug: "luxury", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80", _count: { products: 6 } },
];

const CURATED_DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "VELOCE Carbon Strider Pro X",
    slug: "veloce-carbon-strider-pro-x",
    description: "Our flagship marathon super-shoe with full-length 3D carbon propulsion plate.",
    price: 38500,
    salePrice: 32000,
    rating: 4.9,
    reviewCount: 48,
    isFeatured: true,
    isNew: true,
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=85", isPrimary: true }],
    category: { name: "Running", slug: "running" },
    brand: { name: "VELOCE Atelier" },
    sizes: [{ size: "40", stock: 10 }, { size: "41", stock: 8 }, { size: "42", stock: 12 }],
  },
  {
    id: "prod-2",
    name: "AeroPulse Carbon Elite",
    slug: "aeropulse-carbon-elite",
    description: "Engineered for pure cadence and personal records with 87% energy return.",
    price: 34000,
    salePrice: 28500,
    rating: 4.8,
    reviewCount: 36,
    isFeatured: true,
    isNew: true,
    images: [{ url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000&q=85", isPrimary: true }],
    category: { name: "Running", slug: "running" },
    brand: { name: "Nike" },
    sizes: [{ size: "41", stock: 6 }, { size: "42", stock: 10 }, { size: "43", stock: 5 }],
  },
  {
    id: "prod-3",
    name: "Atelier Tuscan Leather Luxe",
    slug: "atelier-tuscan-leather-luxe",
    description: "Handcrafted in Florence using vegetable-tanned Italian calfskin leather.",
    price: 46000,
    salePrice: 39500,
    rating: 5.0,
    reviewCount: 29,
    isFeatured: true,
    isNew: false,
    images: [{ url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&q=85", isPrimary: true }],
    category: { name: "Luxury", slug: "luxury" },
    brand: { name: "VELOCE Atelier" },
    sizes: [{ size: "40", stock: 5 }, { size: "41", stock: 8 }, { size: "42", stock: 6 }],
  },
  {
    id: "prod-4",
    name: "Phantom Stealth Court High",
    slug: "phantom-stealth-court-high",
    description: "Tournament grade high-top basketball sneaker with dual Zoom cushioning.",
    price: 29500,
    salePrice: 24900,
    rating: 4.7,
    reviewCount: 42,
    isFeatured: true,
    isNew: true,
    images: [{ url: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1000&q=85", isPrimary: true }],
    category: { name: "Basketball", slug: "basketball" },
    brand: { name: "Jordan" },
    sizes: [{ size: "42", stock: 7 }, { size: "43", stock: 9 }, { size: "44", stock: 4 }],
  },
  {
    id: "prod-5",
    name: "Metrix Ultra Retro Runner 990",
    slug: "metrix-ultra-retro-runner-990",
    description: "Heritage 90s running silhouette modernized with ENCAP cushioning.",
    price: 26500,
    salePrice: 22000,
    rating: 4.9,
    reviewCount: 64,
    isFeatured: true,
    isNew: false,
    images: [{ url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1000&q=85", isPrimary: true }],
    category: { name: "Lifestyle", slug: "lifestyle" },
    brand: { name: "New Balance" },
    sizes: [{ size: "41", stock: 8 }, { size: "42", stock: 12 }, { size: "43", stock: 6 }],
  },
  {
    id: "prod-6",
    name: "CyberCloud Horizon Runner",
    slug: "cybercloud-horizon-runner",
    description: "Swiss engineered CloudTec elements for explosive push-offs.",
    price: 31000,
    salePrice: 26900,
    rating: 4.9,
    reviewCount: 51,
    isFeatured: true,
    isNew: false,
    images: [{ url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&q=85", isPrimary: true }],
    category: { name: "Running", slug: "running" },
    brand: { name: "On Running" },
    sizes: [{ size: "40", stock: 6 }, { size: "41", stock: 9 }, { size: "42", stock: 11 }],
  },
];

export default async function HomePage() {
  let heroBanners: any[] = [];
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];
  let activeDeal: any = null;
  let saleProducts: any[] = [];
  let galleryItems: any[] = [];
  let homeVideo: any = null;

  try {
    const data = await Promise.all([
      // Active Hero Banners
      db.heroBanner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      // Categories with product counts
      db.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      // Featured products
      db.product.findMany({
        where: { isFeatured: true, status: "ACTIVE" },
        take: 8,
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
          brand: true,
          sizes: true,
        },
      }),
      // New arrivals
      db.product.findMany({
        where: { isNew: true, status: "ACTIVE" },
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
          brand: true,
          sizes: true,
        },
      }),
      // Active flash deal
      db.deal.findFirst({
        where: { isActive: true, endDate: { gt: new Date() } },
        orderBy: { createdAt: "desc" },
      }),
      // Sale products for deal section
      db.product.findMany({
        where: { salePrice: { not: null, gt: 0 }, status: "ACTIVE" },
        take: 4,
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
          brand: true,
          sizes: true,
        },
      }),
      // Lookbook Gallery items
      db.galleryItem.findMany({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      // Active Homepage Video Showcase
      db.homeVideo.findFirst({
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
    ]);

    heroBanners = data[0] || [];
    categories = data[1] && data[1].length > 0 ? data[1] : CURATED_DEFAULT_CATEGORIES;
    featuredProducts = data[2] && data[2].length > 0 ? data[2] : CURATED_DEFAULT_PRODUCTS;
    newArrivals = data[3] && data[3].length > 0 ? data[3] : CURATED_DEFAULT_PRODUCTS;
    activeDeal = data[4];
    saleProducts = data[5] && data[5].length > 0 ? data[5] : CURATED_DEFAULT_PRODUCTS.slice(0, 4);
    galleryItems = data[6] && data[6].length > 0 ? data[6] : CURATED_GALLERY_ITEMS;
    homeVideo = data[7] || null;
  } catch (error) {
    console.warn("⚠️ [Prerender Notice] Database query fallback triggered:", error);
    categories = CURATED_DEFAULT_CATEGORIES;
    featuredProducts = CURATED_DEFAULT_PRODUCTS;
    newArrivals = CURATED_DEFAULT_PRODUCTS;
    galleryItems = CURATED_GALLERY_ITEMS;
  }

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 overflow-hidden">
      {/* 1. HERO SECTION (Database-Driven Dynamic Luxury Slider / Interactive Ambient Visuals) */}
      <HeroBannerSlider slides={heroBanners} />

      {/* 2. SHOP BY CATEGORY SECTION (Mobile Horizontal Scrollable Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-500 uppercase tracking-widest mb-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>CURATED SILHOUETTES</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-display font-black text-zinc-900 dark:text-white tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 group whitespace-nowrap"
          >
            <span>View all footwear</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories container (Compact cards on mobile) */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 gap-3 sm:gap-6 snap-x snap-mandatory scrollbar-none no-scrollbar touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative flex-none w-[130px] xs:w-[145px] sm:w-auto flex flex-col rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 aspect-[3/4] p-3 sm:p-4 justify-between transition-all duration-300 hover:shadow-xl hover:border-zinc-400 dark:hover:border-zinc-600 hover:-translate-y-1 snap-start"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 145px, 20vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 dark:opacity-40"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

              <div className="relative z-10 self-end">
                <span className="text-[9px] sm:text-[10px] font-bold font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-zinc-900/80 backdrop-blur-md text-zinc-300 border border-zinc-700">
                  {cat._count?.products ?? 10}+ Pairs
                </span>
              </div>

              <div className="relative z-10 space-y-0.5">
                <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0">
                  <span>Explore</span>
                  <ArrowRight className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-brand-500" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CINEMATIC FOOTWEAR SHOWCASE SECTION (Admin-Managed Dynamic Video Player) */}
      <CinematicFootwearShowcase video={homeVideo} />

      {/* 4. FEATURED SHOES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-500 uppercase tracking-widest mb-1.5">
              <Flame className="w-3.5 h-3.5 text-brand-500" />
              <span>HANDPICKED EXCELLENCE</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-display font-black text-zinc-900 dark:text-white tracking-tight">
              Featured Shoes
            </h2>
          </div>
          <Link
            href="/shop?featured=true"
            className="text-xs font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 group"
          >
            <span>Browse all featured</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. AI-POWERED PERSONALIZATION ENGINE: RECOMMENDED FOR YOU */}
      <AIRecommendedSection />

      {/* 6. DYNAMIC DEALS SECTION (With Live Countdown & Integrated Background Shoe) */}
      {activeDeal && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden p-6 sm:p-12 lg:p-16">
            {/* Background glowing gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider border border-brand-500/30">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{activeDeal.badge || "LIMITED FLASH PROMOTION"}</span>
                </div>

                <h2 className="text-2xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
                  UP TO {activeDeal.discountPercent}% OFF. <br />
                  <span className="text-zinc-400">RACE-READY ARCHIVE.</span>
                </h2>

                <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
                  {activeDeal.subtitle ||
                    "Limited-time discount on top-tier marathon racers and bespoke leather silhouettes. Automatically applied at checkout."}
                </p>

                {/* Real-time Dynamic Countdown */}
                <div className="pt-1 sm:pt-2">
                  <DealsCountdown targetDate={activeDeal.endDate} />
                </div>

                <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href="/shop?deal=true"
                    className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/20 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <span>CLAIM PROMOTION</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-xs text-zinc-400">Code: <strong className="text-white font-mono">VELOCE20</strong></span>
                </div>
              </div>

              {/* Deal showcase shoes */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
                {saleProducts.slice(0, 2).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. EDITORIAL PROMOTIONAL BANNER 2: TUSCAN HERITAGE & ATELIER (Shoe as Background Visual) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-14 lg:p-16 text-white shadow-2xl min-h-[380px] sm:min-h-[420px] flex items-center">
          {/* Amber Ambient Glow */}
          <div className="absolute right-[5%] sm:right-[15%] top-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Background Boot Visual (No Box, No Card Frame, Seamless Blend) */}
          <div className="absolute -right-6 sm:-right-4 md:right-4 lg:right-10 top-1/2 -translate-y-1/2 w-[260px] xs:w-[320px] sm:w-[500px] md:w-[600px] lg:w-[680px] h-[190px] xs:h-[240px] sm:h-[380px] md:h-[460px] lg:h-[520px] pointer-events-none select-none z-0 opacity-40 sm:opacity-85 lg:opacity-95 filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)]">
            <Image
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85"
              alt="Handcrafted Tuscan Heritage Silhouette"
              fill
              sizes="(max-width: 768px) 320px, 680px"
              className="object-contain transform -rotate-6 hover:rotate-0 transition-transform duration-700"
            />
          </div>

          {/* Vignette Layer for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 md:via-zinc-950/50 to-transparent pointer-events-none z-[1]" />

          {/* Content Layer */}
          <div className="relative z-10 max-w-xl space-y-4 sm:space-y-5">
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-amber-500/20">
              TUSCAN ATELIER COLLECTION
            </span>

            <h2 className="text-2xl sm:text-5xl font-display font-black tracking-tight leading-tight">
              HANDCRAFTED IN FLORENCE. <br />
              <span className="text-zinc-400">BUILT FOR A LIFETIME.</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed">
              Goodyear storm-welted soles, vegetable-tanned French calfskin, and Vibram commando lug bases. Engineered for refined city streets and alpine trails alike.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href="/category/boots"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>DISCOVER BOOTS & LOAFERS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
                Full Grain Calfskin • <strong className="text-white">Storm Sealed</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-500 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JUST RELEASED</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-display font-black text-zinc-900 dark:text-white tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 group"
          >
            <span>View all new drops</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. AI-MATCHED NEW DROPS YOU MIGHT LIKE */}
      <AINewDropsMatchingSection />

      {/* 9. CINEMATIC ATHLETIC MOTION & CARBON LAB VIDEO SHOWCASE */}
      <CinematicFootwearShowcase video={homeVideo} />

      {/* 10. SS26 LOOKBOOK & RUNWAY GALLERY SHOWCASE (Men, Women, and Kids Spotlights) */}
      <HomeGalleryShowcase items={galleryItems} />

      {/* 11. BRAND VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-12 rounded-3xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
          <div className="max-w-2xl mx-auto text-center space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl font-display font-black text-zinc-900 dark:text-white">
              Why Discerning Athletes Choose VELOCE
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              We engineer without compromise, combining biomechanical science with artisanal Italian craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="space-y-2.5 p-3 sm:p-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Carbon Propulsion</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Curved dual-density carbon plates engineered specifically for high-efficiency marathon pace turnover.
              </p>
            </div>

            <div className="space-y-2.5 p-3 sm:p-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Artisanal Tuscan Leathers</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Vegetable-tanned full grain calfskins hand-burnished in small heritage workshops in Florence.
              </p>
            </div>

            <div className="space-y-2.5 p-3 sm:p-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Guaranteed Authenticity</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Every pair undergoes a 12-point authentication verification before sealed white-glove dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER SUBSCRIPTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-zinc-950 text-white p-6 sm:p-14 border border-zinc-800 text-center overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3.5 sm:space-y-4 relative z-10">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-brand-500">
              JOIN THE VELOCE CIRCLE
            </span>
            <h2 className="text-xl sm:text-4xl font-display font-black tracking-tight">
              Exclusive Access to Future Drops & 20% Off
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Subscribe to receive private invitations to ultra-limited shoe releases, private sales, and biomechanical fit consultations.
            </p>

            <form
              action="#"
              className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 sm:pt-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                required
                className="w-full px-5 py-3 rounded-full text-xs bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>

            <p className="text-[10px] text-zinc-500 pt-1 sm:pt-2">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
