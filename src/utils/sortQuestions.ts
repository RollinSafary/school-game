import { QuestionsData } from "../types/questions";

export function sortAndValidateQuestions(data: QuestionsData): QuestionsData {
  // Sort categories by ID
  const sortedCategories = [...data.categories].sort((a, b) => a.id - b.id);

  // Check for duplicate category IDs
  const categoryIds = new Set<number>();
  for (const category of sortedCategories) {
    if (categoryIds.has(category.id)) {
      throw new Error(`Duplicate category ID found: ${category.id}`);
    }
    categoryIds.add(category.id);
  }

  // Sort questions by ID
  const sortedQuestions = [...data.questions].sort((a, b) => a.id - b.id);

  // Check for duplicate question IDs
  const questionIds = new Set<number>();
  for (const question of sortedQuestions) {
    if (questionIds.has(question.id)) {
      throw new Error(`Duplicate question ID found: ${question.id}`);
    }
    questionIds.add(question.id);

    // Validate category ID
    if (!categoryIds.has(question.categoryId)) {
      throw new Error(
        `Invalid category ID ${question.categoryId} in question ${question.id}`
      );
    }
  }

  return {
    categories: sortedCategories,
    questions: sortedQuestions,
  };
}
