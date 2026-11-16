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
  GraduationCap,
  Play,
  Award,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react";
import ParentRegistrationForm from "@/components/ParentRegistrationForm";
import AudioButton from "@/components/AudioButton";
import { SUBJECTS } from "@/data/curriculumData";

export default function Home() {
  return (
    <div className="flex-1 bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* 1. HERO SECTION (Dribbble LMS Style Adapted to Spec) */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
        {/* Subtle decorative background blur spots */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-xs sm:text-sm font-bold text-indigo-700">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                <span>Foundation Phase Mastery (Ages 4–9) • South Africa</span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
                Where Young Minds Master{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
                  English, Math & isiZulu
                </span>
              </h1>

              {/* Sub-headline strictly adhering to spec */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                South Africa’s premier interactive, self-paced learning platform. No rigid Grade 1/2/3 labels.
                Children progress through <strong className="text-slate-900 font-bold">continuous step-by-step skill ladders</strong> with bite-sized videos by Sir Xolo, authentic audio pronunciations, and auto-marked tactile quizzes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Pre-Register for Early Access</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#curriculum"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Explore 3-Subject Ladder</span>
                </a>
              </div>

              {/* Social Proof & Trust Metrics */}
              <div className="pt-4 border-t border-slate-200/70 flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center font-black text-xs text-amber-950 shadow-xs">
                    TK
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center font-black text-xs text-white shadow-xs">
                    SM
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center font-black text-xs text-white shadow-xs">
                    ZN
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center font-black text-xs text-white shadow-xs">
                    LM
                  </div>
                </div>

                <div className="text-left text-xs text-slate-600">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-black text-slate-900 ml-1">4.9 / 5.0</span>
                  </div>
                  <p className="mt-0.5 font-medium">Over 500+ South African parents registered for launch</p>
                </div>
              </div>
            </div>

            {/* Right Column: Dribbble-Style Interactive LMS Showcase Card */}
            <div className="lg:col-span-5 relative">
              {/* Main LMS Lesson Preview Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xl shadow-slate-200/70 relative z-10">
                {/* Lesson Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md font-black">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Sir Xolo Video Lesson</h4>
                      <p className="text-xs text-indigo-600 font-bold">English Phonics • Step 3</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Step
                  </span>
                </div>

                {/* Video Lesson Mock Screen */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-900 to-indigo-950 aspect-video flex flex-col items-center justify-center text-white p-4 shadow-inner group">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer border border-white/30 shadow-lg">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl">
                    <span>Sound Blending: /s/ - /u/ - /n/</span>
                    <span className="text-amber-400">4:30 min</span>
                  </div>
                </div>

                {/* Interactive Audio Pronunciation Snippet */}
                <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-xs">
                      /s/
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Audio Ear Training</p>
                      <p className="text-[11px] text-slate-600">English: Sun • isiZulu: Ilanga</p>
                    </div>
                  </div>
                  <AudioButton textToSpeak="s. Sun. Ilanga." label="Test Audio" size="sm" />
                </div>

                {/* Step Ladder Mini Progress */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>Mastery Ladder Progress</span>
                    <span className="text-indigo-600 font-black">Step 3 of 5 Mastered</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 w-3/5 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating Bento Chip 1: Achievement Badge (Top-Right) */}
              <div className="hidden sm:flex absolute -top-5 -right-5 z-20 items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xl animate-bounce-subtle">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Milestone Mastered!</p>
                  <p className="text-[11px] text-emerald-600 font-bold">+50 Stars Earned ⭐</p>
                </div>
              </div>

              {/* Floating Bento Chip 2: Diagnostic Baseline (Bottom-Left) */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 z-20 items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">Zero-Stress Diagnostic</p>
                  <p className="text-[11px] text-slate-500 font-medium">Starts at exact skill readiness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & ARCHITECTURAL PILLARS (Strictly on Spec) */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-3xl sm:text-4xl font-black text-indigo-600">3</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Core Subjects</p>
              <p className="text-[11px] text-slate-500 mt-0.5">English, Math & isiZulu</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600">100%</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Mastery-Based</p>
              <p className="text-[11px] text-slate-500 mt-0.5">No child left with learning gaps</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-3xl sm:text-4xl font-black text-amber-500">4–9</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Foundation Phase</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Tailored for early development</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-3xl sm:text-4xl font-black text-purple-600">PWA</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">Multi-Device Ready</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Phones, tablets & academy tablets</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURRICULUM SECTION: 3 CORE SUBJECTS (LMS Course Cards) */}
      <section id="curriculum" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/70 px-4 py-1.5 rounded-full">
              Foundation Curriculum Ladders
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-4 tracking-tight">
              Continuous Skill Ladders Without Grade Pressure
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Every subject is structured as a proven sequential progression. When a learner proves mastery through auto-marked quizzes, the next milestone unlocks automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Subject 1: English Literacy */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-slate-100 p-8 flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-md">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                    Phonics & Reading
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900">English Literacy</h3>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mt-1">
                  Structured Phonics & Decodable Readers
                </p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Systematic synthetic phonics that turns emerging learners into confident, fluent readers through multisensory ear training.
                </p>

                {/* Sequential Milestones */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Step-by-Step Progression:
                  </span>
                  {[
                    "1. Phonemic Awareness & Letter Sounds",
                    "2. Sound Blending & Digraphs (sh, ch, th)",
                    "3. CVC Word Mastery (cat, pen, sun)",
                    "4. Sight Words & Sentence Construction",
                    "5. Decodable Readers & Digital Storybooks",
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold">Starter Phonics Audio</span>
                  <span className="text-xs font-black text-slate-800">/s/ /a/ /t/ /p/</span>
                </div>
                <AudioButton textToSpeak="s. a. t. p." label="Hear Sounds" size="sm" />
              </div>
            </div>

            {/* Subject 2: Mathematics */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-slate-100 p-8 flex flex-col justify-between hover:border-amber-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-md">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
                    Number Sense
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900">Mathematics</h3>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mt-1">
                  Concrete to Abstract Numeracy
                </p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Building deep mathematical intuition through visual grouping, subitizing, and real-world story problem solving.
                </p>

                {/* Sequential Milestones */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Step-by-Step Progression:
                  </span>
                  {[
                    "1. Visual Subitizing & Dot Recognition",
                    "2. Counting & Number Formation",
                    "3. Comparisons & Number Bonds to 10",
                    "4. Place Value: Tens & Units",
                    "5. Geometry, Patterns & Measurement",
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold">First Milestone</span>
                  <span className="text-xs font-black text-slate-800">Subitizing 1 to 5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Subject 3: isiZulu Ulwimi */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-lg shadow-slate-100 p-8 flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-md">
                    <Heart className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                    Onkamisa & Izindaba
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900">isiZulu Ulwimi</h3>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mt-1">
                  Indigenous Language Immersion
                </p>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Authentic native pronunciation, syllable structures (izakhi), everyday cultural vocabulary, and illustrated short stories.
                </p>

                {/* Sequential Milestones */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Step-by-Step Progression:
                  </span>
                  {[
                    "1. Onkamisa (Vowel Sounds: A, E, I, O, U)",
                    "2. Izakhi Zamagama (Syllable Building: ba, be...)",
                    "3. Amagama Alula (Everyday Vocabulary: umama, inja...)",
                    "4. Imisho Elula (Simple Sentences)",
                    "5. Izindaba Ezimfushane (Short Illustrated Stories)",
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold">Lalela Onkamisa</span>
                  <span className="text-xs font-black text-slate-800">A - E - I - O - U</span>
                </div>
                <AudioButton textToSpeak="A. E. I. O. U." label="Lalela" lang="zu-ZA" size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PEDAGOGY & DIAGNOSTIC ENGINE (Strictly Spec Section 3.2) */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full">
              The Sir Xolo Method
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-4 tracking-tight">
              How the Mastery Engine Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Every child learns differently. Instead of rushing children through a rigid school term, our engine meets your child at their precise point of readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-left relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md">
                1
              </div>
              <h4 className="text-lg font-black text-slate-900">Diagnostic Adventure</h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                A fun, pressure-free game that pinpoints your child’s exact baseline. Prevents skipping critical foundations like vowel sounds or number bonds.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-left relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md">
                2
              </div>
              <h4 className="text-lg font-black text-slate-900">Videos with Sir Xolo</h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Short, energetic 3–5 minute video lessons breaking down one clear concept at a time with warm instruction and clear modeling.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-left relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md">
                3
              </div>
              <h4 className="text-lg font-black text-slate-900">Tactile Quizzes</h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Auto-marked drag-and-drop challenges with immediate audio feedback. The next milestone unlocks only when mastery is celebrated.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-left relative">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md">
                4
              </div>
              <h4 className="text-lg font-black text-slate-900">Parent Dashboard</h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Clear progress logs on your phone. See exactly which sounds, numbers, and stories your child has mastered at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORKBOOKS & READERS STORE PREVIEW (Strictly Spec Section 3.3) */}
      <section id="workbooks" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full">
                No Subscription Required
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Physical Workbooks & Digital Decodable Readers
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                We believe in balancing digital interactive mastery with physical pencil-on-paper handwriting and reading practice. Our standalone store allows parents to purchase physical workbooks and decodable stories independently.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 font-black" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">Physical Printed Activity Books</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      High-quality, durable workbooks shipped nationwide across South Africa for tactile tracing and coloring.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 font-black" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white">Digital Decodable Storybooks</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Illustrated digital flipbooks with word-by-word synchronized audio narration in English and isiZulu.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Book Stack Preview */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black mb-4">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Physical Workbook</span>
                    <h4 className="text-lg font-black text-white mt-1">Phonics & Tracing Activity Pack</h4>
                    <p className="text-xs text-slate-300 mt-2">
                      80+ pages of letter formation, sound blending sliders, and CVC word exercises.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-sm font-black text-amber-400">Printed Edition</span>
                    <span className="text-xs text-slate-400 font-bold">Shipped Nationwide</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black mb-4">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Decodable Reader</span>
                    <h4 className="text-lg font-black text-white mt-1">Sipho & The Sun / Ilanga</h4>
                    <p className="text-xs text-slate-300 mt-2">
                      Bilingual decodable reader with native audio narration and comprehension questions.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-sm font-black text-indigo-400">Digital + Audio</span>
                    <span className="text-xs text-slate-400 font-bold">Instant Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT TUITION PLANS (Strictly Spec Section 3.3) */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full">
              Tuition Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-4 tracking-tight">
              Simple, Transparent Monthly Subscriptions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              No locked-in contracts. Cancel or switch subjects anytime. Every subscription includes full access to Sir Xolo’s videos, auto-marked quizzes, and parent reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* 1 Subject Plan */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Single Subject
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-4">1 Subject Focus</h3>
                <p className="text-xs text-slate-500 mt-1">Choose English, Math, or isiZulu</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-950">R150</span>
                  <span className="text-slate-500 text-sm font-bold">/ month</span>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    "Full mastery ladder for 1 subject",
                    "All video lessons by Sir Xolo",
                    "Auto-marked quizzes & stars",
                    "Child progress tracking on parent phone",
                    "Cancel or pause anytime",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href="#register"
                  className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs uppercase tracking-wider flex items-center justify-center transition-colors"
                >
                  Pre-Register (1 Subject)
                </a>
              </div>
            </div>

            {/* 2 Subjects Plan */}
            <div className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Dual Subject • Save R50/mo
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-4">Any 2 Subjects</h3>
                <p className="text-xs text-slate-500 mt-1">E.g., English Literacy + Mathematics</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-950">R250</span>
                  <span className="text-slate-500 text-sm font-bold">/ month</span>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    "Full mastery ladders for 2 chosen subjects",
                    "All video lessons by Sir Xolo",
                    "Auto-marked quizzes & rewards",
                    "Multi-subject progress analytics",
                    "Cancel or pause anytime",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href="#register"
                  className="w-full py-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-black text-xs uppercase tracking-wider flex items-center justify-center transition-colors"
                >
                  Pre-Register (2 Subjects)
                </a>
              </div>
            </div>

            {/* All 3 Subjects (Most Popular) */}
            <div className="rounded-3xl bg-white border-2 border-indigo-600 p-8 shadow-xl shadow-indigo-100 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                Most Popular • Best Value
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Complete Foundation Mastery
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-4">All 3 Subjects</h3>
                <p className="text-xs text-slate-500 mt-1">English + Mathematics + isiZulu</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-indigo-600">R350</span>
                  <span className="text-slate-500 text-sm font-bold">/ month</span>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    "Unrestricted access to all 3 subjects",
                    "All video lessons & pronunciation audio",
                    "Interactive decodable readers included",
                    "Priority parent support & diagnostics",
                    "Exclusive discounts on physical workbooks",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href="#register"
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center shadow-md shadow-indigo-200 transition-all"
                >
                  Pre-Register (All 3 Subjects)
                </a>
              </div>
            </div>
          </div>

          {/* Early Bird Guarantee Banner */}
          <div className="mt-12 p-6 rounded-3xl bg-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 font-black">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black">Early Bird Launch Guarantee</h4>
                <p className="text-xs text-indigo-200 mt-0.5">
                  The first 200 pre-registrations lock in a 20% discount on their first month + receive a free digital starter activity pack.
                </p>
              </div>
            </div>

            <a
              href="#register"
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs uppercase tracking-wider shrink-0 transition-colors"
            >
              Claim Spot Now
            </a>
          </div>
        </div>
      </section>

      {/* 7. PARENT PRE-REGISTRATION FORM SECTION */}
      <section id="register" className="py-20 bg-gradient-to-b from-white to-indigo-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full">
              Priority Pre-Registration
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-4 tracking-tight">
              Secure Your Child’s Spot for Launch
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Tell us about your learner so we can personalize their diagnostic starting step. No payment details required today.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <ParentRegistrationForm />
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 text-white py-14 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <span className="text-xl font-black tracking-tight text-white block">
                SIR XOLO ACADEMY
              </span>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Empowering Foundation Phase learners across South Africa with mastery-based English Literacy, Mathematics, and isiZulu Ulwimi skills.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-400">
              <a href="#curriculum" className="hover:text-white transition-colors">
                Curriculum Ladders
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#workbooks" className="hover:text-white transition-colors">
                Workbooks & Readers
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Tuition Plans
              </a>
              <a href="#register" className="text-amber-400 hover:text-amber-300 transition-colors">
                Pre-Register
              </a>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 font-medium">
            <p>© 2026 SIR XOLO ACADEMY (`sirxoloacademy.co.za`). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
