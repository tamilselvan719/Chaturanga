
import React from 'react';
import { Player, Piece } from '../types';
import Timer from './Timer';
import CapturedPiecesDisplay from './CapturedPiecesDisplay';

interface PlayerInfoProps {
    player: Player;
    isAI: boolean;
    capturedPieces: Piece[];
    time: number;
    isActive: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isAI, capturedPieces, time, isActive }) => {
    return (
        <div className="flex items-center justify-between w-full p-2 bg-slate-800 rounded-lg">
            <div>
                <div className="flex items-center gap-2">
                    <p className="text-lg font-bold capitalize">{player}</p>
                    {isAI && <span className="text-xs bg-slate-600 text-slate-300 px-2 py-0.5 rounded-full">AI</span>}
                </div>
                 <CapturedPiecesDisplay pieces={capturedPieces} />
            </div>
            <div className="hidden md:block">
                 <Timer time={time} isActive={isActive} />
            </div>
        </div>
    );
};

export default PlayerInfo;
