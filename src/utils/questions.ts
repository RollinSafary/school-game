import { Question, Category } from "../types/questions";

interface QuestionsData {
  categories: Category[];
  questions: Question[];
}

// Initial empty state
let questionsData: QuestionsData = {
  categories: [],
  questions: [],
};

// Flag to track if data is loaded
let isDataLoaded = false;

// Load questions data from the public folder
const loadQuestionsData = async (): Promise<void> => {
  try {
    const response = await fetch("/questions.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    questionsData = await response.json();
    isDataLoaded = true;
  } catch (error) {
    console.error("Error loading questions data:", error);
  }
};

// Initialize loading of questions
loadQuestionsData();

// Helper function to ensure questions are loaded
const ensureDataLoaded = (): boolean => {
  if (!isDataLoaded) {
    console.warn("Questions data is not yet loaded. Returning empty result.");
    return false;
  }
  return true;
};

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
  if (!ensureDataLoaded()) return [];
  return questionsData.questions;
};

// Get shuffled questions
export const getShuffledQuestions = (): Question[] => {
  if (!ensureDataLoaded()) return [];
  return shuffleArray(getAllQuestions());
};

// Get questions by category
export const getQuestionsByCategory = (categoryId: number): Question[] => {
  if (!ensureDataLoaded()) return [];
  return questionsData.questions.filter((q) => q.categoryId === categoryId);
};

// Get question by ID
export const getQuestionById = (id: number): Question | undefined => {
  if (!ensureDataLoaded()) return undefined;
  return questionsData.questions.find((q) => q.id === id);
};

// Get category by ID
export const getCategoryById = (id: number): Category | undefined => {
  if (!ensureDataLoaded()) return undefined;
  return questionsData.categories.find((c) => c.id === id);
};

// Get all categories
export const getAllCategories = (): Category[] => {
  if (!ensureDataLoaded()) return [];
  return questionsData.categories;
};

// Function to reload questions (useful for testing or runtime updates)
export const reloadQuestions = async (): Promise<boolean> => {
  await loadQuestionsData();
  return isDataLoaded;
};

// Check if data is loaded
export const isQuestionsDataLoaded = (): boolean => {
  return isDataLoaded;
};
