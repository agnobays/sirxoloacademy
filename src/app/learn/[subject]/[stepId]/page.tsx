import { notFound } from "next/navigation";
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
