import React from 'react';
import { GameSettings, Player, CapturedPieces } from '../types';
import PlayerInfo from './PlayerInfo';
import Timer from './Timer';

interface SidePanelProps {
    gameSettings: GameSettings;
    timers: { [key in Player]: number };
    currentPlayer: Player;
    gameStatus: string;
    capturedPieces: CapturedPieces;
    onReset: () => void;
    onGoToMainMenu: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
    gameSettings,
    timers,
    currentPlayer,
    gameStatus,
    capturedPieces,
    onReset,
    onGoToMainMenu
}) => {
    const { playerColor, aiColor } = gameSettings;
    if (!playerColor || !aiColor) return null;
    
    const opponentPlayer = playerColor === Player.WHITE ? Player.BLACK : Player.WHITE;
    const isGameOver = gameStatus.includes('wins') || gameStatus.includes('Draw');

    return (
        <div className="bg-slate-900 h-full rounded-lg shadow-xl flex flex-col p-4">
            <PlayerInfo 
                player={opponentPlayer} 
                isAI={opponentPlayer === aiColor}
                capturedPieces={capturedPieces[playerColor]}
                time={timers[opponentPlayer]}
                isActive={currentPlayer === opponentPlayer}
            />
            
            <div className="flex-grow flex flex-col justify-center items-center my-4">
                 {/* This empty div will contain move history in a future update */}
            </div>

             <PlayerInfo 
                player={playerColor} 
                isAI={playerColor === aiColor}
                capturedPieces={capturedPieces[opponentPlayer]}
                time={timers[playerColor]}
                isActive={currentPlayer === playerColor}
            />

            <div className="text-center py-4 my-2 bg-slate-800 rounded-md">
                <p className="text-lg font-semibold text-slate-200">
                    {isGameOver ? gameStatus.split('!')[0] + '!' : gameStatus}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                    onClick={onReset}
                    className="w-full px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                    New Game
                </button>
                 <button
                    onClick={onGoToMainMenu}
                    className="w-full px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                    Main Menu
                </button>
            </div>
        </div>
    );
};

export default SidePanel;
