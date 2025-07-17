import { faker } from '@faker-js/faker'
import { Question } from '../types/core' // adjust import if types are in same file

export function generateFakeQuestion(type: string): Question {
  switch (type) {
    case 'multiple_choice':
      return {
        type,
        id: faker.string.uuid(),
        text: faker.lorem.sentence(),
        time_limit: faker.number.int({ min: 120, max: 300 }),
        points: 1, // default points
        options: Array.from({ length: 4 }, () => faker.lorem.sentence(2)),
        correct_option: faker.number.int({ min: 0, max: 3 }),
        allow_multiple_answers: false, // faker.datatype.boolean(),
      }

    case 'fill_in_blank':
      return {
        type,
        id: faker.string.uuid(),
        text: 'The first President of the United States was ___.',
        time_limit: faker.number.int({ min: 120, max: 300 }),
        points: 1, // default points
        // blank_parts: Array.from({ length: 2 }, () => faker.word.noun()),
        correct_answers: Array.from({ length: 2 }, () => faker.word.noun()),
        case_sensitive: faker.datatype.boolean(),
      }

    case 'match':
      return {
        type,
        id: faker.string.uuid(),
        text: faker.lorem.sentence(),
        time_limit: faker.number.int({ min: 120, max: 300 }),
        points: 1, // default points
        left_items: Array.from({ length: 4 }, () => faker.word.noun()),
        right_items: Array.from({ length: 4 }, () => faker.word.noun()),
        correct_matches: Array.from({ length: 4 }, (_, i) => ({
          left: i,
          right: faker.number.int({ min: 0, max: 3 }),
        })),
      }

    case 'drag_drop':
      return {
        type,
        id: faker.string.uuid(),
        text: faker.lorem.sentence(),
        time_limit: faker.number.int({ min: 120, max: 300 }),
        points: 1, // default points
        items: Array.from({ length: 4 }, () => faker.word.noun()),
        drop_zones: Array.from({ length: 4 }, (_, i) => `${i + 1}st`),
        correct_placements: Array.from({ length: 4 }, (_, i) => ({
          item: i,
          zone: faker.number.int({ min: 0, max: 3 }),
        })),
      }

    case 'drop_down':
      return {
        type,
        id: faker.string.uuid(),
        text: faker.lorem.sentence(),
        time_limit: faker.number.int({ min: 120, max: 300 }),
        points: 1, // default points
        sentence: 'The ___ Wall fell in ___, marking the end of the Cold War era.',
        dropdowns: Array.from({ length: 2 }, () => ({
          id: faker.string.uuid(),
          options: Array.from({ length: 4 }, () => faker.lorem.word()),
          correct_option: faker.number.int({ min: 0, max: 3 }),
        })),
      }

    default:
      throw new Error(`Unsupported question type: ${type}`)
  }
}
