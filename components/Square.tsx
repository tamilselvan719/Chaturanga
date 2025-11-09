
import React from 'react';
import { Piece, Position } from '../types';
import PieceIcon from './PieceIcon';

interface SquareProps {
  piece: Piece | null;
  position: Position;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  isKingInCheck: boolean;
  onClick: (pos: Position) => void;
}

const Square: React.FC<SquareProps> = ({ piece, position, isLight, isSelected, isPossibleMove, isKingInCheck, onClick }) => {
  const bgClass = isLight ? 'bg-amber-200' : 'bg-amber-600';
  const selectedClass = isSelected ? 'bg-yellow-400' : '';
  const checkClass = isKingInCheck ? 'bg-red-500' : '';
  
  return (
    <div
      className={`w-full h-full flex justify-center items-center relative cursor-pointer ${bgClass} ${selectedClass} ${checkClass}`}
      onClick={() => onClick(position)}
    >
      {piece && <PieceIcon piece={piece} />}
      {isPossibleMove && (
        <div className="absolute w-1/3 h-1/3 bg-green-500/50 rounded-full"></div>
      )}
    </div>
  );
};

export default Square;
