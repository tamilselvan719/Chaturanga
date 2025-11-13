
import React from 'react';
import { BoardState, Position } from '../types';
import Square from './Square';

interface BoardProps {
  board: BoardState;
  selectedPiece: Position | null;
  validMoves: Position[];
  onSquareClick: (pos: Position) => void;
  kingInCheckPos: Position | null;
  isFlipped: boolean;
}

const Board: React.FC<BoardProps> = ({ board, selectedPiece, validMoves, onSquareClick, kingInCheckPos, isFlipped }) => {
  const rowIndices = isFlipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
  const colIndices = isFlipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];

  const fileLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rankLabels = ['1', '2', '3', '4', '5', '6', '7', '8'];

  return (
    <div className="grid grid-cols-8 grid-rows-8 w-full h-full shadow-lg border-4 border-[#796956]">
      {rowIndices.map((rowIndex) =>
        colIndices.map((colIndex) => {
          const isLight = (rowIndex + colIndex) % 2 !== 0;
          const pos = { row: rowIndex, col: colIndex };
          const piece = board[rowIndex][colIndex];
          const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
          const isPossibleMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);
          const isKingInCheck = kingInCheckPos?.row === rowIndex && kingInCheckPos?.col === colIndex;

          const displayRank = rankLabels[7 - rowIndex];
          const displayFile = fileLabels[colIndex];

          const isRightmostCol = isFlipped ? colIndex === 0 : colIndex === 7;
          const isBottommostRow = isFlipped ? rowIndex === 0 : rowIndex === 7;

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
              isRightmostCol={isRightmostCol}
              isBottommostRow={isBottommostRow}
              rankLabel={isRightmostCol ? displayRank : undefined}
              fileLabel={isBottommostRow ? displayFile : undefined}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;
