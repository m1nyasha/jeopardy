import { CategoryWithQuestions } from '../api'
import '../styles/GameBoard.css'

interface Props {
  categories: CategoryWithQuestions[]
}

export default function GameBoard({ categories }: Props) {
  if (categories.length === 0) {
    return (
      <div className="game-board-empty">
        <span className="empty-icon">📋</span>
        <h2>Вопросы не загружены</h2>
        <p>Запустите команду импорта вопросов</p>
      </div>
    )
  }

  // Get all unique point values across categories
  const allPoints = [...new Set(
    categories.flatMap(c => c.questions.map(q => q.points))
  )].sort((a, b) => a - b)

  return (
    <div className="game-board">
      <table className="board-table">
        <thead>
          <tr>
            {categories.map((category, idx) => (
              <th key={category.id} style={{ animationDelay: `${idx * 0.1}s` }}>
                <span className="category-name">{category.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allPoints.map((points, rowIdx) => (
            <tr key={points}>
              {categories.map((category, colIdx) => {
                const question = category.questions.find(q => q.points === points)
                const delay = `${(rowIdx * categories.length + colIdx) * 0.05}s`
                
                return (
                  <td key={`${category.id}-${points}`}>
                    {question ? (
                      <div 
                        className={`board-cell ${question.isAnswered ? 'answered' : ''}`}
                        style={{ animationDelay: delay }}
                      >
                        {question.isAnswered ? (
                          <span className="cell-answered">✓</span>
                        ) : (
                          <span className="cell-points">{points}</span>
                        )}
                      </div>
                    ) : (
                      <div className="board-cell empty" style={{ animationDelay: delay }}></div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
