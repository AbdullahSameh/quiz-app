import { Quiz } from '../types/core'
import { faker } from '@faker-js/faker'
import { generateFakeQuestion } from './fakerQuestionData'

export function generateFakeQuiz(): Quiz {
  const id = faker.string.uuid()
  const title = faker.lorem.sentence(5)
  const description = faker.lorem.paragraph(2)
  const category_id = faker.number.int({ min: 1, max: 6 }).toString() // Assuming categories are numbered 1-6
  const difficulty = faker.helpers.arrayElement(['easy', 'medium', 'hard'])
  const duration_limit = faker.number.int({ min: 300, max: 3600 }) // Duration limit in seconds
  const questionsCount = faker.number.int({ min: 5, max: 15 })

  return {
    id,
    title,
    description,
    category_id,
    difficulty,
    duration_limit,
    questions: Array.from({ length: questionsCount }, () =>
      generateFakeQuestion(faker.helpers.arrayElement(['multiple_choice', 'fill_in_blank', 'match', 'drag_drop', 'drop_down'])),
    ),
  }
}

export function generateFakeQuizzes(count: number): Quiz[] {
  return Array.from({ length: count }, () => generateFakeQuiz())
}

// This file generates fake quiz data for testing purposes
// Uncomment the following functions if you need to generate quizzes with specific properties

// export function generateFakeQuizWithQuestions(questionsCount: number): Quiz {
//   return {
//     ...generateFakeQuiz(),
//     questions: Array.from({ length: questionsCount }, () =>
//       generateFakeQuestion(faker.helpers.arrayElement(['multiple_choice', 'fill_in_blank', 'match', 'drag_drop', 'drop_down'])),
//     ),
//   }
// }
// export function generateFakeQuizzesWithQuestions(count: number, questionsCount: number): Quiz[] {
//   return Array.from({ length: count }, () => generateFakeQuizWithQuestions(questionsCount))
// }
// export function generateFakeQuizWithCategory(categoryId: string): Quiz {
//   return {
//     ...generateFakeQuiz(),
//     category_id: categoryId,
//     questions: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () =>
//       generateFakeQuestion(faker.helpers.arrayElement(['multiple_choice', 'fill_in_blank', 'match', 'drag_drop', 'drop_down'])),
//     ),
//   }
// }
// export function generateFakeQuizzesWithCategory(count: number, categoryId: string): Quiz[] {
//   return Array.from({ length: count }, () => generateFakeQuizWithCategory(categoryId))
// }
// export function generateFakeQuizWithDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Quiz {
//   return {
//     ...generateFakeQuiz(),
//     difficulty,
//     questions: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () =>
//       generateFakeQuestion(faker.helpers.arrayElement(['multiple_choice', 'fill_in_blank', 'match', 'drag_drop', 'drop_down'])),
//     ),
//   }
// }
// export function generateFakeQuizzesWithDifficulty(count: number, difficulty: 'easy' | 'medium' | 'hard'): Quiz[] {
//   return Array.from({ length: count }, () => generateFakeQuizWithDifficulty(difficulty))
// }
// export function generateFakeQuizWithDurationLimit(durationLimit: number): Quiz {
//   return {
//     ...generateFakeQuiz(),
//     duration_limit: durationLimit,
//     questions: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () =>
//       generateFakeQuestion(faker.helpers.arrayElement(['multiple_choice', 'fill_in_blank', 'match', 'drag_drop', 'drop_down'])),
//     ),
//   }
// }
// export function generateFakeQuizzesWithDurationLimit(count: number, durationLimit: number): Quiz[] {
//   return Array.from({ length: count }, () => generateFakeQuizWithDurationLimit(durationLimit))
// }
