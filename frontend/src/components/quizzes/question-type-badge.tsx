import { questionTypeLabels, type StoredQuestion } from '@/lib/mock-quizzes';

export function QuestionTypeBadge({ type }: { type: StoredQuestion['type'] }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
      {questionTypeLabels[type]}
    </span>
  );
}
