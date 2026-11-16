export type SubjectId = "english" | "mathematics" | "isizulu";

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  nativeName?: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
  starterSkill: string;
}

export type ActivityType =
  | "phonics_listen"
  | "sound_matching"
  | "cvc_builder"
  | "number_counter"
  | "number_bonds"
  | "picture_word_match"
  | "sentence_builder"
  | "tracing"
  | "ten_frame";

export interface ActivityOption {
  id: string;
  label: string;
  sublabel?: string;
  sound?: string;
  image?: string;
  isCorrect?: boolean;
}

export interface LessonActivity {
  id: string;
  type: ActivityType;
  prompt: string;
  subPrompt?: string;
  audioPrompt?: string;
  options?: ActivityOption[];
  correctAnswer?: string | string[];
  feedbackSuccess: string;
  feedbackRetry: string;
  tracingTarget?: string;
  tenFrameTarget?: number;
  counterCount?: number;
  counterIcon?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  audioPrompt?: string;
  imageUrl?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  highlightWords?: string[];
  illustration: string;
  audioUrl?: string;
}

export interface StoryBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  summary: string;
  pages: StoryPage[];
}

export interface SkillStep {
  id: string;
  stepNumber: number;
  subjectId: SubjectId;
  title: string;
  subtitle: string;
  description: string;
  videoUrl?: string;
  videoDuration?: string;
  focusSkills: string[];
  activities: LessonActivity[];
  quiz: QuizQuestion[];
  decodableBook?: StoryBook;
  isLocked?: boolean;
}

export interface ProductItem {
  id: string;
  title: string;
  subjectId: SubjectId | "bundle";
  type: "workbook" | "storybook" | "physical_kit";
  priceZAR: number;
  description: string;
  coverImage: string;
  format: "Physical Book" | "Printable PDF" | "Physical + Digital";
  isFeatured?: boolean;
}
