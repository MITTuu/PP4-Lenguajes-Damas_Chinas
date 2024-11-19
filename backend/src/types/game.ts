export interface Player {
    id: string;
    nickname: string;
  }
  
  export interface Game {
    gameCode: string;
    numPlayers: number;
    creator: string;
    players: Player[];
    isStarted: boolean;
  }
  
  export interface CreateGameData {
    gameCode: string;
    numPlayers: number;
    creator: string;
  }
  
  export interface JoinGameData {
    gameCode: string;
    nickname: string;
  }