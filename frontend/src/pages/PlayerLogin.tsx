import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { joinGame } from '../api'
import '../styles/PlayerLogin.css'

export default function PlayerLogin() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Пожалуйста, введите ваше имя')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data } = await joinGame(name.trim())
      navigate(`/player/${data.id}`)
    } catch (err: any) {
      setError('Ошибка при подключении к игре')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="player-login">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">🎮</span>
          <h1>Присоединиться к игре</h1>
          <p>Введите ваше имя, чтобы начать играть</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="login-input"
              maxLength={20}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '🎄 Загрузка...' : '🎅 Войти в игру'}
          </button>
        </form>

        <div className="login-hints">
          <p>💡 Если вы уже участвовали, введите то же имя для восстановления</p>
        </div>
      </div>
    </div>
  )
}

