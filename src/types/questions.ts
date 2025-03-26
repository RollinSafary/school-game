export interface Option {
  title: string;
  description?: string;
  audioUrl: string;
}

export interface Question {
  id: number;
  categoryId: number;
  question: string;
  options: Option[];
  rightAnswerIndex: number;
  audioUrl: string;
}

export interface Category {
  id: number;
  title: string;
  audioUrl: string;
}

export interface QuestionsData {
  categories: Category[];
  questions: Question[];
}
