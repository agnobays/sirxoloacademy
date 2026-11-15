import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Trophy,
  Smartphone,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { SUBJECTS, WORKBOOK_PRODUCTS } from "@/data/curriculumData";

export default function Home() {
  return (
    <div className="flex-1 bg-gradient-to-b from-indigo-50/50 via-white to-amber-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Domain Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-extrabold mb-6 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Official Platform: sirxoloacademy.co.za</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              Mastering Skills <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                Step-by-Step
              </span>{" "}
              at Their Own Pace
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 leading-relaxed font-medium">
              Interactive, self-paced learning for Foundation Phase learners in{" "}
              <strong className="text-slate-900">English</strong>,{" "}
              <strong className="text-slate-900">Mathematics</strong>, and{" "}
              <strong className="text-slate-900">isiZulu</strong>. No rigid grade barriers—just
              pure mastery from first sounds to confident reading and problem-solving.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/learn"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-base shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Start Learning (Kid Zone)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/parents"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-black text-base shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Parents: View Plans & Register</span>
              </Link>
            </div>

            {/* Tablet / PWA highlight */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Works directly on phones, iPads, Android tablets & can be added to your Home Screen</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Subjects Showcase */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Foundation Curriculum
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3">
              Three Core Learning Pillars
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Every subject follows an unbroken ladder of skills: concepts unlock only once mastery is confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.values(SUBJECTS).map((sub) => (
              <div
                key={sub.id}
                className="rounded-3xl p-8 border-2 border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center font-black text-xl shadow-md mb-6 group-hover:scale-105 transition-transform`}
                  >
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{sub.name}</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">
                    {sub.nativeName}
                  </p>
                  <p className="text-slate-600 text-sm mt-4 leading-relaxed font-medium">
                    {sub.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                      Step 1 Begins With:
                    </span>
                    <span className="text-sm font-black text-slate-800">
                      {sub.starterSkill}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/learn?subject=${sub.id}`}
                  className="mt-8 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-between shadow-xs"
                >
                  <span>Explore Ladder</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Pricing Section */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Transparent South African Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-4">
              Simple Monthly Subscriptions
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Full access to self-paced videos, interactive activities, auto-marked quizzes, and progress reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 1 Subject */}
            <div className="rounded-3xl p-8 bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-100">Single Subject</h3>
                <p className="text-xs text-slate-400 mt-1">Focus on English, Math, or isiZulu</p>
                <div className="mt-6">
                  <span className="text-4xl font-black text-white">R150</span>
                  <span className="text-slate-400 text-sm"> / month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1 Chosen Subject Skill Ladder</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sir Xolo Pre-recorded Videos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Interactive Activities & Quizzes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Parent Progress Dashboard</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/parents"
                className="mt-8 py-3.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm text-center block transition-colors"
              >
                Choose 1 Subject
              </Link>
            </div>

            {/* 2 Subjects */}
            <div className="rounded-3xl p-8 bg-slate-800/80 border border-slate-700 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-100">Any Two Subjects</h3>
                <p className="text-xs text-slate-400 mt-1">Combine any 2 subjects</p>
                <div className="mt-6">
                  <span className="text-4xl font-black text-white">R250</span>
                  <span className="text-slate-400 text-sm"> / month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>2 Subjects of Your Choice</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Save R50 every month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All Interactive Lessons & Audio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Parent Mastery Reports</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/parents"
                className="mt-8 py-3.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm text-center block transition-colors"
              >
                Choose 2 Subjects
              </Link>
            </div>

            {/* All 3 Subjects (BEST VALUE) */}
            <div className="rounded-3xl p-8 bg-gradient-to-b from-indigo-900 to-slate-900 border-2 border-indigo-500 shadow-2xl relative flex flex-col justify-between transform md:-translate-y-3">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wide">
                Best Value
              </div>
              <div>
                <h3 className="text-xl font-black text-white">All Three Subjects</h3>
                <p className="text-xs text-indigo-200 mt-1">Complete Foundation Pack</p>
                <div className="mt-6">
                  <span className="text-4xl font-black text-amber-400">R350</span>
                  <span className="text-slate-300 text-sm"> / month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>English, Math & isiZulu (All 3)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Full Digital Decodable Storybooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Automated Diagnostic Assessment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Priority Support & Certificate of Mastery</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/parents"
                className="mt-8 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm text-center block shadow-lg transition-transform hover:scale-102"
              >
                Subscribe to All 3 (R350/mo)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Standalone Resource Store Preview */}
      <section className="py-20 bg-amber-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Standalone Books & Kits
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-3">
                Workbooks & Storybooks
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Order physical books or download printable PDFs separately without needing an active subscription.
              </p>
            </div>
            <Link
              href="/store"
              className="mt-4 md:mt-0 font-bold text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
            >
              <span>View All Store Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORKBOOK_PRODUCTS.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-44 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl mb-4 border border-slate-200/60">
                    📖
                  </div>
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.format}
                  </span>
                  <h3 className="font-black text-lg text-slate-900 mt-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900">
                    R{item.priceZAR}
                  </span>
                  <Link
                    href={`/store?product=${item.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
