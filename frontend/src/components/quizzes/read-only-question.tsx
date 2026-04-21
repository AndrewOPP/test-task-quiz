import { QuestionTypeBadge } from '@/components/quizzes/question-type-badge';
import type { StoredQuestion } from '@/lib/mock-quizzes';

type ReadOnlyQuestionProps = {
  question: StoredQuestion;
  index: number;
};

export function ReadOnlyQuestion({ question, index }: ReadOnlyQuestionProps) {
  if (question.type === 'BOOLEAN') {
    const selected = question.correctAnswers?.[0] ?? 'True';

    return (
      <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              Question {index + 1}
            </p>
            <h3 className="mt-3 max-w-full wrap-break-word text-2xl font-semibold tracking-tight text-slate-950">
              {question.text}
            </h3>
          </div>

          <QuestionTypeBadge type={question.type} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {['True', 'False'].map((option) => {
            const isSelected = selected === option;

            return (
              <div
                key={option}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                  isSelected
                    ? 'border-emerald-200 bg-emerald-100 text-emerald-900'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    isSelected ? 'border-emerald-700' : 'border-slate-300'
                  }`}
                >
                  {isSelected ? <span className="h-2.5 w-2.5 rounded-full bg-current" /> : null}
                </span>
                <span className="text-sm font-medium">{option}</span>
              </div>
            );
          })}
        </div>
      </article>
    );
  }

  if (question.type === 'INPUT') {
    return (
      <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              Question {index + 1}
            </p>
            <h3 className="mt-3 max-w-full wrap-break-word text-2xl font-semibold tracking-tight text-slate-950">
              {question.text}
            </h3>
          </div>

          <QuestionTypeBadge type={question.type} />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
          {question.correctAnswers?.[0] ?? 'Short answer'}
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
            Question {index + 1}
          </p>
          <h3 className="mt-3 max-w-full wrap-break-word text-2xl font-semibold tracking-tight text-slate-950">
            {question.text}
          </h3>
        </div>

        <QuestionTypeBadge type={question.type} />
      </div>

      <div className="mt-6 grid gap-3">
        {(question.options ?? []).map((option) => {
          const isCorrect = (question.correctAnswers ?? []).includes(option);

          return (
            <div
              key={option}
              className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${
                isCorrect
                  ? 'border-emerald-200 bg-emerald-100 text-emerald-900'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <span className="text-sm font-medium">{option}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em]">
                {isCorrect ? 'Correct' : 'Option'}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
