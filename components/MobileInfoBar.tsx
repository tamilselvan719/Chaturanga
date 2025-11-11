
import React from 'react';
import { Player, Piece } from '../types';
import Timer from './Timer';
import CapturedPiecesDisplay from './CapturedPiecesDisplay';

interface MobileInfoBarProps {
    player: Player;
    isAI: boolean;
    time: number;
    isActive: boolean;
    capturedPieces: Piece[];
}

const MobileInfoBar: React.FC<MobileInfoBarProps> = ({ player, isAI, time, isActive, capturedPieces }) => {
    return (
        <div className="w-full bg-slate-900 p-2 flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2">
                    <p className="font-bold capitalize">{player}</p>
                    {isAI && <span className="text-xs bg-slate-600 text-slate-300 px-2 py-0.5 rounded-full">AI</span>}
                </div>
                <CapturedPiecesDisplay pieces={capturedPieces} />
            </div>
            <Timer time={time} isActive={isActive} />
        </div>
    );
};

export default MobileInfoBar;
