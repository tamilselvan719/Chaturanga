
import { BoardState, Piece, PieceType, Player, Position } from '../types';
import * as gameLogic from './gameLogic';

const pieceValues: { [key in PieceType]: number } = {
  [PieceType.PAWN]: 1,
  [PieceType.HORSE]: 3,
  [PieceType.CHARIOT]: 4,
  [PieceType.ELEPHANT]: 5,
  [PieceType.GENERAL]: 6,
  [PieceType.KING]: 1000,
};

const evaluateBoard = (board: BoardState): number => {
    if (gameLogic.isCheckmate(board, Player.BLACK)) return Infinity;
    if (gameLogic.isStalemate(board, Player.BLACK)) return Infinity;
    if (gameLogic.isBareKing(board, Player.BLACK)) return Infinity;

    if (gameLogic.isCheckmate(board, Player.WHITE)) return -Infinity;
    if (gameLogic.isStalemate(board, Player.WHITE)) return -Infinity;
    if (gameLogic.isBareKing(board, Player.WHITE)) return -Infinity;

    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                if (piece.player === Player.WHITE) {
                    score += pieceValues[piece.type];
                } else {
                    score -= pieceValues[piece.type];
                }
            }
        }
    }
    return score;
};

const getAllMoves = (board: BoardState, player: Player): { from: Position; to: Position }[] => {
    const moves: { from: Position; to: Position }[] = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.player === player) {
                const validMoves = gameLogic.getValidMoves(piece, { row: r, col: c }, board);
                validMoves.forEach(move => moves.push({ from: { row: r, col: c }, to: move }));
            }
        }
    }
    return moves;
};

const makeMove = (board: BoardState, from: Position, to: Position): BoardState => {
    const newBoard = board.map(r => [...r]);
    const pieceToMove = { ...newBoard[from.row][from.col] } as Piece;

    if (pieceToMove.type === PieceType.PAWN) {
        if ((pieceToMove.player === Player.WHITE && to.row === 0) || (pieceToMove.player === Player.BLACK && to.row === 7)) {
            pieceToMove.type = PieceType.GENERAL;
        }
    }

    newBoard[to.row][to.col] = pieceToMove;
    newBoard[from.row][from.col] = null;
    return newBoard;
};

const minimax = (board: BoardState, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): number => {
    if (depth === 0) {
        return evaluateBoard(board);
    }
    
    const terminalValue = evaluateBoard(board);
    if (terminalValue === Infinity || terminalValue === -Infinity) {
        return terminalValue;
    }

    const player = isMaximizingPlayer ? Player.WHITE : Player.BLACK;
    const allMoves = getAllMoves(board, player);

    if (allMoves.length === 0) {
        return evaluateBoard(board);
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of allMoves) {
            const newBoard = makeMove(board, move.from, move.to);
            const evalScore = minimax(newBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of allMoves) {
            const newBoard = makeMove(board, move.from, move.to);
            const evalScore = minimax(newBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

export const findBestMove = (board: BoardState, depth: number, aiPlayer: Player): { from: Position; to: Position } | null => {
    const allMoves = getAllMoves(board, aiPlayer);

    if (allMoves.length === 0) {
        return null;
    }

    allMoves.sort(() => Math.random() - 0.5);

    let bestMove: { from: Position, to: Position } = allMoves[0];
    const isMaximizingPlayer = aiPlayer === Player.WHITE;
    let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

    for (const move of allMoves) {
        const newBoard = makeMove(board, move.from, move.to);
        const boardValue = minimax(newBoard, depth - 1, -Infinity, Infinity, !isMaximizingPlayer);

        if (isMaximizingPlayer) {
            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        } else { // Minimizing player (Black)
            if (boardValue < bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        }
    }
    return bestMove;
};
