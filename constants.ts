
import { PieceType, Player, BoardState } from './types';

const { KING, GENERAL, ELEPHANT, HORSE, CHARIOT, PAWN } = PieceType;
const { WHITE, BLACK } = Player;

export const INITIAL_BOARD: BoardState = [
  [{ type: CHARIOT, player: BLACK }, { type: HORSE, player: BLACK }, { type: ELEPHANT, player: BLACK }, { type: GENERAL, player: BLACK }, { type: KING, player: BLACK }, { type: ELEPHANT, player: BLACK }, { type: HORSE, player: BLACK }, { type: CHARIOT, player: BLACK }],
  [{ type: PAWN, player: BLACK }, { type: PAWN, player: BLACK }, { type: PAWN, player: BLACK }, { type: PAWN, player: BLACK }, { type: PAWN, player: BLACK }, { type: PAWN, player: BLACK }, { type: PAWN, player: BLACK }, { type: PAWN, player: BLACK }],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [{ type: PAWN, player: WHITE }, { type: PAWN, player: WHITE }, { type: PAWN, player: WHITE }, { type: PAWN, player: WHITE }, { type: PAWN, player: WHITE }, { type: PAWN, player: WHITE }, { type: PAWN, player: WHITE }, { type: PAWN, player: WHITE }],
  [{ type: CHARIOT, player: WHITE }, { type: HORSE, player: WHITE }, { type: ELEPHANT, player: WHITE }, { type: GENERAL, player: WHITE }, { type: KING, player: WHITE }, { type: ELEPHANT, player: WHITE }, { type: HORSE, player: WHITE }, { type: CHARIOT, player: WHITE }],
];
