import { BoardState, PieceType, Player, Position } from '../types';
import { getFfishLibrary, FfishBoard } from './ffishService';

// --- FEN and Move Conversion Helpers ---

const pieceToFenMap: { [key in PieceType]: string } = {
    [PieceType.PAWN]: 'p',
    [PieceType.HORSE]: 'n',
    [PieceType.ELEPHANT]: 'e',
    [PieceType.CHARIOT]: 'r',
    [PieceType.GENERAL]: 'g',
    [PieceType.KING]: 'k',
};

const fenToPieceMap: { [key: string]: PieceType } = {
    p: PieceType.PAWN,
    n: PieceType.HORSE,
    e: PieceType.ELEPHANT,
    r: PieceType.CHARIOT,
    g: PieceType.GENERAL,
    k: PieceType.KING,
};

const boardToFen = (board: BoardState, activePlayer: Player): string => {
    let fen = '';
    for (let r = 0; r < 8; r++) {
        let emptySquares = 0;
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                if (emptySquares > 0) {
                    fen += emptySquares;
                    emptySquares = 0;
                }
                const fenChar = pieceToFenMap[piece.type];
                fen += piece.player === Player.WHITE ? fenChar.toUpperCase() : fenChar;
            } else {
                emptySquares++;
            }
        }
        if (emptySquares > 0) {
            fen += emptySquares;
        }
        if (r < 7) {
            fen += '/';
        }
    }
    fen += ` ${activePlayer === Player.WHITE ? 'w' : 'b'} - - 0 1`;
    return fen;
};

const uciToMove = (uci: string): { from: Position; to: Position } => {
    const fromCol = uci.charCodeAt(0) - 'a'.charCodeAt(0);
    const fromRow = 8 - parseInt(uci[1], 10);
    const toCol = uci.charCodeAt(2) - 'a'.charCodeAt(0);
    const toRow = 8 - parseInt(uci[3], 10);
    return { from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } };
};

// --- Minimax AI with Improved Evaluation ---

const pieceValues: { [key in PieceType]: number } = {
    [PieceType.PAWN]: 100,
    [PieceType.HORSE]: 320,
    [PieceType.ELEPHANT]: 330,
    [PieceType.CHARIOT]: 500,
    [PieceType.GENERAL]: 900,
    [PieceType.KING]: 20000,
};

// Positional scores from White's perspective. They are mirrored for Black.
const positionalScores: { [key in PieceType]: number[][] } = {
    [PieceType.PAWN]: [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ],
    [PieceType.HORSE]: [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    [PieceType.CHARIOT]: [
        [ 0,  0,  0,  0,  0,  0,  0,  0],
        [ 5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [ 0,  0,  0,  5,  5,  0,  0,  0]
    ],
    [PieceType.ELEPHANT]: [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    [PieceType.GENERAL]: [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-5,  0,  5,  5,  5,  5,  0, -5],
        [ 0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    [PieceType.KING]: [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [ 20, 20,  0,  0,  0,  0, 20, 20],
        [ 20, 30, 10,  0,  0, 10, 30, 20]
    ]
};


const evaluateBoard = (ffishBoard: FfishBoard, aiPlayer: Player): number => {
    const fen = ffishBoard.fen();
    const boardPart = fen.split(' ')[0];
    let score = 0;
    let row = 0;
    let col = 0;

    for (const char of boardPart) {
        if (char === '/') {
            row++;
            col = 0;
        } else if (/\d/.test(char)) {
            col += parseInt(char, 10);
        } else {
            const lowerChar = char.toLowerCase();
            const pieceType = fenToPieceMap[lowerChar];
            const materialValue = pieceValues[pieceType];
            
            const isWhite = char !== lowerChar;
            const posScore = isWhite 
                ? positionalScores[pieceType][row][col] 
                : positionalScores[pieceType][7 - row][col];

            const totalValue = materialValue + posScore;

            if (isWhite) {
                score += (aiPlayer === Player.WHITE ? totalValue : -totalValue);
            } else { // Black piece
                score += (aiPlayer === Player.BLACK ? totalValue : -totalValue);
            }
            col++;
        }
    }
    return score;
};

const minimax = (ffishBoard: FfishBoard, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean, aiPlayer: Player): number => {
    if (ffishBoard.isGameOver()) {
        const result = ffishBoard.result();
        if (result === '1-0') return aiPlayer === Player.WHITE ? Infinity : -Infinity;
        if (result === '0-1') return aiPlayer === Player.BLACK ? Infinity : -Infinity;
        return 0;
    }

    if (depth === 0) {
        return evaluateBoard(ffishBoard, aiPlayer);
    }

    const legalMoves = ffishBoard.legalMoves().split(' ').filter(m => m);

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of legalMoves) {
            ffishBoard.push(move);
            const evalScore = minimax(ffishBoard, depth - 1, alpha, beta, false, aiPlayer);
            ffishBoard.pop();
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of legalMoves) {
            ffishBoard.push(move);
            const evalScore = minimax(ffishBoard, depth - 1, alpha, beta, true, aiPlayer);
            ffishBoard.pop();
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

export const findBestMove = async (board: BoardState, depth: number, aiPlayer: Player): Promise<{ from: Position; to: Position } | null> => {
    const ffish = await getFfishLibrary();
    const ffishBoard = new ffish.Board('chaturanga-custom');
    const fen = boardToFen(board, aiPlayer);
    ffishBoard.setFen(fen);

    const legalMoves = ffishBoard.legalMoves().split(' ').filter(m => m);

    if (legalMoves.length === 0) {
        ffishBoard.delete();
        return null;
    }

    let bestMoves: string[] = [];
    let bestValue = -Infinity;

    for (const move of legalMoves) {
        ffishBoard.push(move);
        const boardValue = minimax(ffishBoard, depth - 1, -Infinity, Infinity, false, aiPlayer);
        ffishBoard.pop();

        if (boardValue > bestValue) {
            bestValue = boardValue;
            bestMoves = [move];
        } else if (boardValue === bestValue) {
            bestMoves.push(move);
        }
    }

    ffishBoard.delete();
    
    // Choose a random move from the best moves to break ties
    const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    return uciToMove(chosenMove);
};