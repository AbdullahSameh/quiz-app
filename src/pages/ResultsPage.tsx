import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { motion } from 'framer-motion';
import { 
  Award, CheckCircle, XCircle, Clock, 
  BarChart3, ChevronRight, TrendingUp
} from 'lucide-react';
import Confetti from '../components/common/Confetti';
import { Question, QuizAnswer } from '../types';

const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getResultById, getQuizById } = useQuiz();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Get result and quiz data
  const result = id ? getResultById(id) : undefined;
  const quiz = result ? getQuizById(result.quizId) : undefined;
  
  useEffect(() => {
    // If result doesn't exist, redirect to home
    if (!result || !quiz) {
      navigate('/explore', { replace: true });
    } else if (result.score / result.totalQuestions >= 0.7) {
      // Show confetti for scores >= 70%
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [result, quiz, navigate]);
  
  if (!result || !quiz) return null;
  
  // Calculate statistics
  const scorePercent = Math.round((result.score / result.totalQuestions) * 100);
  const timeSpentMinutes = Math.floor(result.timeSpent / 60);
  const timeSpentSeconds = result.timeSpent % 60;
  const formattedTime = `${timeSpentMinutes}m ${timeSpentSeconds}s`;
  
  // Determine performance message
  let performanceMessage = '';
  if (scorePercent >= 90) {
    performanceMessage = 'Outstanding! You\'re a true expert!';
  } else if (scorePercent >= 70) {
    performanceMessage = 'Great job! You know your stuff!';
  } else if (scorePercent >= 50) {
    performanceMessage = 'Good effort! Keep learning and try again!';
  } else {
    performanceMessage = 'Keep studying! You\'ll do better next time!';
  }

  const renderAnswerDetails = (question: Question, answer: QuizAnswer) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="text-sm">
            <p className="mb-1">
              <span className="text-gray-600">Your answer: </span>
              <span className={`font-medium ${answer.correct ? 'text-green-600' : 'text-red-600'}`}>
                {answer.selectedAnswer !== undefined && answer.selectedAnswer >= 0 
                  ? question.options[answer.selectedAnswer]
                  : 'No answer provided'}
              </span>
            </p>
            
            {!answer.correct && (
              <p className="text-gray-600">
                <span>Correct answer: </span>
                <span className="font-medium text-green-600">
                  {question.options[question.correctAnswer]}
                </span>
              </p>
            )}
          </div>
        );

      case 'fill-in-blank':
        return (
          <div className="text-sm">
            <p className="mb-1">
              <span className="text-gray-600">Your answer: </span>
              <span className={`font-medium ${answer.correct ? 'text-green-600' : 'text-red-600'}`}>
                {answer.textAnswer || 'No answer provided'}
              </span>
            </p>
            
            {!answer.correct && (
              <p className="text-gray-600">
                <span>Correct answers: </span>
                <span className="font-medium text-green-600">
                  {question.correctAnswers.join(', ')}
                </span>
              </p>
            )}
          </div>
        );

      case 'match':
        return (
          <div className="text-sm">
            <p className="text-gray-600 mb-2">Your matches:</p>
            {answer.matches?.map((match, index) => (
              <div key={index} className="ml-4 text-gray-600">
                • {question.leftItems[match.left]} → {question.rightItems[match.right]}
              </div>
            )) || <p className="ml-4 text-gray-500">No matches provided</p>}
          </div>
        );

      case 'drag-drop':
        return (
          <div className="text-sm">
            <p className="text-gray-600 mb-2">Your placements:</p>
            {answer.placements?.map((placement, index) => (
              <div key={index} className="ml-4 text-gray-600">
                • {question.items[placement.item]} → {question.dropZones[placement.zone]}
              </div>
            )) || <p className="ml-4 text-gray-500">No placements provided</p>}
          </div>
        );

      case 'dropdown':
        return (
          <div className="text-sm">
            <p className="text-gray-600 mb-2">Your selections:</p>
            {answer.dropdownAnswers?.map((dropdownAnswer, index) => {
              const dropdown = question.dropdowns.find(d => d.id === dropdownAnswer.id);
              return (
                <div key={index} className="ml-4 text-gray-600">
                  • {dropdown?.options[dropdownAnswer.answer] || 'No selection'}
                </div>
              );
            }) || <p className="ml-4 text-gray-500">No selections provided</p>}
          </div>
        );

      case 'labeling':
        return (
          <div className="text-sm">
            <p className="text-gray-600 mb-2">Labels placed:</p>
            {answer.labelPlacements?.map((placement, index) => (
              <div key={index} className="ml-4 text-gray-600">
                • {question.labels[placement.label]}
              </div>
            )) || <p className="ml-4 text-gray-500">No labels placed</p>}
          </div>
        );

      default:
        return <p className="text-sm text-gray-500">Answer details not available</p>;
    }
  };
  
  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full mb-4"
              >
                <Award className="h-12 w-12 text-primary-600" />
              </motion.div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Quiz Completed!</h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-1">{quiz.title}</h2>
              <p className="text-gray-600 mb-2">{new Date(result.date).toLocaleDateString()}</p>
              <p className="text-lg font-medium text-gray-800">{performanceMessage}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <BarChart3 className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Score</p>
                <p className="text-2xl font-bold">
                  {result.score}/{result.totalQuestions}
                </p>
                <p className="text-lg font-medium text-primary-600">{scorePercent}%</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Clock className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Time Spent</p>
                <p className="text-2xl font-bold">{formattedTime}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <TrendingUp className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Performance</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      scorePercent >= 70 ? 'bg-green-500' : 
                      scorePercent >= 40 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${scorePercent}%` }}
                  ></div>
                </div>
                <p className="text-sm font-medium">
                  {scorePercent >= 70 ? 'Excellent' : 
                   scorePercent >= 40 ? 'Good' : 
                   'Needs improvement'}
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Question Review</h3>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const answer = result.answers.find(a => a.questionId === question.id);
                
                return (
                  <motion.div 
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start">
                      {answer?.correct ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium">{question.text}</p>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {question.type.replace('-', ' ')}
                          </span>
                        </div>
                        {answer && renderAnswerDetails(question, answer)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              to={`/quiz/${quiz.id}`}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md text-center hover:bg-primary-700 transition-colors"
            >
              Retake Quiz
            </Link>
            <Link 
              to="/explore"
              className="px-6 py-3 bg-white text-primary-600 font-medium rounded-md text-center border border-primary-200 hover:bg-primary-50 transition-colors"
            >
              Find More Quizzes
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ResultsPage;