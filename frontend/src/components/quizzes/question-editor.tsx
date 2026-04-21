import { SoftButton } from '@/components/ui/soft-button';
import { questionTypeOptions, type DraftQuestion, type QuestionType } from '@/lib/mock-quizzes';
import { type ChangeEvent } from 'react';

type QuestionEditorProps = {
  question: DraftQuestion;
  questionIndex: number;
  onRemove: (questionId: string) => void;
  onUpdate: (questionId: string, updater: (current: DraftQuestion) => DraftQuestion) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, optionIndex: number) => void;
  onToggleCorrectOption: (questionId: string, optionIndex: number) => void;
  onChangeOption: (questionId: string, optionIndex: number, value: string) => void;
};

function descriptionForType(type: QuestionType) {
  return questionTypeOptions.find((option) => option.value === type)?.description;
}

function syncQuestionType(question: DraftQuestion, nextType: QuestionType): DraftQuestion {
  if (nextType === 'BOOLEAN') {
    return {
      ...question,
      type: nextType,
      correctAnswer: question.correctAnswer === 'False' ? 'False' : 'True',
      options: ['True', 'False'],
      correctAnswers: [],
    };
  }

  if (nextType === 'INPUT') {
    return {
      ...question,
      type: nextType,
      correctAnswer: '',
      options: [],
      correctAnswers: [],
    };
  }

  const options =
    question.type === 'CHECKBOX' && question.options.length > 0
      ? question.options
      : ['Option 1', 'Option 2'];

  return {
    ...question,
    type: nextType,
    correctAnswer: '',
    options,
    correctAnswers:
      question.type === 'CHECKBOX' && question.correctAnswers.length > 0
        ? question.correctAnswers
        : [options[0] ?? 'Option 1'],
  };
}

export function QuestionEditor({
  question,
  questionIndex,
  onRemove,
  onUpdate,
  onAddOption,
  onRemoveOption,
  onToggleCorrectOption,
  onChangeOption,
}: QuestionEditorProps) {
  return (
    <article className="overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
            Question {questionIndex + 1}
          </p>
          <h3 className="mt-3 max-w-full wrap-break-word text-2xl font-semibold tracking-tight text-slate-950">
            {question.text.trim() || 'Untitled question'}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onRemove(question.id)}
          className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Remove
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600">Question text</span>
          <input
            type="text"
            value={question.text}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onUpdate(question.id, (current) => ({ ...current, text: event.target.value }));
            }}
            placeholder="Write the question prompt"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-600">Question type</span>

          <div className="relative">
            <select
              value={question.type}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                const nextType = event.target.value as QuestionType;
                onUpdate(question.id, (current) => syncQuestionType(current, nextType));
              }}
              className="appearance-none cursor-pointer w-full rounded-2xl border border-slate-200 bg-white pl-4 pr-12 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
            >
              {questionTypeOptions.map((option) => (
                <option className="cursor-pointer" key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        {descriptionForType(question.type)}
      </div>

      {question.type === 'BOOLEAN' ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {['True', 'False'].map((option) => {
            const isSelected = question.correctAnswer === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onUpdate(question.id, (current) => ({ ...current, correctAnswer: option }));
                }}
                className={`cursor-pointer flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? 'border-emerald-200 bg-emerald-100 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
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
              </button>
            );
          })}
        </div>
      ) : null}

      {question.type === 'INPUT' ? (
        <label className="mt-6 grid gap-2">
          <span className="text-sm font-medium text-slate-600">Correct answer</span>
          <input
            type="text"
            value={question.correctAnswer}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onUpdate(question.id, (current) => ({
                ...current,
                correctAnswer: event.target.value,
              }));
            }}
            placeholder="Short answer for the mocked structure"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
          />
        </label>
      ) : null}

      {question.type === 'CHECKBOX' ? (
        <div className="mt-6 grid gap-3">
          {question.options.map((option, optionIndex) => {
            const isSelected = question.correctAnswers.includes(option);

            return (
              <div
                key={`${question.id}-${optionIndex}`}
                className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
              >
                <label className="grid gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Option {optionIndex + 1}
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      onChangeOption(question.id, optionIndex, event.target.value);
                    }}
                    placeholder="Option text"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => onToggleCorrectOption(question.id, optionIndex)}
                  className={`cursor-pointer mt-6 inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? 'border-emerald-200 bg-emerald-100 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-950'
                  }`}
                >
                  Correct
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveOption(question.id, optionIndex)}
                  disabled={question.options.length === 1}
                  className="cursor-pointer mt-6 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Keep at least two options and mark one or more as correct.
            </p>
            <SoftButton
              type="button"
              onClick={() => onAddOption(question.id)}
              className="px-4 py-2 text-sm font-medium"
            >
              Add option
            </SoftButton>
          </div>
        </div>
      ) : null}
    </article>
  );
}
