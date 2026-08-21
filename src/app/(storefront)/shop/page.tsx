import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ShopFiltersClient } from "@/components/shop/ShopFiltersClient";
import { ShopPageBanner } from "@/components/storefront/ShopPageBanner";
import { AIRecommendedSection } from "@/components/storefront/AIRecommendedSection";
import { Sparkles, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ShopPageProps {
  searchParams: {
    search?: string;
    category?: string;
    brand?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    deal?: string;
    featured?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { search, category, brand, size, minPrice, maxPrice, sort = "featured", deal, featured } = searchParams;

  const where: any = {
    status: "ACTIVE",
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (brand) {
    where.brand = { slug: brand };
  }

  if (size) {
    where.sizes = {
      some: {
        size: size,
        stock: { gt: 0 },
      },
    };
  }

  if (deal === "true") {
    where.salePrice = { not: null, gt: 0 };
  }

  if (featured === "true") {
    where.isFeatured = true;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const orderBy: any = {};
  if (sort === "price-asc") orderBy.price = "asc";
  else if (sort === "price-desc") orderBy.price = "desc";
  else if (sort === "rating") orderBy.rating = "desc";
  else if (sort === "newest") orderBy.createdAt = "desc";
  else orderBy.isFeatured = "desc";

  let products: any[] = [];
  let categories: any[] = [];
  let brands: any[] = [];
  let shopBanner: any = null;

  try {
    const data = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
          brand: true,
          sizes: true,
        },
      }),
      db.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      db.brand.findMany({
        orderBy: { name: "asc" },
      }),
      db.shopBanner.findFirst({
        where: { id: "default" },
      }),
    ]);
    products = data[0];
    categories = data[1] && data[1].length > 0 ? data[1] : [
      { id: "cat-1", name: "Running & Marathon", slug: "running" },
      { id: "cat-2", name: "Lifestyle & Street", slug: "lifestyle" },
      { id: "cat-3", name: "Basketball & Court", slug: "basketball" },
      { id: "cat-4", name: "Training & Gym", slug: "training" },
      { id: "cat-5", name: "Luxury Runway", slug: "luxury" },
    ];
    brands = data[2];
    shopBanner = data[3];
  } catch (error) {
    console.warn("⚠️ ShopPage data query fallback:", error);
  }

  const hasSpecificFilters = !!(search || category || brand || size || minPrice || maxPrice || deal);
  const displayProducts = (products.length === 0 && !hasSpecificFilters) ? [
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
  ] : products;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. TOP CINEMATIC CAMPAIGN BANNER (Image or Video from Admin) */}
      <ShopPageBanner initialBanner={shopBanner} productCount={displayProducts.length} />

      {/* 2. MAIN CATALOG WITH FILTERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-xs text-zinc-400 py-12 text-center">Loading filters...</div>}>
          <ShopFiltersClient
            categories={categories}
            brands={brands}
            productsCount={displayProducts.length}
            currentParams={searchParams}
          >
            {displayProducts.length === 0 ? (
              <div className="col-span-full py-20 text-center rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">No footwear matched your filters</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your price range, clearing category filters, or searching for broader terms.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </ShopFiltersClient>
        </Suspense>
      </div>

      {/* 3. AI PERSONALIZED RECOMMENDATION SECTION */}
      <AIRecommendedSection />
    </div>
  );
}
