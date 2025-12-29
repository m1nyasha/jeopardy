import { Routes, Route } from 'react-router-dom'
import MainScreen from './pages/MainScreen'
import PlayerLogin from './pages/PlayerLogin'
import PlayerGame from './pages/PlayerGame'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/play" element={<PlayerLogin />} />
        <Route path="/player/:playerId" element={<PlayerGame />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
      </Routes>
    </div>
  )
}

export default App

