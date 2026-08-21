import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ShopPageBanner } from "@/components/storefront/ShopPageBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  let category: any = null;
  let shopBanner: any = null;

  try {
    const data = await Promise.all([
      db.category.findUnique({
        where: { slug },
        include: {
          products: {
            where: { status: "ACTIVE" },
            include: {
              images: { orderBy: { order: "asc" } },
              category: true,
              brand: true,
              sizes: true,
            },
          },
        },
      }),
      db.shopBanner.findFirst({
        where: { id: "default" },
      }),
    ]);

    category = data[0];
    shopBanner = data[1];
  } catch (error) {
    console.warn("⚠️ CategoryPage query fallback:", error);
  }

  if (!category) {
    category = {
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
      slug,
      description: "Curated high-performance silhouettes and luxury footwear archive.",
      image: null,
      products: [],
    };
  }

  const categoryBanner = shopBanner
    ? {
        ...shopBanner,
        badge: `${category.name.toUpperCase()} • SS26 ARCHIVE`,
        heading: `${category.name.toUpperCase()}`,
        subtitle: category.description || shopBanner.subtitle,
        ctaText: `EXPLORE ALL ${category.name.toUpperCase()}`,
        ctaLink: `/shop?category=${category.slug}`,
      }
    : {
        id: `category-${category.slug}`,
        badge: `${category.name.toUpperCase()} • SS26 ARCHIVE`,
        heading: `${category.name.toUpperCase()}`,
        subtitle: category.description,
        imageUrl: category.image || "/images/shop-banner.png",
        videoUrl: null,
        mediaType: "image",
        ctaText: `SHOP ${category.name.toUpperCase()}`,
        ctaLink: `/shop?category=${category.slug}`,
        isActive: true,
      };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. DYNAMIC CATEGORY VIDEO & CAMPAIGN BANNER (Syncs with Admin Shop Banner) */}
      <ShopPageBanner initialBanner={categoryBanner} productCount={category.products.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-zinc-900 dark:hover:text-white">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 dark:text-white font-semibold">
            {category.name}
          </span>
        </nav>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
            Available Models ({category.products.length})
          </p>
        </div>

        {category.products.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No shoes currently available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {category.products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
