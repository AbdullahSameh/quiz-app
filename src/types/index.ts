export interface Category {
  id: string | number
  name: string
  description: string
  icon: string
  color: string
  quiz_count?: number
}

export interface BaseQuestion {
  id: string
  text: string
  timeLimit?: number
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice'
  options: string[]
  correctAnswer: number
}

export interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill-in-blank'
  correctAnswers: string[] // Multiple possible correct answers
  caseSensitive?: boolean
}

export interface MatchQuestion extends BaseQuestion {
  type: 'match'
  leftItems: string[]
  rightItems: string[]
  correctMatches: { left: number; right: number }[] // Index pairs
}

export interface DragDropQuestion extends BaseQuestion {
  type: 'drag-drop'
  items: string[]
  dropZones: string[]
  correctPlacements: { item: number; zone: number }[] // Index pairs
}

export interface DropDownQuestion extends BaseQuestion {
  type: 'dropdown'
  sentence: string // Sentence with placeholders like "The capital of France is ___"
  dropdowns: {
    id: string
    options: string[]
    correctAnswer: number
  }[]
}

export interface LabelingQuestion extends BaseQuestion {
  type: 'labeling'
  imageUrl: string
  labels: string[]
  labelPositions: { x: number; y: number; correctLabel: number }[] // Positions and correct label index
}

export type Question = MultipleChoiceQuestion | FillInBlankQuestion | MatchQuestion | DragDropQuestion | DropDownQuestion | LabelingQuestion

export interface Quiz {
  id: string
  title: string
  description: string
  categoryId: string
  difficulty: 'easy' | 'medium' | 'hard'
  questions: Question[]
  timeLimit: number // Total time limit in seconds
}

export interface QuizAnswer {
  questionId: string
  questionType: Question['type']
  selectedAnswer?: number // For multiple choice
  textAnswer?: string // For fill in blank
  matches?: { left: number; right: number }[] // For match questions
  placements?: { item: number; zone: number }[] // For drag drop
  dropdownAnswers?: { id: string; answer: number }[] // For dropdown
  labelPlacements?: { x: number; y: number; label: number }[] // For labeling
  correct: boolean
  timeSpent: number
}

export interface QuizResult {
  id: string
  quizId: string
  date: number // timestamp
  score: number
  totalQuestions: number
  timeSpent: number // in seconds
  answers: QuizAnswer[]
}
