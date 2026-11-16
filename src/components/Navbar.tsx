"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowRight, Play } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    // If on another route like /learn, standard <a href="/#id"> will handle navigation
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo: SIR XOLO ACADEMY */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              SIR XOLO ACADEMY
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-600">
            <a
              href="/#curriculum"
              onClick={handleNavClick("curriculum")}
              className="hover:text-indigo-600 transition-colors"
            >
              Curriculum Ladders
            </a>
            <a
              href="/#how-it-works"
              onClick={handleNavClick("how-it-works")}
              className="hover:text-indigo-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#workbooks"
              onClick={handleNavClick("workbooks")}
              className="hover:text-indigo-600 transition-colors"
            >
              Workbooks & Readers
            </a>
            <a
              href="/#pricing"
              onClick={handleNavClick("pricing")}
              className="hover:text-indigo-600 transition-colors"
            >
              Tuition Plans
            </a>
            <Link
              href="/learn"
              className="text-indigo-600 hover:text-indigo-800 transition-colors font-extrabold flex items-center gap-1"
            >
              <span>Learner Zone</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Free Trial Button - Visible on Mobile & Desktop */}
            <Link
              href="/learn/english/eng-step-1"
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden xs:inline">Free Trial</span>
              <span className="xs:hidden">Trial</span>
              <span className="bg-slate-950 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">Live</span>
            </Link>

            <a
              href="/#register"
              onClick={handleNavClick("register")}
              className="px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Pre-Register</span>
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
