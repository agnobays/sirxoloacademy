"use client";

import Link from "next/link";
import { Sparkles, ArrowDown } from "lucide-react";

export default function Navbar() {
  const scrollToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("register");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Pure Name / Logo: SIR XOLO ACADEMY */}
          <Link href="/" className="group flex items-center">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              SIR XOLO ACADEMY
            </span>
          </Link>

          {/* Right Header Status / Action */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Priority Waitlist Open</span>
            </div>

            <a
              href="#register"
              onClick={scrollToRegister}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Pre-Register</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
