export interface Seat {
  id: number;
  round: number;
  table: number;
  wind: string;
  playerId: number;
  playerName?: string;
  score?: number;
  penalty?: number;
}
