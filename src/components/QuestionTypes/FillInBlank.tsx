import React from 'react'
import { FillInBlankQuestion as FIBQuestion, FillInBlankAnswer } from '../../types/core'

interface FIBQuestionProps {
  question: FIBQuestion
  selectedAnswer?: any
  onAnswerChange: (answer: FillInBlankAnswer) => void
  // disabled?: boolean
}

const FillInBlank: React.FC<FIBQuestionProps> = ({ question, selectedAnswer, onAnswerChange }) => {
  const currentAnswers = selectedAnswer || []

  const handleDropdownChange = (blankIndex: number, value: string) => {
    const newAnswers = currentAnswers.filter((a: any) => a.blank_id !== blankIndex)
    if (value.trim() !== '') {
      newAnswers.push({ blank_id: blankIndex, value })
    }
    onAnswerChange(newAnswers)
  }

  const getAnswerForDropdown = (blankIndex: number): string => {
    const answer = currentAnswers.find((a: any) => a.blank_id === blankIndex)
    return answer ? answer.value : ''
  }

  return (
    <div className="space-y-4">
      <div className="text-lg leading-relaxed">
        {question.text.split('___').map((part, index, array) => (
          <React.Fragment key={index}>
            {part}
            {index < array.length - 1 && (
              <input
                type="text"
                value={getAnswerForDropdown(index)}
                onChange={(e) => handleDropdownChange(index, e.target.value)}
                disabled={false}
                className={`border-primary-300 focus:border-primary-500 mx-2 inline-block min-w-[120px] border-b-2 bg-transparent px-3 py-1 text-center focus:outline-none ${
                  false ? 'cursor-not-allowed opacity-50' : ''
                }`}
                placeholder="Type your answer"
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {question.case_sensitive === false && <p className="text-sm text-gray-600 italic">Note: This answer is not case-sensitive</p>}
    </div>
  )
}

export default FillInBlank
