"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  CheckCircle2,
  Send,
  Loader2,
  BookOpen,
  Heart,
  Phone,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";
import { soundFx } from "@/utils/audioHelper";
import { setLearnerIdentity } from "@/utils/analytics";

export default function ParentRegistrationForm() {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("5");
  const [subjects, setSubjects] = useState<string[]>(["english", "mathematics", "isizulu"]);
  const [workbookInterest, setWorkbookInterest] = useState(true);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleSubject = (sub: string) => {
    setSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName,
          email,
          phone,
          childName,
          childAge,
          subjects,
          workbookInterest,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration");
      }

      setSubmitted(true);
      setLearnerIdentity(childName || "Learner", parentName);
      soundFx.playSuccessChime();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      soundFx.playRetryBoing();
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-12 border-2 border-emerald-400 shadow-2xl text-center max-w-xl mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Registration Confirmed
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
          Siyabonga, {parentName}!
        </h3>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          We have recorded your details and secured your early bird spot for{" "}
          <strong className="text-slate-900">{childName || "your child"}</strong>.
        </p>

        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-950 space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            Your VIP Early Access Perks:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            <li>Free Foundation Phase Diagnostic Assessment upon launch</li>
            <li>First notification when Sir Xolo opens enrollment</li>
            <li>Exclusive early-bird discount on monthly subscriptions & workbooks</li>
          </ul>
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setParentName("");
            setEmail("");
            setPhone("");
            setChildName("");
          }}
          className="mt-6 w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
        >
          Register Another Learner
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-10 border-2 border-indigo-100 shadow-2xl max-w-2xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Priority Parent Waitlist</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Register for Early Launch Access
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-md mx-auto">
          Be the first to get access when Sir Xolo Academy launches on{" "}
          <strong className="text-indigo-600">sirxoloacademy.co.za</strong>.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Parent Name */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Parent / Guardian Name *</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Nandi Khumalo"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-slate-200 text-slate-900 font-semibold text-sm focus:border-indigo-600 focus:outline-hidden transition-colors"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              required
              placeholder="nandi@example.co.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-slate-200 text-slate-900 font-semibold text-sm focus:border-indigo-600 focus:outline-hidden transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>WhatsApp / Phone Number *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 082 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 border-slate-200 text-slate-900 font-semibold text-sm focus:border-indigo-600 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Child Information */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 sm:space-y-4">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">
            Learner Information
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Child’s First Name
              </label>
              <input
                type="text"
                placeholder="Child's Name"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold text-sm focus:border-indigo-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Age
              </label>
              <select
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold text-sm focus:border-indigo-600 focus:outline-hidden"
              >
                <option value="4">4 Years (Grade R Prep)</option>
                <option value="5">5 Years (Grade R)</option>
                <option value="6">6 Years (Grade 1)</option>
                <option value="7">7 Years (Grade 2)</option>
                <option value="8">8 Years (Grade 3)</option>
                <option value="9+">9+ Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subjects of Interest */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Which subjects are you most interested in?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: "english", label: "English Phonics & Reading", icon: "🔤" },
              { id: "mathematics", label: "Foundation Mathematics", icon: "🔢" },
              { id: "isizulu", label: "isiZulu Ulwimi", icon: "🇿🇦" },
            ].map((sub) => {
              const isChecked = subjects.includes(sub.id);
              return (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => toggleSubject(sub.id)}
                  className={`p-3 rounded-xl sm:rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isChecked
                      ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-black shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-semibold"
                  }`}
                >
                  <span className="text-lg">{sub.icon}</span>
                  <span className="text-xs leading-snug">{sub.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workbook Checkbox */}
        <div>
          <label className="flex items-start gap-2.5 p-3 rounded-xl sm:rounded-2xl border border-slate-200 bg-amber-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={workbookInterest}
              onChange={(e) => setWorkbookInterest(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 shrink-0"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block leading-tight">
                Interested in Physical Workbooks & Storybooks?
              </span>
              <span className="text-slate-600 text-[11px] mt-0.5 block">
                We can notify you when printed books & storybooks are ready to be delivered to your door.
              </span>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-98 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Priority Registration</span>
            </>
          )}
        </button>

        <p className="text-[10px] sm:text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Your information is strictly protected and will only be used for Sir Xolo Academy updates.</span>
        </p>
      </form>
    </div>
  );
}
