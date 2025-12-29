import { Question, Player } from '../api'
import '../styles/QuestionDisplay.css'

interface Props {
  question: Question
  showAnswer: boolean
  currentPlayer: Player | null
  status: 'question' | 'answering'
}

export default function QuestionDisplay({ question, showAnswer, currentPlayer, status }: Props) {
  return (
    <div className="question-display">
      <div className="question-meta">
        <span className="question-points-badge">{question.points}</span>
        <span className="points-label">очков</span>
      </div>

      <div className="question-card">
        {question.type === 'image' ? (
          <div className="question-image-container">
            <img 
              src={`/images/${question.question}`} 
              alt="Вопрос" 
              className="question-image"
            />
          </div>
        ) : (
          <div className="question-text-container">
            <p className="question-text">{question.question}</p>
          </div>
        )}
      </div>

      {status === 'answering' && currentPlayer && (
        <div className="answering-indicator">
          <span className="pulse-ring"></span>
          <span className="answering-text">
            🎤 Отвечает: <strong>{currentPlayer.name}</strong>
          </span>
        </div>
      )}

      {showAnswer && (
        <div className="answer-reveal">
          <div className="answer-label">Правильный ответ:</div>
          <div className="answer-text">{question.answer}</div>
        </div>
      )}
    </div>
  )
}

