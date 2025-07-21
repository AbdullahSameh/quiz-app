import React from 'react'
import { DropDownQuestion as DDQuestion, DropDownAnswer } from '../../types/core'

interface DropDownProps {
  question: DDQuestion
  selectedAnswer?: any
  onAnswerChange: (answer: DropDownAnswer) => void
  // disabled?: boolean
}

const DropDown: React.FC<DropDownProps> = ({ question, selectedAnswer, onAnswerChange }) => {
  const renderSentenceWithDropdowns = () => {
    const parts = question.sentence.split('___')

    const result: React.ReactNode[] = []

    parts.forEach((part, index) => {
      result.push(
        <span key={`text-${index}`} className="inline-flex text-lg">
          {part}
        </span>,
      )

      if (index < parts.length - 1 && index < question.dropdowns.length) {
        const dropdown = question.dropdowns[index]
        const selectedAnswer = getAnswerForDropdown(dropdown.id)

        result.push(
          <select
            key={`dropdown-${index}`}
            value={selectedAnswer}
            onChange={(e) => handleDropdownChange(dropdown.id, parseInt(e.target.value))}
            disabled={false}
            className={`focus:ring-primary-400 mx-2 rounded-md border border-gray-300 px-3 py-1 focus:ring-2 focus:outline-none ${
              false ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <option value={-1}>Select...</option>
            {dropdown.options.map((option, optionIndex) => (
              <option key={optionIndex} value={optionIndex}>
                {option}
              </option>
            ))}
          </select>,
        )
      }
    })
    return result
  }

  const currentAnswers = selectedAnswer?.dropdown_res || []

  const handleDropdownChange = (dropdownId: number | string, selectedIndex: number) => {
    const newAnswers = currentAnswers.filter((a: any) => a.id !== dropdownId)
    if (selectedIndex >= 0) {
      newAnswers.push({ dropdown_id: dropdownId, value: selectedIndex })
    }
    onAnswerChange({ dropdown_res: newAnswers })
  }

  const getAnswerForDropdown = (dropdownId: number | string) => {
    const answer = currentAnswers.find((a: any) => a.dropdown_id === dropdownId)
    return answer ? answer.value : -1 // Return -1 if no answer is found
  }

  return (
    <div className="space-y-4">
      <div className="text-lg leading-relaxed">{renderSentenceWithDropdowns()}</div>
      <div className="text-sm text-gray-600">
        <p>Fill in the blanks by selecting the appropriate options from the dropdown menus.</p>
      </div>
    </div>
  )
}

export default DropDown
