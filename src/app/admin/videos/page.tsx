import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminVideosManager } from "@/components/admin/AdminVideosManager";

export const metadata: Metadata = {
  title: "Cinematic Videos Manager | VELOCE Admin",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminVideosPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin/videos");
  }

  let videos: any[] = [];

  try {
    const rawVideos = await db.homeVideo.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    videos = (rawVideos || []).map((v) => ({
      id: v.id,
      title: v.title,
      subtitle: v.subtitle,
      badge: v.badge,
      videoUrl: v.videoUrl,
      posterUrl: v.posterUrl,
      ctaText: v.ctaText,
      ctaLink: v.ctaLink,
      secondaryCtaText: v.secondaryCtaText,
      secondaryCtaLink: v.secondaryCtaLink,
      specs: v.specs,
      order: v.order,
      isActive: v.isActive,
      createdAt: v.createdAt ? new Date(v.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: v.updatedAt ? new Date(v.updatedAt).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error("AdminVideosPage fetch error:", err);
  }

  return <AdminVideosManager initialVideos={videos} />;
}
