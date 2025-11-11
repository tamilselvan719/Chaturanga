import React from 'react';
import { Piece } from '../types';
import PieceIcon from './PieceIcon';

interface CapturedPiecesDisplayProps {
    pieces: Piece[];
}

const CapturedPiecesDisplay: React.FC<CapturedPiecesDisplayProps> = ({ pieces }) => {
    if (pieces.length === 0) {
        // h-9 to reserve space for h-8 icons + mt-1 on the container
        return <div className="h-9"></div>; 
    }

    return (
        <div className="flex items-center flex-wrap gap-0.5 mt-1">
            {pieces.map((piece, index) => (
                <div key={index} className="w-8 h-8">
                    <PieceIcon piece={piece} />
                </div>
            ))}
        </div>
    );
};

export default CapturedPiecesDisplay;