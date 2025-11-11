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
  const bgClass = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
  const selectedClass = isSelected ? 'bg-yellow-400/70' : '';
  const checkClass = isKingInCheck ? 'bg-red-500/70' : '';
  
  return (
    <div
      className={`w-full h-full flex justify-center items-center relative cursor-pointer ${bgClass}`}
      onClick={() => onClick(position)}
    >
      <div className={`absolute w-full h-full ${selectedClass} ${checkClass}`}></div>
      {piece && <div className="relative z-10 w-full h-full"><PieceIcon piece={piece} /></div>}
      {isPossibleMove && (
        <div className="absolute w-1/3 h-1/3 bg-green-500/50 rounded-full z-20"></div>
      )}
    </div>
  );
};

export default Square;
