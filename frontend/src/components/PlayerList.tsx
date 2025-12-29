import { Player } from '../api'
import '../styles/PlayerList.css'

interface Props {
  players: Player[]
  currentPlayerId: number | null
  failedPlayerIds: number[]
}

export default function PlayerList({ players, currentPlayerId, failedPlayerIds }: Props) {
  if (players.length === 0) {
    return (
      <div className="player-list-empty">
        <span>👥</span>
        <p>Игроки ещё не подключились</p>
      </div>
    )
  }

  return (
    <div className="player-list">
      <h3 className="player-list-title">Игроки</h3>
      <div className="players-grid">
        {players.map((player, index) => {
          const isAnswering = currentPlayerId === player.id
          const hasFailed = failedPlayerIds.includes(player.id)
          
          return (
            <div 
              key={player.id}
              className={`player-card ${isAnswering ? 'answering' : ''} ${hasFailed ? 'failed' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="player-rank">#{index + 1}</div>
              <div className="player-details">
                <span className="player-name">
                  {isAnswering && <span className="mic-icon">🎤</span>}
                  {player.name}
                </span>
                <span className={`player-score ${player.score < 0 ? 'negative' : ''}`}>
                  {player.score} очков
                </span>
              </div>
              {isAnswering && <div className="answering-badge">Отвечает</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

