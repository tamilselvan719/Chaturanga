import React from 'react';
import { Piece, PieceType, Player } from '../types';

interface PieceIconProps {
  piece: Piece;
}

const PieceIcon: React.FC<PieceIconProps> = ({ piece }) => {
  const color = piece.player === Player.WHITE ? '#F0D9B5' : '#4a3728';
  const strokeColor = piece.player === Player.WHITE ? '#4a3728' : '#F0D9B5';

  // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  const icons: Record<PieceType, React.ReactElement> = {
    [PieceType.KING]: (
      <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill={color} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 22.5,11.63 L 22.5,6" />
          <path d="M 20,8 L 25,8" />
          <path d="m 22.5,25 c 0,0 4.5,-7.5 3,-10.5 C 25.5,14.5 22.5,14.5 22.5,14.5 C 22.5,14.5 19.5,14.5 19.5,11.5 C 18,14.5 22.5,25 22.5,25" />
          <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,32 C 32.5,32 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,25 L 22.5,25 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,32 12.5,32 L 11.5,37" />
          <path d="M 11.5,30 C 17,27 27,27 32.5,30" />
          <path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" />
          <path d="M 11.5,37 C 17,34 27,34 32.5,37" />
        </g>
      </svg>
    ),
    [PieceType.GENERAL]: (
       <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill={color} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 11,36 C 15,39 29,39 33,36 L 33,33 C 33,33 40,28 37,21 C 34,14 27,16 24,25 L 20,25 C 17,16 10,14 7,21 C 4,28 11,33 11,33 L 11,36" />
            <path d="M 11.5,30 C 17,27 27,27 32.5,30" />
            <path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" />
            <path d="M 11,36 C 15,39 29,39 33,36" />
            <circle cx="6" cy="12" r="2" />
            <circle cx="12" cy="9" r="2" />
            <circle cx="22" cy="8" r="2" />
            <circle cx="32" cy="9" r="2" />
            <circle cx="38" cy="12" r="2" />
        </g>
      </svg>
    ),
    [PieceType.ELEPHANT]: (
      <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill={color} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 12,39 L 32,39 L 32,36 L 12,36 L 12,39 z" />
            <path d="M 15,36 L 29,36 L 29,33 L 15,33 L 15,36 z" />
            <path d="M 18,33 L 26,33 L 26,30 L 18,30 L 18,33 z" />
            <path d="m 22,30 c 0,0 8,-1.62 8,-9.5 c 0,-7.88 -8,-9.5 -8,-9.5 m 0,19 C 22,30 14,28.38 14,20.5 C 14,12.62 22,11 22,11" />
            <path d="M 22,11 C 24,14 25,20 25,20 C 25,20 25.5,23 29,23 C 32.5,23 32,20 32,20 C 32,20 30,12 22,11" />
            <path d="M 22,11 C 20,14 19,20 19,20 C 19,20 18.5,23 15,23 C 11.5,23 12,20 12,20 C 12,20 14,12 22,11" />
        </g>
      </svg>
    ),
    [PieceType.HORSE]: (
      <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill={color} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 22,10 C 32.5,10 32.5,24 28,24 C 28,24 23,24 23,22 C 23,22 28,19.5 28,14.5 C 28,10 25,10 22,10" />
          <path d="M 9.5,25.5 A 25,25 0 0 1 29,26 L 29,32 A 25,25 0 0 1 9.5,25.5" />
          <path d="M 15,29.5 L 15,34.5 L 31,34.5 L 31,29.5" />
          <path d="M 22,34.5 L 22,29.5" />
        </g>
      </svg>
    ),
    [PieceType.CHARIOT]: (
      <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill={color} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z" />
          <path d="M 12,36 L 33,36 L 33,32 L 12,32 L 12,36 z" />
          <path d="M 11,14 L 34,14" />
          <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14" />
          <path d="M 12,32 L 12,14 L 33,14 L 33,32 L 12,32 z" />
        </g>
      </svg>
    ),
    [PieceType.PAWN]: (
      <svg viewBox="0 0 45 45" className="w-full h-full">
        <g fill={color} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 22.5,39 C 22.5,39 27,36 27,33 C 27,30 22.5,28 22.5,28 C 22.5,28 18,30 18,33 C 18,36 22.5,39 22.5,39 z" />
          <path d="M 22.5,28 C 22.5,28 22.5,22 22.5,22 C 20,22 20,19 22.5,19 C 25,19 25,22 22.5,22" />
        </g>
      </svg>
    ),
  };

  return icons[piece.type];
};

export default PieceIcon;
