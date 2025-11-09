
import React, { useState, useEffect, useCallback } from 'react';
import { BoardState, Piece, PieceType, Player, Position } from './types';
import { INITIAL_BOARD } from './constants';
import * as gameLogic from './services/gameLogic';
import Board from './components/Board';

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(gameLogic.isKingInCheck(INITIAL_BOARD, Player.WHITE) ? [] : INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.WHITE);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameStatus, setGameStatus] = useState<string>('White to move');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [kingInCheckPos, setKingInCheckPos] = useState<Position | null>(null);

  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD);
    setCurrentPlayer(Player.WHITE);
    setSelectedPiece(null);
    setValidMoves([]);
    setGameOver(false);
    setKingInCheckPos(null);
    setGameStatus('White to move');
  }, []);

  useEffect(() => {
      resetGame();
  }, [resetGame]);

  const updateGameStatus = useCallback((currentBoard: BoardState, nextPlayer: Player) => {
    if (gameLogic.isCheckmate(currentBoard, nextPlayer)) {
      setGameStatus(`Checkmate! ${currentPlayer === Player.WHITE ? 'White' : 'Black'} wins!`);
      setGameOver(true);
    } else if (gameLogic.isStalemate(currentBoard, nextPlayer)) {
      setGameStatus('Stalemate! The game is a draw.');
      setGameOver(true);
    } else {
      const turn = nextPlayer === Player.WHITE ? 'White' : 'Black';
      const checkStatus = gameLogic.isKingInCheck(currentBoard, nextPlayer) ? ' (Check!)' : '';
      setGameStatus(`${turn} to move${checkStatus}`);
      
      const kingPos = findKing(currentBoard, nextPlayer);
      if(checkStatus && kingPos){
        setKingInCheckPos(kingPos);
      } else {
        setKingInCheckPos(null);
      }
    }
  }, [currentPlayer]);

  const findKing = (boardState: BoardState, player: Player): Position | null => {
    for(let r=0; r<8; r++) {
      for(let c=0; c<8; c++) {
        const p = boardState[r][c];
        if(p && p.type === PieceType.KING && p.player === player) return {row: r, col: c};
      }
    }
    return null;
  }

  const handleSquareClick = (pos: Position) => {
    if (gameOver) return;

    const piece = board[pos.row][pos.col];

    if (selectedPiece) {
      const isValidMove = validMoves.some(move => move.row === pos.row && move.col === pos.col);
      if (isValidMove) {
        movePiece(selectedPiece, pos);
      } else if (piece && piece.player === currentPlayer) {
        selectPiece(pos);
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } else if (piece && piece.player === currentPlayer) {
      selectPiece(pos);
    }
  };

  const selectPiece = (pos: Position) => {
    const piece = board[pos.row][pos.col];
    if (!piece) return;

    setSelectedPiece(pos);
    const moves = gameLogic.getValidMoves(piece, pos, board);
    setValidMoves(moves);
  };

  const movePiece = (from: Position, to: Position) => {
    const newBoard = board.map(r => [...r]);
    const pieceToMove = newBoard[from.row][from.col] as Piece;
    
    // Pawn promotion
    if (pieceToMove.type === PieceType.PAWN) {
      if ((pieceToMove.player === Player.WHITE && to.row === 0) || (pieceToMove.player === Player.BLACK && to.row === 7)) {
        pieceToMove.type = PieceType.GENERAL;
      }
    }

    newBoard[to.row][to.col] = pieceToMove;
    newBoard[from.row][from.col] = null;
    
    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);

    const nextPlayer = currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE;
    setCurrentPlayer(nextPlayer);
    updateGameStatus(newBoard, nextPlayer);
  };
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 p-4 text-white font-sans">
      <div className="w-full lg:w-auto">
        <Board 
            board={board}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
            kingInCheckPos={kingInCheckPos}
        />
      </div>
      <div className="flex flex-col items-center lg:items-start gap-4 p-6 bg-slate-900 rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-4xl font-bold tracking-wider">Chaturanga</h1>
        <p className="text-lg text-amber-200">The Ancient Game of Chess</p>
        <div className="w-full h-px bg-slate-700 my-2"></div>
        <div className="text-2xl font-semibold p-4 bg-slate-700 rounded-md w-full text-center">
            {gameStatus}
        </div>
        <button
          onClick={resetGame}
          className="w-full mt-4 px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default App;
