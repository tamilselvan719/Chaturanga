
import React from 'react';

interface ActionPanelProps {
    gameStatus: string;
    onReset: () => void;
    onGoToMainMenu: () => void;
    onResign: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ gameStatus, onReset, onGoToMainMenu, onResign }) => {
    const isGameOver = gameStatus.includes('wins') || gameStatus.includes('Draw');
    return (
        <div className="w-full bg-slate-900 p-2 flex flex-col items-center gap-2">
            <div className="text-center py-2 px-4 bg-slate-800 rounded-md w-full">
                <p className="font-semibold text-slate-200">
                    {isGameOver ? gameStatus.split('!')[0] + '!' : gameStatus}
                </p>
            </div>
            <div className="flex justify-around items-center w-full">
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 w-2/5"
                >
                    New Game
                </button>
                <button
                    onClick={onGoToMainMenu}
                    className="px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 w-2/5"
                >
                    Main Menu
                </button>
            </div>
            {!isGameOver && (
                 <button
                    onClick={onResign}
                    className="w-full px-4 py-2 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Resign
                </button>
            )}
        </div>
    );
};

export default ActionPanel;
