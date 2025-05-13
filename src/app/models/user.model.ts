export interface User {
  userId: string;
  bestScore: number;
  bestScoreDate: Date;
  username: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  googleId?: string;
  email: string;
}