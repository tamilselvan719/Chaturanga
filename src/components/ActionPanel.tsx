
import React from 'react';

interface ActionPanelProps {
    gameStatus: string;
    moveHistory: string[];
    onReset: () => void;
    onGoToMainMenu: () => void;
    onResign: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ gameStatus, onReset, onGoToMainMenu, onResign, moveHistory }) => {
    const isGameOver = gameStatus.includes('wins') || gameStatus.includes('Draw');
    return (
        <div className="w-full bg-slate-900 p-2 flex flex-col items-center gap-2">
            <div className="text-center py-2 px-4 bg-slate-800 rounded-md w-full">
                <p className="font-semibold text-slate-200">
                    {isGameOver ? gameStatus.split('!')[0] + '!' : gameStatus}
                </p>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-2">
                {moveHistory.length === 0 ? (
                    <button
                        onClick={onGoToMainMenu}
                        className="w-full px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                        Main Menu
                    </button>
                ) : (
                    !isGameOver && (
                        <button
                            onClick={onResign}
                            className="w-full px-4 py-2 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Resign
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default ActionPanel;
