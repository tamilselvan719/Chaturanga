import { getFfishLibrary } from './ffishService';
import { BoardState, Piece, PieceType, Player, Position } from '../types';

// --- FEN and Move Conversion Helpers ---

const pieceToFenMap: { [key in PieceType]: string } = {
    [PieceType.PAWN]: 'p',
    [PieceType.HORSE]: 'n',
    [PieceType.ELEPHANT]: 'e',
    [PieceType.CHARIOT]: 'r',
    [PieceType.GENERAL]: 'g',
    [PieceType.KING]: 'k',
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

const uciToPosition = (uci: string): Position => {
    const col = uci.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(uci[1], 10);
    return { row, col };
};

const positionToUci = (pos: Position): string => {
    const col = String.fromCharCode('a'.charCodeAt(0) + pos.col);
    const row = 8 - pos.row;
    return `${col}${row}`;
};

// --- Exported Logic Functions ---

// This utility function is still useful and doesn't depend on complex rules.
export const getKingPosition = (board: BoardState, player: Player): Position | null => {
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

export const getValidMoves = async (piece: Piece, pos: Position, board: BoardState): Promise<Position[]> => {
    const ffish = await getFfishLibrary();
    const ffishBoard = new ffish.Board('chaturanga-custom');
    const fen = boardToFen(board, piece.player);
    ffishBoard.setFen(fen);

    const uciFrom = positionToUci(pos);
    const legalMovesUci = ffishBoard.legalMoves().split(' ');
    
    const validMovesForPiece = legalMovesUci
        .filter(move => move.startsWith(uciFrom))
        .map(move => uciToPosition(move.substring(2, 4)));

    ffishBoard.delete();
    return validMovesForPiece;
};

export const isKingInCheck = async (board: BoardState, player: Player): Promise<boolean> => {
    const ffish = await getFfishLibrary();
    const ffishBoard = new ffish.Board('chaturanga-custom');
    // Set the FEN with the player whose check status we want to know as the active player
    const fen = boardToFen(board, player);
    ffishBoard.setFen(fen);
    
    const inCheck = ffishBoard.isCheck();
    ffishBoard.delete();
    return inCheck;
};

export const isCheckmate = async (board: BoardState, player: Player): Promise<boolean> => {
    const ffish = await getFfishLibrary();
    const ffishBoard = new ffish.Board('chaturanga-custom');
    // To check if 'player' is checkmated, it must be their turn.
    const fen = boardToFen(board, player);
    ffishBoard.setFen(fen);

    const gameOver = ffishBoard.isGameOver();
    const inCheck = ffishBoard.isCheck();
    
    ffishBoard.delete();
    // A player is in checkmate if the game is over AND they are in check.
    return gameOver && inCheck;
};

export const isStalemate = async (board: BoardState, player: Player): Promise<boolean> => {
    const ffish = await getFfishLibrary();
    const ffishBoard = new ffish.Board('chaturanga-custom');
    // To check if 'player' is stalemated, it must be their turn.
    const fen = boardToFen(board, player);
    ffishBoard.setFen(fen);

    const gameOver = ffishBoard.isGameOver();
    const inCheck = ffishBoard.isCheck();

    ffishBoard.delete();
    // Stalemate is when the game is over but the current player is NOT in check.
    return gameOver && !inCheck;
};