"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Navbar() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo: SIR XOLO ACADEMY */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              SIR XOLO ACADEMY
            </span>
          </Link>

          {/* Desktop Navigation Links (Anchor to Spec Sections) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a
              href="#curriculum"
              onClick={scrollTo("curriculum")}
              className="hover:text-indigo-600 transition-colors"
            >
              Curriculum Ladders
            </a>
            <a
              href="#how-it-works"
              onClick={scrollTo("how-it-works")}
              className="hover:text-indigo-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#workbooks"
              onClick={scrollTo("workbooks")}
              className="hover:text-indigo-600 transition-colors"
            >
              Workbooks & Readers
            </a>
            <a
              href="#pricing"
              onClick={scrollTo("pricing")}
              className="hover:text-indigo-600 transition-colors"
            >
              Tuition Plans
            </a>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Foundation Phase (Ages 4–9)</span>
            </div>

            <a
              href="#register"
              onClick={scrollTo("register")}
              className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Pre-Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
