export interface Category {
  id: number | string
  name: string
  description: string
  icon: string
  color: string
}

export interface Quiz {
  id: number | string
  title: string
  description: string
  category_id: number | string
  difficulty: 'easy' | 'medium' | 'hard'
  duration_limit: number // in seconds
  questions: Question[]
}

export type QuestionType = 'multiple_choice' | 'fill_in_blank' | 'match' | 'drag_drop' | 'drop_down'

export type Question = MultipleChoiceQuestion | FillInBlankQuestion | MatchQuestion | DragDropQuestion | DropDownQuestion

export interface BaseQuestion {
  id: number | string
  text: string
  time_limit?: number // in seconds
  points?: number
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice'
  options: string[]
  correct_option: number // Index of the correct answer
  allow_multiple_answers?: boolean // Whether multiple answers can be selected
}

export interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill_in_blank'
  // blank_parts: string[] // Parts of the sentence with blanks
  correct_answers: string[] // Multiple possible correct answers
  case_sensitive?: boolean // Whether the answer is case-sensitive
}

export interface MatchQuestion extends BaseQuestion {
  type: 'match'
  left_items: string[] // Items on the left side
  right_items: string[] // Items on the right side
  correct_matches: { left: number; right: number }[] // Index pairs for correct matches
}

export interface DragDropQuestion extends BaseQuestion {
  type: 'drag_drop'
  items: string[] // Items to be dragged
  drop_zones: string[] // Zones where items can be dropped
  correct_placements: { item: number; zone: number }[] // Index pairs for correct placements
}

export interface DropDownQuestion extends BaseQuestion {
  type: 'drop_down'
  sentence: string // Sentence with placeholders like "The capital of France is ___"
  dropdowns: {
    id: number | string
    options: string[]
    correct_option: number // Index of the correct answer
  }[]
}

export type MultipleChoiceAnswer = {
  // question_id: number | string
  selected_option: number | string
}

export type FillInBlankAnswer = {
  // question_id: number | string
  blank_res: { blank_id: number; value: string }[]
}

export type MatchAnswer = {
  // question_id: number | string
  matched_pairs: { left_id: number; right_id: number }[]
}

export type DragDropAnswer = {
  // question_id: number | string
  drop_placements: { item_id: number; zone_id: number }[]
}

export type DropDownAnswer = {
  // question_id: number | string
  dropdown_res: { dropdown_id: number | string; value: number }[]
}

export type Answer = MultipleChoiceAnswer | FillInBlankAnswer | MatchAnswer | DragDropAnswer | DropDownAnswer

export interface QuizAnswer {
  question_id: number | string // ID of the question answered
  question_type: string // Type of the question answered
  answer: Answer // The answer provided by the user
  is_correct: boolean // Whether the answer was correct
  score: number // Points scored for this question
  // explanation?: string // Explanation for the correct answer
  // time_spent: number // Time spent on this question in seconds
}

export interface QuizResult {
  id: number | string
  quiz_id: number | string
  score: number // Total score achieved
  time_taken: number // Time taken to complete the quiz in seconds
  date_taken: string // ISO date string
  total_questions: number // Total number of questions in the quiz
  answers: QuizAnswer[] // List of answers provided by the user
}
