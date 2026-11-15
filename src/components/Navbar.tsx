"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, BookOpen, ShoppingBag, ShieldCheck, UserCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isKidMode = pathname?.startsWith("/learn");

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-500 p-0.5 shadow-md transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-xl sm:text-2xl text-indigo-700">
                SX
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 block leading-tight">
                Sir Xolo <span className="text-indigo-600">Academy</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase block">
                sirxoloacademy.co.za
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/learn"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isKidMode
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Learner Zone</span>
            </Link>

            <Link
              href="/store"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname?.startsWith("/store")
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Workbooks & Stories</span>
            </Link>

            <Link
              href="/parents"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname?.startsWith("/parents")
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Parent Portal</span>
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                pathname?.startsWith("/admin") ? "text-indigo-600 font-bold" : ""
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sir Xolo CMS</span>
            </Link>
          </nav>

          {/* Mobile Fast Links */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/learn"
              className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-xs"
            >
              Learn
            </Link>
            <Link
              href="/store"
              className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-xs"
            >
              Store
            </Link>
            <Link
              href="/parents"
              className="px-3 py-1.5 bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs"
            >
              Parents
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
