
import React from 'react';
import { GameSettings, Player, CapturedPieces } from '../types';
import PlayerInfo from './PlayerInfo';
import MoveHistoryPanel from './MoveHistoryPanel';
import ActionPanel from './ActionPanel';

interface SidePanelProps {
    gameSettings: GameSettings;
    timers: { [key in Player]: number };
    currentPlayer: Player;
    gameStatus: string;
    capturedPieces: CapturedPieces;
    moveHistory: string[];
    onReset: () => void;
    onGoToMainMenu: () => void;
    onResign?: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
    gameSettings,
    timers,
    currentPlayer,
    gameStatus,
    capturedPieces,
    moveHistory,
    onReset,
    onGoToMainMenu,
    onResign,
}) => {
    const { playerColor, aiColor, gameMode } = gameSettings;
    const isAiVsAi = gameMode === 'ai-vs-ai';

    if (gameMode === 'player-vs-ai' && (!playerColor || !aiColor)) {
        return null; // Should not happen in a valid state
    }

    const isPlayerBlack = !isAiVsAi && playerColor === Player.BLACK;
    const topPlayer = isPlayerBlack ? Player.WHITE : Player.BLACK;
    const bottomPlayer = isPlayerBlack ? Player.BLACK : Player.WHITE;
    
    const isGameOver = gameStatus.includes('wins') || gameStatus.includes('Draw');

    const showResignButton = !isAiVsAi && !!onResign && (
        (playerColor === Player.WHITE && moveHistory.length >= 1) ||
        (playerColor === Player.BLACK && moveHistory.length >= 2)
    );

    return (
        <div className="bg-slate-900 absolute inset-0 rounded-lg shadow-xl flex flex-col p-4 w-full">
            <PlayerInfo
                player={topPlayer}
                isAI={isAiVsAi || topPlayer === aiColor}
                capturedPieces={capturedPieces[bottomPlayer]}
                time={timers[topPlayer]}
                isActive={currentPlayer === topPlayer}
            />

            <div className="flex-grow my-4 min-h-0">
                <MoveHistoryPanel moves={moveHistory} />
            </div>

            <PlayerInfo
                player={bottomPlayer}
                isAI={isAiVsAi || bottomPlayer === aiColor}
                capturedPieces={capturedPieces[topPlayer]}
                time={timers[bottomPlayer]}
                isActive={currentPlayer === bottomPlayer}
            />

            <div className="text-center py-4 my-2 bg-slate-800 rounded-md">
                <p className="text-lg font-semibold text-slate-200">
                    {isGameOver ? gameStatus.split('!')[0] + '!' : gameStatus}
                </p>
            </div>

            <ActionPanel gameStatus={gameStatus} onGoToMainMenu={onGoToMainMenu} onResign={onResign} showResignButton={showResignButton} />
        </div>
    );
};

export default SidePanel;
