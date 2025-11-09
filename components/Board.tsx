
import React from 'react';
import { BoardState, PieceType, Player, Position } from '../types';
import Square from './Square';

interface BoardProps {
  board: BoardState;
  selectedPiece: Position | null;
  validMoves: Position[];
  onSquareClick: (pos: Position) => void;
  kingInCheckPos: Position | null;
}

const Board: React.FC<BoardProps> = ({ board, selectedPiece, validMoves, onSquareClick, kingInCheckPos }) => {
  return (
    <div className="grid grid-cols-8 aspect-square w-full max-w-[80vh] shadow-lg border-4 border-amber-800">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isLight = (rowIndex + colIndex) % 2 !== 0;
          const pos = { row: rowIndex, col: colIndex };
          const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
          const isPossibleMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
          const isKingInCheck = kingInCheckPos?.row === rowIndex && kingInCheckPos?.col === colIndex;
          
          return (
            <Square
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              position={pos}
              isLight={isLight}
              isSelected={isSelected}
              isPossibleMove={isPossibleMove}
              isKingInCheck={isKingInCheck}
              onClick={onSquareClick}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;
