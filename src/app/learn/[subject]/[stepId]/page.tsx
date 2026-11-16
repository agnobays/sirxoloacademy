import { notFound } from "next/navigation";
import Link from "next/link";
import { Lock, Play, Sparkles } from "lucide-react";
import { SUBJECTS, SKILL_STEPS } from "@/data/curriculumData";
import InteractiveLessonPlayer from "@/components/InteractiveLessonPlayer";

interface PageProps {
  params: Promise<{
    subject: string;
    stepId: string;
  }>;
}

export function generateStaticParams() {
  return SKILL_STEPS.map((s) => ({
    subject: s.subjectId,
    stepId: s.id,
  }));
}

export default async function LessonPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { subject: subjectKey, stepId } = resolvedParams;

  const subject = SUBJECTS[subjectKey];
  const step = SKILL_STEPS.find((s) => s.id === stepId && s.subjectId === subjectKey);

  if (!subject || !step) {
    notFound();
  }

  // If this step is locked (e.g. Level 2+), show locked access gate
  if (step.isLocked) {
    const starterStep = SKILL_STEPS.find((s) => s.subjectId === subjectKey && s.stepNumber === 1);
    return (
      <div className="flex-1 bg-slate-100 min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border-2 border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shadow-md">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
              Curriculum Locked • Step {step.stepNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {step.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Step 2 and advanced skill ladders are locked as part of the full curriculum. Step 1 is available to play right now in our <strong>Free Trial Showcase</strong>!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>What unlocks with Full Access:</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside font-medium">
              <li>Complete phonics, blending, and syllable ladders</li>
              <li>Interactive handwriting tracing with vector rail guide</li>
              <li>Native isiZulu stories read by Mr. Xolo</li>
              <li>Printed physical workbooks delivered nationwide</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            {starterStep && (
              <Link
                href={`/learn/${subject.id}/${starterStep.id}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Step 1 (Free Trial)</span>
              </Link>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                href="/store"
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-amber-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all text-center"
              >
                Order Workbooks
              </Link>
              <Link
                href="/parents"
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all text-center"
              >
                Parent Register
              </Link>
            </div>

            <Link
              href={`/learn?subject=${subject.id}`}
              className="inline-block text-xs font-bold text-slate-500 hover:text-slate-800 pt-2 transition-colors"
            >
              ← Back to {subject.name} Skill Ladder
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find next step in the same subject
  const nextStep = SKILL_STEPS.find(
    (s) => s.subjectId === subjectKey && s.stepNumber === step.stepNumber + 1
  );

  return (
    <div className="flex-1 bg-slate-100/60 min-h-screen">
      <InteractiveLessonPlayer step={step} subject={subject} nextStep={nextStep} />
    </div>
  );
}
