import { useEffect, useState } from 'react'
import { 
  getGameState, 
  selectQuestion, 
  markCorrect, 
  markIncorrect, 
  showAnswer, 
  skipQuestion,
  resetGame,
  newGame,
  setPlayerScore,
  GameState,
  Player
} from '../api'
import '../styles/AdminPanel.css'

const POLLING_INTERVAL = 1000

export default function AdminPanel() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [scoreInput, setScoreInput] = useState('')
  const [showScoreModal, setShowScoreModal] = useState(false)

  useEffect(() => {
    const fetchState = async () => {
      try {
        const { data } = await getGameState()
        setGameState(data)
      } catch (err) {
        console.error('Failed to fetch state')
      }
    }

    fetchState()
    const interval = setInterval(fetchState, POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  const handleSelectQuestion = async (questionId: number) => {
    try {
      await selectQuestion(questionId)
    } catch (err) {
      console.error('Failed to select question')
    }
  }

  const handleMarkCorrect = async () => {
    try {
      await markCorrect()
    } catch (err) {
      console.error('Failed to mark correct')
    }
  }

  const handleMarkIncorrect = async () => {
    try {
      await markIncorrect()
    } catch (err) {
      console.error('Failed to mark incorrect')
    }
  }

  const handleShowAnswer = async () => {
    try {
      await showAnswer()
    } catch (err) {
      console.error('Failed to show answer')
    }
  }

  const handleSkipQuestion = async () => {
    try {
      await skipQuestion()
    } catch (err) {
      console.error('Failed to skip question')
    }
  }

  const handleResetGame = async () => {
    if (confirm('Сбросить все очки и начать заново?')) {
      try {
        await resetGame()
      } catch (err) {
        console.error('Failed to reset game')
      }
    }
  }

  const handleNewGame = async () => {
    if (confirm('Начать новую игру? Все игроки будут удалены!')) {
      try {
        await newGame()
      } catch (err) {
        console.error('Failed to start new game')
      }
    }
  }

  const openScoreModal = (player: Player) => {
    setSelectedPlayer(player)
    setScoreInput(player.score.toString())
    setShowScoreModal(true)
  }

  const handleSetScore = async () => {
    if (!selectedPlayer) return
    
    try {
      await setPlayerScore(selectedPlayer.id, parseInt(scoreInput) || 0)
      setShowScoreModal(false)
    } catch (err) {
      console.error('Failed to set score')
    }
  }

  if (!gameState) {
    return (
      <div className="admin-panel">
        <div className="loading">
          <div className="loading-spinner">🎄</div>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  const isQuestionActive = gameState.status === 'question' || gameState.status === 'answering'

  return (
    <div className="admin-panel">
      <header className="admin-panel-header">
        <h1>🎄 Панель управления</h1>
        <div className="admin-actions">
          <button onClick={handleResetGame} className="btn btn-warning">Сбросить</button>
          <button onClick={handleNewGame} className="btn btn-danger">Новая игра</button>
        </div>
      </header>

      <div className="admin-content">
        <section className="admin-section players-section">
          <h2>👥 Игроки</h2>
          <div className="players-list">
            {gameState.players.length === 0 ? (
              <p className="no-players">Пока никто не подключился</p>
            ) : (
              gameState.players.map(player => (
                <div 
                  key={player.id} 
                  className={`player-item ${gameState.currentPlayerId === player.id ? 'answering' : ''}`}
                >
                  <span className="player-name">{player.name}</span>
                  <span className="player-score">{player.score}</span>
                  <button 
                    onClick={() => openScoreModal(player)}
                    className="btn btn-small"
                  >
                    ✏️
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="admin-section game-section">
          {isQuestionActive && gameState.currentQuestion ? (
            <div className="active-question">
              <div className="question-header">
                <span className="question-category">{gameState.currentQuestion.category?.name}</span>
                <span className="question-points">{gameState.currentQuestion.points} очков</span>
              </div>

              <div className="question-content">
                {gameState.currentQuestion.type === 'image' ? (
                  <img 
                    src={`/images/${gameState.currentQuestion.question}`} 
                    alt="Question" 
                    className="question-image"
                  />
                ) : (
                  <p className="question-text">{gameState.currentQuestion.question}</p>
                )}
              </div>

              <div className="answer-box">
                <label>Правильный ответ:</label>
                <strong>{gameState.currentQuestion.answer}</strong>
              </div>

              {gameState.status === 'answering' && gameState.currentPlayer && (
                <div className="answering-player">
                  <span>🎤 Отвечает: <strong>{gameState.currentPlayer.name}</strong></span>
                  <div className="verdict-buttons">
                    <button onClick={handleMarkCorrect} className="btn btn-success">✓ Верно</button>
                    <button onClick={handleMarkIncorrect} className="btn btn-danger">✗ Неверно</button>
                  </div>
                </div>
              )}

              {gameState.status === 'question' && (
                <div className="waiting-answer">
                  <span>⏳ Ожидание ответа игрока...</span>
                  {gameState.failedPlayerIds.length > 0 && (
                    <p className="failed-info">
                      Уже ошиблись: {gameState.failedPlayerIds.length} игрок(ов)
                    </p>
                  )}
                </div>
              )}

              <div className="question-actions">
                <button onClick={handleShowAnswer} className="btn btn-gold" disabled={gameState.showAnswer}>
                  👁 Показать ответ
                </button>
                <button onClick={handleSkipQuestion} className="btn btn-secondary">
                  ➡ Следующий вопрос
                </button>
              </div>
            </div>
          ) : (
            <div className="question-board">
              <h2>📋 Выберите вопрос</h2>
              {gameState.isGameOver ? (
                <div className="game-over-admin">
                  <h3>🎉 Все вопросы закончились!</h3>
                  <p>Игра завершена. Результаты отображаются на главном экране.</p>
                </div>
              ) : (
                <div className="categories-grid">
                  {gameState.categories.map(category => (
                    <div key={category.id} className="category-column">
                      <h3 className="category-name">{category.name}</h3>
                      <div className="questions-list">
                        {category.questions.map(question => (
                          <button
                            key={question.id}
                            className={`question-btn ${question.isAnswered ? 'answered' : ''}`}
                            onClick={() => !question.isAnswered && handleSelectQuestion(question.id)}
                            disabled={question.isAnswered}
                          >
                            {question.points}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {showScoreModal && selectedPlayer && (
        <div className="modal-overlay" onClick={() => setShowScoreModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Изменить очки: {selectedPlayer.name}</h3>
            <input
              type="number"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              className="score-input"
            />
            <div className="modal-actions">
              <button onClick={handleSetScore} className="btn btn-success">Сохранить</button>
              <button onClick={() => setShowScoreModal(false)} className="btn btn-secondary">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
