import React from 'react';
import { Piece, PieceType, Player } from '../types';

interface PieceIconProps {
  piece: Piece;
}

const pieceImageUrls: Record<PieceType, Record<Player, string>> = {
  [PieceType.KING]: {
    [Player.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
    [Player.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
  },
  // Using Queen for General
  [PieceType.GENERAL]: {
    [Player.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Chess_xlt45.svg',
    [Player.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Chess_xdt45.svg',
  },
  // Using Bishop for Elephant
  [PieceType.ELEPHANT]: {
    [Player.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Chess_elt45.svg',
    [Player.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Chess_edt45.svg',
  },
  // Using Knight for Horse
  [PieceType.HORSE]: {
    [Player.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
    [Player.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  },
  // Using Rook for Chariot
  [PieceType.CHARIOT]: {
    [Player.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
    [Player.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  },
  [PieceType.PAWN]: {
    [Player.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
    [Player.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
  },
};

const PieceIcon: React.FC<PieceIconProps> = ({ piece }) => {
  const imageUrl = pieceImageUrls[piece.type]?.[piece.player];

  if (!imageUrl) {
    // Fallback for any unexpected piece type
    return null;
  }

  return (
    <img
      src={imageUrl}
      alt={`${piece.player} ${piece.type}`}
      className="w-full h-full"
      // Add draggable="false" to improve user experience on desktop
      draggable="false" 
    />
  );
};

export default PieceIcon;