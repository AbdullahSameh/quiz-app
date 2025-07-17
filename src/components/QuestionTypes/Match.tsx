import React, { useState } from 'react'
import { MatchQuestion as MQuestion, MatchAnswer } from '../../types/core'
import { ArrowRight } from 'lucide-react'

interface MatchQuestionProps {
  question: MQuestion
  selectedMatches: MatchAnswer
  onMatchesChange: (matches: MatchAnswer) => void
  // disabled?: boolean;
}

const Match: React.FC<MatchQuestionProps> = ({ question, selectedMatches, onMatchesChange }) => {
  // State to track selected left item
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)

  const currentMatches = selectedMatches?.matched_pairs || []

  const handleLeftClick = (leftIndex: number) => {
    setSelectedLeft(leftIndex)
  }

  const handleRightClick = (rightIndex: number) => {
    if (selectedLeft === null) return

    const newMatches = currentMatches.filter((match) => match.left_id !== selectedLeft && match.right_id !== rightIndex)
    newMatches.push({ left_id: selectedLeft, right_id: rightIndex })

    onMatchesChange({ question_id: question.id, matched_pairs: newMatches })
    setSelectedLeft(null)
  }

  const getMatchForLeft = (leftIndex: number) => {
    return currentMatches.find((match) => match.left_id === leftIndex)
  }

  const getMatchForRight = (rightIndex: number) => {
    return currentMatches.find((match) => match.right_id === rightIndex)
  }

  return (
    <div className="space-y-6">
      <p className="mb-4 text-sm text-gray-600">Click an item on the left, then click its match on the right to connect them.</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-3">
          <h4 className="mb-3 font-medium text-gray-700">Items</h4>
          {question.left_items.map((item, index) => {
            const match = getMatchForLeft(index)
            const isSelected = selectedLeft === index
            const isMatched = !!match

            return (
              <button
                key={index}
                onClick={() => handleLeftClick(index)}
                disabled={false}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : isMatched
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'hover:border-primary-200 border-gray-200 hover:bg-gray-50'
                } ${false ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span>{item}</span>
                  {isMatched && <ArrowRight className="h-4 w-4 text-green-600" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h4 className="mb-3 font-medium text-gray-700">Matches</h4>
          {question.right_items.map((item, index) => {
            const match = getMatchForRight(index)
            const isMatched = !!match

            return (
              <button
                key={index}
                onClick={() => handleRightClick(index)}
                disabled={selectedLeft === null}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  isMatched
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : selectedLeft !== null
                      ? 'border-primary-200 hover:border-primary-300 hover:bg-primary-50'
                      : 'border-gray-200 bg-gray-50'
                } ${false ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {/* Current Matches Display */}
      {currentMatches.length > 0 && (
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <h5 className="mb-2 font-medium text-gray-700">Current Matches:</h5>
          <div className="space-y-1">
            {currentMatches.map((match, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{question.left_items[match.left_id]}</span>
                <ArrowRight className="mx-2 h-3 w-3" />
                <span>{question.right_items[match.right_id]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Match
