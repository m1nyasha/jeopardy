import { Player } from '../api'
import '../styles/GameOver.css'

interface Props {
  players: Player[]
}

export default function GameOver({ players }: Props) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="game-over">
      <div className="game-over-header">
        <h1>🎉 Игра окончена! 🎉</h1>
        <p>Поздравляем победителей!</p>
      </div>

      <div className="podium">
        {sortedPlayers.slice(0, 3).map((player, index) => (
          <div 
            key={player.id} 
            className={`podium-place place-${index + 1}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="medal">{medals[index]}</div>
            <div className="podium-name">{player.name}</div>
            <div className="podium-score">{player.score}</div>
            <div className="podium-bar"></div>
          </div>
        ))}
      </div>

      {sortedPlayers.length > 3 && (
        <div className="other-players">
          <h3>Остальные участники</h3>
          <div className="other-list">
            {sortedPlayers.slice(3).map((player, index) => (
              <div key={player.id} className="other-item">
                <span className="other-rank">#{index + 4}</span>
                <span className="other-name">{player.name}</span>
                <span className="other-score">{player.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="celebration">
        <span className="confetti">🎊</span>
        <span className="confetti">🎄</span>
        <span className="confetti">⭐</span>
        <span className="confetti">🎅</span>
        <span className="confetti">🎁</span>
      </div>
    </div>
  )
}

