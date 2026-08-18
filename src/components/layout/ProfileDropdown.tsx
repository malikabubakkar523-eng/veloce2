"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  ShoppingBag,
  Package,
  Heart,
  Settings,
  ShieldCheck,
  Brain,
  Bell,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/ToastProvider";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  avatar?: string | null;
}

interface ProfileDropdownProps {
  user?: UserProfile | null;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast({
        title: "Signed Out",
        description: "You have been safely signed out of VELOCE.",
        type: "info",
      });
      setIsOpen(false);
      router.push("/login");
      router.refresh();
    } catch (err) {
      toast({ title: "Logout Error", type: "error" });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <Link
        href={user ? (user.role === "ADMIN" ? "/admin" : "/account/profile") : "/login"}
        className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors shrink-0 relative group cursor-pointer"
        aria-label="Account Profile"
        aria-expanded={isOpen}
      >
        {user ? (
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-xs overflow-hidden ring-2 ring-brand-500/40 shadow-md group-hover:scale-105 transition-transform">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
            ) : (
              <span className="font-display font-black text-xs">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        ) : (
          <UserIcon className="w-[22px] h-[22px] sm:w-[23px] sm:h-[23px] stroke-[1.8] group-hover:scale-110 transition-transform" />
        )}
      </Link>

      {/* Glassmorphism Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full pt-2 w-80 sm:w-88 z-50 select-none"
          >
            {/* Frosted Glass Container */}
            <div className="relative rounded-3xl overflow-hidden bg-white/85 dark:bg-zinc-950/85 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-zinc-900 dark:text-white p-5 space-y-4">
              {/* Subtle Radial Ambient Shimmer inside glass */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {user ? (
                /* Authenticated User View */
                <div className="space-y-4 relative z-10">
                  {/* User Profile Header Badge */}
                  <div className="p-3.5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-2xl bg-brand-500 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0 overflow-hidden ring-1 ring-brand-500/50">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                      ) : (
                        <span>{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        {user.role === "ADMIN" ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono font-black uppercase">
                            ADMIN
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md bg-brand-500/15 text-brand-600 dark:text-brand-400 text-[9px] font-mono font-bold uppercase flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" />
                            PATRON
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Links Grid */}
                  <div className="space-y-1 divide-y divide-zinc-100 dark:divide-zinc-800/50">
                    <div className="space-y-1 pb-1">
                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 transition-all font-bold text-xs group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-xs">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <span>Admin Control Center</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      )}

                      {/* Orders & Tracking */}
                      <Link
                        href="/account/orders"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-all text-xs font-semibold text-zinc-800 dark:text-zinc-200 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block">My Orders & Tracking</span>
                            <span className="text-[10px] text-zinc-400 font-normal">Courier milestones & history</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {/* Patron Profile */}
                      <Link
                        href="/account/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-all text-xs font-semibold text-zinc-800 dark:text-zinc-200 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block">Patron Profile</span>
                            <span className="text-[10px] text-zinc-400 font-normal">Personal details & avatar</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {/* AI Style Calibration */}
                      <Link
                        href="/account/settings"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-all text-xs font-semibold text-zinc-800 dark:text-zinc-200 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                            <Brain className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block">AI Style Calibration</span>
                            <span className="text-[10px] text-zinc-400 font-normal">Personalized shoe preferences</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {/* Wishlist */}
                      <Link
                        href="/wishlist"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-all text-xs font-semibold text-zinc-800 dark:text-zinc-200 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                            <Heart className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block">Saved Wishlist</span>
                            <span className="text-[10px] text-zinc-400 font-normal">Favorited silhouettes</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      {/* Notifications */}
                      <Link
                        href="/account/notifications"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 transition-all text-xs font-semibold text-zinc-800 dark:text-zinc-200 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block">Notification Alerts</span>
                            <span className="text-[10px] text-zinc-400 font-normal">Price drops & deal alerts</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{isLoggingOut ? "Signing Out..." : "Sign Out of Atelier"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Guest View */
                <div className="space-y-4 relative z-10">
                  {/* Guest Header */}
                  <div className="space-y-1 text-center py-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>VELOCE PATRON ACCESS</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Welcome to VELOCE
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                      Sign in to track orders, save favorites, and calibrate bespoke AI shoe recommendations.
                    </p>
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <span>Create An Account</span>
                    </Link>
                  </div>

                  {/* Quick Guest Links */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1">
                    <Link
                      href="/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Saved Wishlist</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-zinc-400" />
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-blue-500" />
                        <span>Track an Order</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-zinc-400" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
