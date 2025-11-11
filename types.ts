
export enum PieceType {
  KING = 'King',
  GENERAL = 'General',
  ELEPHANT = 'Elephant',
  HORSE = 'Horse',
  CHARIOT = 'Chariot',
  PAWN = 'Pawn',
}

export enum Player {
  WHITE = 'white',
  BLACK = 'black',
}

export interface Piece {
  type: PieceType;
  player: Player;
}

export interface Position {
  row: number;
  col: number;
}

export type BoardState = (Piece | null)[][];

export type PlayerColorChoice = Player.WHITE | Player.BLACK | 'random';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type TimeOption = 5 | 10 | 30 | 'unlimited';
export type IncrementOption = 1 | 5 | 10;
export type GameState = 'menu' | 'playing' | 'help';

export interface GameSettings {
  playerChoice: PlayerColorChoice;
  time: TimeOption;
  increment: IncrementOption;
  difficulty: Difficulty;
  // These are assigned when game starts
  playerColor?: Player;
  aiColor?: Player;
  aiDepth: number;
}

export interface CapturedPieces {
  [Player.WHITE]: Piece[];
  [Player.BLACK]: Piece[];
}
