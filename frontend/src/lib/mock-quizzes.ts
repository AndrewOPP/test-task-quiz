export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export type DraftQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  correctAnswer: string;
  options: string[];
  correctAnswers: string[];
};

export type StoredQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswers: string[] | null;
};

export type StoredQuiz = {
  id: string;
  title: string;
  questions: StoredQuestion[];
  createdAt: string;
  updatedAt: string;
};

export const questionTypeOptions: Array<{
  value: QuestionType;
  label: string;
  description: string;
}> = [
  {
    value: 'BOOLEAN',
    label: 'Boolean',
    description: 'True / False structure for fast checks.',
  },
  {
    value: 'INPUT',
    label: 'Input',
    description: 'A short text answer for open-response prompts.',
  },
  {
    value: 'CHECKBOX',
    label: 'Checkbox',
    description: 'Several possible answers with multiple correct choices.',
  },
];

export const questionTypeLabels: Record<QuestionType, string> = {
  BOOLEAN: 'Boolean',
  INPUT: 'Input',
  CHECKBOX: 'Checkbox',
};

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeCorrectAnswers(options: string[], selectedAnswers: string[]) {
  const availableOptions = options.map((option) => option.trim()).filter(Boolean);
  const selected = selectedAnswers.filter((answer) => availableOptions.includes(answer));

  if (selected.length > 0) {
    return selected;
  }

  return availableOptions.length > 0 ? [availableOptions[0]] : [];
}

function buildStoredQuestion(question: DraftQuestion): StoredQuestion {
  if (question.type === 'BOOLEAN') {
    return {
      id: question.id,
      text: question.text.trim(),
      type: question.type,
      options: ['True', 'False'],
      correctAnswers: [question.correctAnswer === 'False' ? 'False' : 'True'],
    };
  }

  if (question.type === 'INPUT') {
    return {
      id: question.id,
      text: question.text.trim(),
      type: question.type,
      options: null,
      correctAnswers: question.correctAnswer.trim() ? [question.correctAnswer.trim()] : [],
    };
  }

  const options = question.options.map((option) => option.trim()).filter(Boolean);

  return {
    id: question.id,
    text: question.text.trim(),
    type: question.type,
    options,
    correctAnswers: normalizeCorrectAnswers(options, question.correctAnswers),
  };
}

export function createDraftQuestion(type: QuestionType = 'BOOLEAN'): DraftQuestion {
  const id = createId('draft-question');

  if (type === 'BOOLEAN') {
    return {
      id,
      text: '',
      type,
      correctAnswer: 'True',
      options: ['True', 'False'],
      correctAnswers: [],
    };
  }

  if (type === 'INPUT') {
    return {
      id,
      text: '',
      type,
      correctAnswer: '',
      options: [],
      correctAnswers: [],
    };
  }

  return {
    id,
    text: '',
    type,
    correctAnswer: '',
    options: ['Option 1', 'Option 2'],
    correctAnswers: ['Option 1'],
  };
}

export function normalizeCheckboxCorrectAnswers(options: string[], selectedAnswers: string[]) {
  return normalizeCorrectAnswers(options, selectedAnswers);
}

export function createStoredQuiz(title: string, questions: DraftQuestion[]): StoredQuiz {
  const timestamp = new Date().toISOString();

  return {
    id: createId('quiz'),
    title,
    questions: questions.map(buildStoredQuestion),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
