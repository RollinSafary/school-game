import questionsData from "../data/questions.json";
import { Question } from "../types/questions";

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get all questions
export const getAllQuestions = (): Question[] => {
  return questionsData.questions;
};

// Get shuffled questions
export const getShuffledQuestions = (): Question[] => {
  return shuffleArray(getAllQuestions());
};

// Get questions by category
export const getQuestionsByCategory = (categoryId: number): Question[] => {
  return questionsData.questions.filter((q) => q.categoryId === categoryId);
};

// Get question by ID
export const getQuestionById = (id: number): Question | undefined => {
  return questionsData.questions.find((q) => q.id === id);
};

// Get category by ID
export const getCategoryById = (id: number) => {
  return questionsData.categories.find((c) => c.id === id);
};

// Get all categories
export const getAllCategories = () => {
  return questionsData.categories;
};
