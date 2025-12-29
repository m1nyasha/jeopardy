import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export interface Player {
  id: number;
  name: string;
  score: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  question: string;
  type: 'text' | 'image';
  answer: string;
  points: number;
  isAnswered: boolean;
  categoryId: number;
  category?: Category;
}

export interface CategoryWithQuestions extends Category {
  questions: Question[];
}

export interface GameState {
  id: number;
  status: 'waiting' | 'question' | 'answering' | 'finished';
  currentQuestionId: number | null;
  currentPlayerId: number | null;
  showAnswer: boolean;
  failedPlayerIds: number[];
  currentQuestion: Question | null;
  currentPlayer: Player | null;
  categories: CategoryWithQuestions[];
  players: Player[];
  isGameOver: boolean;
}

// Auth
export const loginAdmin = (login: string, password: string) =>
  api.post('/auth/admin/login', { login, password });

// Players
export const joinGame = (name: string) =>
  api.post<Player>('/players/join', { name });

export const getPlayers = () =>
  api.get<Player[]>('/players');

export const updatePlayerScore = (id: number, scoreChange: number) =>
  api.patch(`/players/${id}/score`, { scoreChange });

export const setPlayerScore = (id: number, score: number) =>
  api.patch(`/players/${id}/set-score`, { score });

// Game
export const getGameState = () =>
  api.get<GameState>('/game/state');

export const selectQuestion = (questionId: number) =>
  api.post('/game/select-question', { questionId });

export const playerAnswer = (playerId: number) =>
  api.post('/game/answer', { playerId });

export const markCorrect = () =>
  api.post('/game/mark-correct');

export const markIncorrect = () =>
  api.post('/game/mark-incorrect');

export const showAnswer = () =>
  api.post('/game/show-answer');

export const skipQuestion = () =>
  api.post('/game/skip-question');

export const resetGame = () =>
  api.post('/game/reset');

export const newGame = () =>
  api.post('/game/new-game');

// Questions
export const getCategories = () =>
  api.get<CategoryWithQuestions[]>('/questions/categories');

export default api;
