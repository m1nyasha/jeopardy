import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGameState, playerAnswer, GameState, Player } from '../api'
import '../styles/PlayerGame.css'

const POLLING_INTERVAL = 1000

export default function PlayerGame() {
  const { playerId } = useParams<{ playerId: string }>()
  const navigate = useNavigate()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [answering, setAnswering] = useState(false)
  const [message, setMessage] = useState('')

  const playerIdNum = parseInt(playerId || '0')

  useEffect(() => {
    const fetchState = async () => {
      try {
        const { data } = await getGameState()
        setGameState(data)
        
        const currentPlayer = data.players.find((p: Player) => p.id === playerIdNum)
        if (currentPlayer) {
          setPlayer(currentPlayer)
        } else {
          navigate('/play')
        }
      } catch (err) {
        console.error('Failed to fetch state')
      }
    }

    fetchState()
    const interval = setInterval(fetchState, POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [playerIdNum, navigate])

  const handleAnswer = async () => {
    if (answering) return
    setAnswering(true)
    setMessage('')

    try {
      const { data } = await playerAnswer(playerIdNum)
      if (!data.success) {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Ошибка при отправке ответа')
    } finally {
      setAnswering(false)
    }
  }

  if (!gameState || !player) {
    return (
      <div className="player-game">
        <div className="loading">
          <div className="loading-spinner">🎄</div>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  const isQuestionActive = gameState.status === 'question' || gameState.status === 'answering'
  const isCurrentlyAnswering = gameState.currentPlayerId === playerIdNum
  const hasFailed = gameState.failedPlayerIds.includes(playerIdNum)
  const answerShown = gameState.showAnswer
  const canAnswer = gameState.status === 'question' && !hasFailed && !answerShown

  return (
    <div className="player-game">
      <header className="player-header">
        <div className="player-info">
          <span className="player-name">{player.name}</span>
          <span className="player-score">{player.score} очков</span>
        </div>
      </header>

      <main className="player-content">
        {gameState.isGameOver ? (
          <div className="game-over-player">
            <h2>🎉 Игра окончена!</h2>
            <p>Смотрите результаты на главном экране</p>
            <div className="final-score">
              <span>Ваш результат:</span>
              <strong>{player.score} очков</strong>
            </div>
          </div>
        ) : isQuestionActive ? (
          <div className="question-section">
            {gameState.currentQuestion && (
              <div className="question-info">
                <span className="question-points">{gameState.currentQuestion.points} очков</span>
              </div>
            )}

            {answerShown ? (
              <div className="answer-shown">
                <div className="answer-icon">✅</div>
                <h2>Ответ показан</h2>
                <p>Смотрите на главный экран</p>
              </div>
            ) : isCurrentlyAnswering ? (
              <div className="answering-now">
                <div className="answering-icon">🎤</div>
                <h2>Вы отвечаете!</h2>
                <p>Дайте свой ответ вслух</p>
              </div>
            ) : gameState.status === 'answering' ? (
              <div className="other-answering">
                <div className="wait-icon">⏳</div>
                <h2>Сейчас отвечает другой игрок</h2>
                <p>{gameState.currentPlayer?.name} даёт ответ</p>
              </div>
            ) : hasFailed ? (
              <div className="already-failed">
                <div className="failed-icon">❌</div>
                <h2>Вы уже отвечали</h2>
                <p>Дождитесь следующего вопроса</p>
              </div>
            ) : (
              <button 
                className="answer-button" 
                onClick={handleAnswer}
                disabled={answering || !canAnswer}
              >
                <span className="answer-button-text">
                  {answering ? '⏳' : '🔔'} ОТВЕТИТЬ
                </span>
              </button>
            )}

            {message && <div className="answer-message">{message}</div>}
          </div>
        ) : (
          <div className="waiting-section">
            <div className="waiting-icon">🎄</div>
            <h2>Ожидание вопроса</h2>
            <p>Следите за главным экраном</p>
          </div>
        )}
      </main>
    </div>
  )
}

