import React from 'react'
import { MultipleChoiceQuestion, MultipleChoiceAnswer } from '../../types/core'

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion
  selectedAnswer?: any
  onAnswerChange: (answer: MultipleChoiceAnswer) => void
  // disabled: boolean
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ question, selectedAnswer, onAnswerChange }) => {
  return (
    <div className="space-y-3">
      {question.options.map((option, index) => (
        <button
          onClick={() => onAnswerChange({ question_id: question.id, selected_option: option })}
          key={index}
          disabled={false}
          className={`w-full rounded-lg border p-4 text-left transition-all ${
            selectedAnswer?.selected_option == option
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'hover:border-primary-200 border-gray-200 hover:bg-gray-50'
          } ${false ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <div className="flex items-start">
            <div
              className={`mr-3 h-5 w-5 flex-shrink-0 rounded-full border ${
                selectedAnswer?.selected_option == option ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
              } mt-0.5 flex items-center justify-center`}
            >
              {selectedAnswer?.selected_option == option && <div className="h-2 w-2 rounded-full bg-white"></div>}
            </div>
            <span>{option}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
export default MultipleChoice
