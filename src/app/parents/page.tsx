"use client";

import { useState } from "react";
import {
  UserCheck,
  CreditCard,
  CheckCircle2,
  Trophy,
  PlusCircle,
  BarChart3,
  Sparkles,
  Lock,
} from "lucide-react";

export default function ParentsPage() {
  const [children, setChildren] = useState([
    { id: "c1", name: "Sipho M.", age: 6, avatar: "🦁", activeSubs: ["english", "mathematics"] },
  ]);
  const [selectedChild, setSelectedChild] = useState("c1");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["english", "mathematics"]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Pricing calculation based on South African model:
  // 1 subject: R150/mo
  // 2 subjects: R250/mo
  // 3 subjects: R350/mo
  const getMonthlyPrice = (count: number) => {
    if (count === 1) return 150;
    if (count === 2) return 250;
    if (count >= 3) return 350;
    return 0;
  };

  const currentPrice = getMonthlyPrice(selectedSubjects.length);

  const toggleSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleSimulatePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 5000);
  };

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Parent & Guardian Command Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Parent Dashboard
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Manage your child’s enrollment, monitor skill mastery, and adjust monthly subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Children & Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Child Profile Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-indigo-600" />
                Learner Profiles
              </h2>
              <button
                onClick={() => alert("Add learner profile: You can add another child to your family account.")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Add Child
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                    selectedChild === child.id
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                    {child.avatar}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{child.name}</h3>
                    <p className="text-xs text-slate-500">
                      Age {child.age} • {child.activeSubs.length} Active Subjects
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Child Progress Report */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Skill Mastery Overview
              </h2>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Self-Paced Progression
              </span>
            </div>

            <div className="space-y-6">
              {/* English */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span className="text-slate-800">English Literacy</span>
                  <span className="text-indigo-600">Step 1 Mastered (100%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: "35%" }} />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Current focus: /s/, /a/, /t/, /p/ blending & decodable reading.
                </p>
              </div>

              {/* Mathematics */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span className="text-slate-800">Mathematics</span>
                  <span className="text-amber-600">Step 1 In Progress</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "20%" }} />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Current focus: Subitizing and dot patterns 1 to 5.
                </p>
              </div>

              {/* isiZulu */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span className="text-slate-800">isiZulu Ulwimi</span>
                  <span className="text-slate-400">Ready to Start</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "5%" }} />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Current focus: Onkamisa (The 5 Vowels: A, E, I, O, U).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Subscription & Payments */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-lg">
            <h2 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Manage Subscription
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Select the subjects you want your child to have full interactive access to:
            </p>

            <div className="space-y-3 mb-6">
              {[
                { id: "english", name: "English Literacy", icon: "🔤" },
                { id: "mathematics", name: "Mathematics", icon: "🔢" },
                { id: "isizulu", name: "isiZulu Ulwimi", icon: "🇿🇦" },
              ].map((sub) => {
                const isChecked = selectedSubjects.includes(sub.id);
                return (
                  <label
                    key={sub.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isChecked
                        ? "border-indigo-600 bg-indigo-50/50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{sub.icon}</span>
                      <span className="text-sm font-bold text-slate-800">{sub.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSubject(sub.id)}
                      className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                );
              })}
            </div>

            {/* Pricing Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6">
              <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                <span>Selected Subjects:</span>
                <span className="font-bold text-slate-900">{selectedSubjects.length} of 3</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                <span className="text-sm font-black text-slate-900">Monthly Total:</span>
                <div>
                  <span className="text-3xl font-black text-indigo-700">R{currentPrice}</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
              </div>
              {selectedSubjects.length === 3 && (
                <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-center">
                  ✨ Best Value: Saving R100/month compared to individual subjects!
                </div>
              )}
            </div>

            {/* Payment Button */}
            <button
              onClick={handleSimulatePayment}
              disabled={selectedSubjects.length === 0}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay R{currentPrice}/mo via Paystack / PayFast
            </button>

            {paymentSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-100 text-emerald-950 text-xs font-bold text-center border border-emerald-300">
                🎉 Subscription updated successfully! All selected lessons unlocked.
              </div>
            )}

            <p className="text-[11px] text-center text-slate-400 mt-4">
              Secure South African recurring payment. Cancel or change subjects at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
