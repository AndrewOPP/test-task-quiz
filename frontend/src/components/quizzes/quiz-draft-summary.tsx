import type { QuestionType } from '@/lib/mock-quizzes';

type QuizDraftSummaryProps = {
  questionSummary: Record<QuestionType, number>;
};

export function QuizDraftSummary({ questionSummary }: QuizDraftSummaryProps) {
  return (
    <div className="grid gap-4 rounded-4xl border border-white/70 bg-white/75 p-8 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.3)] backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
          Draft summary
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
          Small pieces, easy to review.
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm text-slate-600">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Boolean</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{questionSummary.BOOLEAN}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Input</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{questionSummary.INPUT}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Checkbox</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{questionSummary.CHECKBOX}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-500">
        Boolean questions keep True / False options, input questions accept short text, and
        checkbox questions allow multiple correct answers.
      </div>
    </div>
  );
}
