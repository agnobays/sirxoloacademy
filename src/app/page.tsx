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
  Clock,
  Heart,
  Volume2,
} from "lucide-react";
import ParentRegistrationForm from "@/components/ParentRegistrationForm";
import { SUBJECTS } from "@/data/curriculumData";

export default function Home() {
  return (
    <div className="flex-1 bg-gradient-to-b from-indigo-50/60 via-white to-amber-50/40">
      {/* Launching Soon Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Launching Soon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-xs sm:text-sm font-black shadow-md mb-6 uppercase tracking-wider animate-pulse">
              <Clock className="w-4 h-4" />
              <span>Launching Soon • sirxoloacademy.co.za</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              A New Way for Foundation Learners to{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                Thrive & Master Skills
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 leading-relaxed font-medium">
              We are preparing to launch South Africa’s premier interactive, self-paced learning platform for Foundation Phase learners in{" "}
              <strong className="text-slate-900">English Literacy</strong>,{" "}
              <strong className="text-slate-900">Mathematics</strong>, and{" "}
              <strong className="text-slate-900">isiZulu Ulwimi</strong>.
            </p>

            {/* Core Values Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-black text-slate-700">
              <span className="bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5">
                ✨ No Rigid Grades — Pure Skill Mastery
              </span>
              <span className="bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5">
                🎥 Short Pre-Recorded Videos by Sir Xolo
              </span>
              <span className="bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5">
                🔊 Audio-First Pronunciation
              </span>
              <span className="bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5">
                📱 Phones, Tablets & Dedicated Academy Tablets
              </span>
            </div>
          </div>

          {/* Embedded Parent Registration Form */}
          <div id="register" className="relative">
            <ParentRegistrationForm />
          </div>
        </div>
      </section>

      {/* Subject Pillars Preview */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              What We Teach
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3">
              Step-by-Step Curriculum
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Children learn independently at their own pace without live class pressure. The next step unlocks automatically once mastery is proven.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.values(SUBJECTS).map((sub) => (
              <div
                key={sub.id}
                className="rounded-3xl p-8 border-2 border-slate-100 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center font-black text-xl shadow-md mb-6`}
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
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    First Milestone:
                  </span>
                  <span className="text-sm font-black text-slate-800">
                    {sub.starterSkill}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Subscription & Workbooks Preview */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Launch Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-4">
            Affordable Monthly Plans & Standalone Books
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            No long contracts. Parents register, choose subjects, and track progress effortlessly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs text-slate-400 uppercase font-bold">1 Subject</span>
              <p className="text-3xl font-black text-white mt-1">R150<span className="text-xs text-slate-400">/mo</span></p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs text-slate-400 uppercase font-bold">Any 2 Subjects</span>
              <p className="text-3xl font-black text-white mt-1">R250<span className="text-xs text-slate-400">/mo</span></p>
            </div>
            <div className="p-6 rounded-2xl bg-indigo-900 border-2 border-indigo-400">
              <span className="text-xs text-amber-300 uppercase font-bold">All 3 Subjects</span>
              <p className="text-3xl font-black text-amber-400 mt-1">R350<span className="text-xs text-slate-300">/mo</span></p>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-xs text-slate-300 flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Printed resource workbooks and storybook collections will also be available for standalone purchase without any subscription required!
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
