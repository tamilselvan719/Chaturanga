
import { BoardState, Piece, PieceType, Player, Position } from '../types';

const isWithinBoard = (row: number, col: number) => row >= 0 && row < 8 && col >= 0 && col < 8;

const getPieceAt = (board: BoardState, pos: Position): Piece | null => board[pos.row][pos.col];

const getKingPosition = (board: BoardState, player: Player): Position | null => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === PieceType.KING && piece.player === player) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};

export const isPositionUnderAttack = (board: BoardState, position: Position, attackingPlayer: Player): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.player === attackingPlayer) {
        const moves = getPieceRawMoves(piece, { row: r, col: c }, board);
        if (moves.some(move => move.row === position.row && move.col === position.col)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isKingInCheck = (board: BoardState, player: Player): boolean => {
  const kingPos = getKingPosition(board, player);
  if (!kingPos) return false;
  const opponent = player === Player.WHITE ? Player.BLACK : Player.WHITE;
  return isPositionUnderAttack(board, kingPos, opponent);
};

const getPawnMoves = (piece: Piece, pos: Position, board: BoardState): Position[] => {
    const moves: Position[] = [];
    const direction = piece.player === Player.WHITE ? -1 : 1;
    const { row, col } = pos;

    // Forward move
    const nextRow = row + direction;
    if (isWithinBoard(nextRow, col) && !getPieceAt(board, { row: nextRow, col: col })) {
        moves.push({ row: nextRow, col: col });
    }

    // Captures
    const captureCols = [col - 1, col + 1];
    for (const captureCol of captureCols) {
        if (isWithinBoard(nextRow, captureCol)) {
            const targetPiece = getPieceAt(board, { row: nextRow, col: captureCol });
            if (targetPiece && targetPiece.player !== piece.player) {
                moves.push({ row: nextRow, col: captureCol });
            }
        }
    }
    return moves;
};

const getChariotMoves = (piece: Piece, pos: Position, board: BoardState): Position[] => {
    const moves: Position[] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
        for (let i = 1; i < 8; i++) {
            const newRow = pos.row + dr * i;
            const newCol = pos.col + dc * i;
            if (!isWithinBoard(newRow, newCol)) break;
            const target = getPieceAt(board, { row: newRow, col: newCol });
            if (target) {
                if (target.player !== piece.player) moves.push({ row: newRow, col: newCol });
                break;
            }
            moves.push({ row: newRow, col: newCol });
        }
    }
    return moves;
};

const getHorseMoves = (piece: Piece, pos: Position, board: BoardState): Position[] => {
    const moves: Position[] = [];
    const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (const [dr, dc] of offsets) {
        const newRow = pos.row + dr;
        const newCol = pos.col + dc;
        if (isWithinBoard(newRow, newCol)) {
            const target = getPieceAt(board, { row: newRow, col: newCol });
            if (!target || target.player !== piece.player) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    return moves;
};

const getElephantMoves = (piece: Piece, pos: Position, board: BoardState): Position[] => {
    const moves: Position[] = [];
    // 1 step any direction
    const oneStepOffsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    oneStepOffsets.forEach(([dr, dc]) => {
        const newRow = pos.row + dr;
        const newCol = pos.col + dc;
        if (isWithinBoard(newRow, newCol)) {
            const target = getPieceAt(board, { row: newRow, col: newCol });
            if (!target || target.player !== piece.player) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    });

    // Jumps 2 steps diagonally
    const twoStepOffsets = [[-2, -2], [-2, 2], [2, -2], [2, 2]];
    twoStepOffsets.forEach(([dr, dc]) => {
        const newRow = pos.row + dr;
        const newCol = pos.col + dc;
        if (isWithinBoard(newRow, newCol)) {
            const target = getPieceAt(board, { row: newRow, col: newCol });
            if (!target || target.player !== piece.player) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    });
    return moves;
};

const getGeneralMoves = (piece: Piece, pos: Position, board: BoardState): Position[] => {
    const moves: Position[] = [];
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (const [dr, dc] of directions) {
        for (let i = 1; i <= 2; i++) {
            const newRow = pos.row + dr * i;
            const newCol = pos.col + dc * i;
            if (!isWithinBoard(newRow, newCol)) break;
            const target = getPieceAt(board, { row: newRow, col: newCol });
            if (target) {
                if (target.player !== piece.player) moves.push({ row: newRow, col: newCol });
                break;
            }
            moves.push({ row: newRow, col: newCol });
        }
    }
    return moves;
};

const getKingMoves = (piece: Piece, pos: Position, board: BoardState): Position[] => {
    const moves: Position[] = [];
    const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (const [dr, dc] of offsets) {
        const newRow = pos.row + dr;
        const newCol = pos.col + dc;
        if (isWithinBoard(newRow, newCol)) {
            const target = getPieceAt(board, { row: newRow, col: newCol });
            if (!target || target.player !== piece.player) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    return moves;
};

const getPieceRawMoves = (piece: Piece, pos: Position, board: BoardState): Position[] => {
  switch (piece.type) {
    case PieceType.PAWN: return getPawnMoves(piece, pos, board);
    case PieceType.CHARIOT: return getChariotMoves(piece, pos, board);
    case PieceType.HORSE: return getHorseMoves(piece, pos, board);
    case PieceType.ELEPHANT: return getElephantMoves(piece, pos, board);
    case PieceType.GENERAL: return getGeneralMoves(piece, pos, board);
    case PieceType.KING: return getKingMoves(piece, pos, board);
    default: return [];
  }
};

export const getValidMoves = (piece: Piece, pos: Position, board: BoardState): Position[] => {
  const rawMoves = getPieceRawMoves(piece, pos, board);
  return rawMoves.filter(move => {
    const newBoard = board.map(r => [...r]);
    newBoard[move.row][move.col] = piece;
    newBoard[pos.row][pos.col] = null;
    return !isKingInCheck(newBoard, piece.player);
  });
};

const hasAnyValidMoves = (board: BoardState, player: Player): boolean => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.player === player) {
                if (getValidMoves(piece, { row: r, col: c }, board).length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

export const isCheckmate = (board: BoardState, player: Player): boolean => {
    return isKingInCheck(board, player) && !hasAnyValidMoves(board, player);
};

export const isStalemate = (board: BoardState, player: Player): boolean => {
    return !isKingInCheck(board, player) && !hasAnyValidMoves(board, player);
};
