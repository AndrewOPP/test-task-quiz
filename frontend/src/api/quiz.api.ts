export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export type QuizListItem = {
  id: string;
  title: string;
  questionsCount: number;
};

export type QuizQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswers: string[] | null;
  quizId?: string;
  createdAt?: string;
};

export type QuizDetail = {
  id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
};

export type CreateQuizQuestionInput = {
  text: string;
  type: QuestionType;
  options: string[] | null;
  correctAnswers: string[] | null;
};

export type CreateQuizInput = {
  title: string;
  questions: CreateQuizQuestionInput[];
};

export type DeleteQuizResult = {
  message: string;
};

const DEFAULT_API_BASE_URL = 'http://localhost:3002';

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
}

function buildApiUrl(pathname: string) {
  return new URL(pathname, `${getApiBaseUrl()}/`).toString();
}

function readErrorMessage(responseBody: string, status: number) {
  if (!responseBody) {
    return `Request failed with status ${status}`;
  }

  try {
    const parsedBody = JSON.parse(responseBody) as { message?: string | string[] };

    if (Array.isArray(parsedBody.message)) {
      return parsedBody.message.join(', ');
    }

    if (typeof parsedBody.message === 'string') {
      return parsedBody.message;
    }
  } catch {
    return responseBody;
  }

  return `Request failed with status ${status}`;
}

async function requestJson<TResponse>(pathname: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(buildApiUrl(pathname), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const responseBody = await response.text();

  if (!response.ok) {
    throw new Error(readErrorMessage(responseBody, response.status));
  }

  if (!responseBody) {
    return undefined as TResponse;
  }

  return JSON.parse(responseBody) as TResponse;
}

export async function getQuizzes() {
  return requestJson<QuizListItem[]>('/quizzes');
}

export async function getQuizById(quizId: string) {
  return requestJson<QuizDetail>(`/quizzes/${encodeURIComponent(quizId)}`);
}

export async function createQuiz(payload: CreateQuizInput) {
  return requestJson<QuizDetail>('/quizzes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteQuiz(quizId: string) {
  return requestJson<DeleteQuizResult>(`/quizzes/${encodeURIComponent(quizId)}`, {
    method: 'DELETE',
  });
}
