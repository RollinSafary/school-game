export interface Option {
  id: number;
  title: string;
  description?: string;
}

export interface Question {
  id: number;
  categoryId: number;
  question: string;
  options: Option[];
  rightAnswerIndex: number;
}

export interface Category {
  id: number;
  title: string;
}

export interface QuestionsData {
  categories: Category[];
  questions: Question[];
}
