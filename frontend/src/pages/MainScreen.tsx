import { useEffect, useState } from 'react'
import Snowfall from 'react-snowfall'
import { getGameState, GameState } from '../api'
import GameBoard from '../components/GameBoard'
import QuestionDisplay from '../components/QuestionDisplay'
import PlayerList from '../components/PlayerList'
import GameOver from '../components/GameOver'
import '../styles/MainScreen.css'

const POLLING_INTERVAL = 100

export default function MainScreen() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchState = async () => {
      try {
        const { data } = await getGameState()
        setGameState(data)
        setError('')
      } catch (err) {
        setError('Не удалось загрузить состояние игры')
      }
    }

    fetchState()
    const interval = setInterval(fetchState, POLLING_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div className="main-screen">
        <div className="error-container">
          <h2>❄️ Ошибка</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="main-screen">
        <div className="loading">
          <div className="loading-spinner">🎄</div>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  const isQuestionActive = gameState.status === 'question' || gameState.status === 'answering'

  return (
    <div className="main-screen">
      <Snowfall 
        snowflakeCount={150}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      />
      <header className="main-header">
        <div className="logo-container">
          <span className="logo-icon">🎄</span>
          <h1 className="logo-text">Своя Игра</h1>
          <span className="logo-subtitle">Новогодний выпуск</span>
        </div>
      </header>

      <main className="main-content">
        {gameState.isGameOver ? (
          <GameOver players={gameState.players} />
        ) : isQuestionActive && gameState.currentQuestion ? (
          <QuestionDisplay 
            question={gameState.currentQuestion}
            showAnswer={gameState.showAnswer}
            currentPlayer={gameState.currentPlayer}
            status={gameState.status}
          />
        ) : (
          <GameBoard categories={gameState.categories} />
        )}
      </main>

      <footer className="main-footer">
        <PlayerList 
          players={gameState.players}
          currentPlayerId={gameState.currentPlayerId}
          failedPlayerIds={gameState.failedPlayerIds}
        />
      </footer>
    </div>
  )
}
