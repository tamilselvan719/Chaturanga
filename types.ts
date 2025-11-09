
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
