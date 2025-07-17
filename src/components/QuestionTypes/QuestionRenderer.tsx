import React from 'react'
import { Question, Answer } from '../../types/core'
import MultipleChoice from './MultipleChoice'
import FillInBlank from './FillInBlank'
import Match from './Match'
import DragDrop from './DragDrop'
import DropDown from './DropDown'

interface QuestionRendererProps {
  question: Question
  selectedAnswer?: any
  onAnswerChange: (answer: Answer) => void
  // disabled?: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, selectedAnswer, onAnswerChange }) => {
  switch (question.type) {
    case 'multiple_choice':
      return <MultipleChoice question={question} selectedAnswer={selectedAnswer} onAnswerChange={onAnswerChange} />
    case 'fill_in_blank':
      return <FillInBlank question={question} selectedAnswer={selectedAnswer} onAnswerChange={onAnswerChange} />
    case 'match':
      return <Match question={question} selectedMatches={selectedAnswer} onMatchesChange={onAnswerChange} />
    case 'drag_drop':
      return <DragDrop question={question} selectedPlacements={selectedAnswer} onPlacementsChange={onAnswerChange} />
    case 'drop_down':
      return <DropDown question={question} selectedAnswer={selectedAnswer} onAnswerChange={onAnswerChange} />
    default:
      return <div>Unsupported question type</div>
  }
}

export default QuestionRenderer
