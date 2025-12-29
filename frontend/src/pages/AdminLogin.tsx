import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../api'
import '../styles/AdminLogin.css'

export default function AdminLogin() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!login.trim() || !password.trim()) {
      setError('Введите логин и пароль')
      return
    }

    setLoading(true)
    setError('')

    try {
      await loginAdmin(login, password)
      navigate('/admin/panel')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-card">
        <div className="admin-header">
          <span className="admin-icon">🔐</span>
          <h1>Вход в админ-панель</h1>
          <p>Только для ведущего игры</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="input-group">
            <label>Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="admin"
              className="admin-input"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="admin-input"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="admin-button" disabled={loading}>
            {loading ? '⏳ Загрузка...' : '🎄 Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}

