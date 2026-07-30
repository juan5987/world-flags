export interface ActiveGame {
  id: string;
  durationMs: number;
  anchorPerfMs: number;
}

export interface CreatedGame {
  id: string;
  startedAt: string;
  durationMs: number;
}

export interface EndGameResult {
  status: 'ENDED';
  scoreAccepted: boolean;
  bestScore: number;
}
