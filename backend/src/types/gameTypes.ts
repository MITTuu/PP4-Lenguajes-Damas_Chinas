export interface Player {
    id: string;
    nickname: string;
    color?: string;
}
  
export interface Game {
  gameCode: string;
  numPlayers: number;
  creator: string;
  creatorName: string;
  players: Player[];
  playersJoined: number;
  gameType?: string;
  gameTime?: string; 
  isStarted: boolean;
  positions?: Record<string, [number, number][]>;
  turn?: string;
  winner?: string;
}

export interface GameConfig {
  gameCode: string;
  numPlayers: number;
  creator: string;
  gameType?: string;
  gameTime?: string;
}
  