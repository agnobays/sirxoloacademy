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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Pure Brand Logo: SIR XOLO ACADEMY */}
          <Link href="/" className="group flex items-center">
            <span className="text-sm xs:text-base sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
              SIR XOLO ACADEMY
            </span>
          </Link>

          {/* Right Header Status / Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Priority Waitlist Open</span>
            </div>

            <a
              href="#register"
              onClick={scrollToRegister}
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-[11px] sm:text-sm uppercase tracking-wide shadow-md transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>Pre-Register</span>
              <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
