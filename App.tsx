
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardState,
  Player,
  Position,
  GameState,
  GameSettings,
  Piece,
  CapturedPieces,
  Difficulty,
  PieceType,
} from './types';
import { INITIAL_BOARD } from './constants';
import * as gameLogic from './services/gameLogic';
import * as ai from './services/ai';
import Board from './components/Board';
import MainMenu from './components/MainMenu';
import HelpScreen from './components/HelpScreen';
import SidePanel from './components/SidePanel';
import GameOverOverlay from './components/GameOverOverlay';
import MobileInfoBar from './components/MobileInfoBar';
import ActionPanel from './components/ActionPanel';

const App: React.FC = () => {
    // Game State
    const [gameState, setGameState] = useState<GameState>('menu');
    const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

    // Board State
    const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
    const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.WHITE);
    const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
    const [validMoves, setValidMoves] = useState<Position[]>([]);
    const [kingInCheckPos, setKingInCheckPos] = useState<Position | null>(null);

    // Game Info
    const [gameStatus, setGameStatus] = useState<string>("White's turn to move");
    const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({ [Player.WHITE]: [], [Player.BLACK]: [] });
    const [history, setHistory] = useState<string[]>([]);

    // Timers
    const [timers, setTimers] = useState<{ [key in Player]: number }>({ [Player.WHITE]: Infinity, [Player.BLACK]: Infinity });
    const timerRef = useRef<number | null>(null);

    const difficultyToDepth = (difficulty: Difficulty): number => {
        switch (difficulty) {
            case 'Easy': return 1;
            case 'Medium': return 2;
            case 'Hard': return 3;
            default: return 2;
        }
    };
    
    // Game Setup
    const setupNewGame = useCallback((settings: Omit<GameSettings, 'playerColor' | 'aiColor' | 'aiDepth'>) => {
        let playerColor: Player;
        if (settings.playerChoice === 'random') {
            playerColor = Math.random() < 0.5 ? Player.WHITE : Player.BLACK;
        } else {
            playerColor = settings.playerChoice as Player;
        }
        
        const newGameSettings: GameSettings = {
            ...settings,
            playerColor: playerColor,
            aiColor: playerColor === Player.WHITE ? Player.BLACK : Player.WHITE,
            aiDepth: difficultyToDepth(settings.difficulty),
        };
        
        setGameSettings(newGameSettings);
        setBoard(INITIAL_BOARD);
        setCurrentPlayer(Player.WHITE);
        setSelectedPiece(null);
        setValidMoves([]);
        setKingInCheckPos(null);
        setGameStatus("White's turn to move");
        setCapturedPieces({ [Player.WHITE]: [], [Player.BLACK]: [] });
        setHistory([JSON.stringify(INITIAL_BOARD)]);
        setGameState('playing');

        const timeInSeconds = settings.time === 'unlimited' ? Infinity : settings.time * 60;
        setTimers({
            [Player.WHITE]: timeInSeconds,
            [Player.BLACK]: timeInSeconds,
        });

    }, []);

    const resetGame = useCallback(() => {
        if (gameSettings) {
            setupNewGame({
                playerChoice: gameSettings.playerChoice,
                difficulty: gameSettings.difficulty,
                time: gameSettings.time,
                increment: gameSettings.increment,
            });
        }
    }, [gameSettings, setupNewGame]);
    
    const goToMainMenu = () => {
        setGameState('menu');
        setGameSettings(null);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const updateGameStatus = useCallback((boardState: BoardState, player: Player) => {
        const opponent = player === Player.WHITE ? Player.BLACK : Player.WHITE;
        if (gameLogic.isCheckmate(boardState, opponent)) {
            setGameStatus(`Checkmate! ${player} wins!`);
            return true;
        }
        if (gameLogic.isStalemate(boardState, opponent)) {
            setGameStatus(`Stalemate! ${player} wins!`);
            return true;
        }
        if (gameLogic.isBareKing(boardState, opponent)) {
            setGameStatus(`Bare King! ${player} wins!`);
            return true;
        }
        const boardString = JSON.stringify(boardState);
        const occurrences = history.filter(h => h === boardString).length;
        if (occurrences >= 2) { // Will be 3 on next move
            setGameStatus('Draw by Three-Fold Repetition!');
            return true;
        }
        
        const kingPos = gameLogic.getKingPosition(boardState, opponent);
        if (kingPos && gameLogic.isKingInCheck(boardState, opponent)) {
            setKingInCheckPos(kingPos);
            setGameStatus(`${opponent.charAt(0).toUpperCase() + opponent.slice(1)} is in check`);
        } else {
            setKingInCheckPos(null);
            setGameStatus(`${opponent.charAt(0).toUpperCase() + opponent.slice(1)}'s turn to move`);
        }
        return false;
    }, [history]);
    
    const movePiece = useCallback((from: Position, to: Position) => {
        const pieceToMove = board[from.row][from.col];
        if (!pieceToMove) return;

        const newBoard = board.map(r => [...r]);
        const captured = newBoard[to.row][to.col];

        if (captured) {
            const newCapturedPieces = { ...capturedPieces };
            newCapturedPieces[pieceToMove.player].push(captured);
            setCapturedPieces(newCapturedPieces);
        }

        // Handle pawn promotion
        if (pieceToMove.type === PieceType.PAWN && (to.row === 0 || to.row === 7)) {
            newBoard[to.row][to.col] = { ...pieceToMove, type: PieceType.GENERAL };
        } else {
            newBoard[to.row][to.col] = pieceToMove;
        }
        
        newBoard[from.row][from.col] = null;
        setBoard(newBoard);
        setSelectedPiece(null);
        setValidMoves([]);
        
        const nextPlayer = currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE;
        
        const isGameOver = updateGameStatus(newBoard, currentPlayer);

        if (!isGameOver) {
            setCurrentPlayer(nextPlayer);
             // Add increment if applicable
            if (gameSettings && gameSettings.time !== 'unlimited') {
                const newTimers = { ...timers };
                newTimers[currentPlayer] += gameSettings.increment;
                setTimers(newTimers);
            }
        } else {
             if (timerRef.current) clearInterval(timerRef.current);
        }
        
        setHistory(prev => [...prev, JSON.stringify(newBoard)]);
    }, [board, currentPlayer, updateGameStatus, capturedPieces, gameSettings, timers, history]);

    const handleSquareClick = useCallback((pos: Position) => {
        if (gameStatus.includes('wins') || gameStatus.includes('Draw')) return;
        if (currentPlayer === gameSettings?.aiColor) return; // Don't allow player to move for AI

        const piece = board[pos.row][pos.col];
        
        if (selectedPiece) {
            const isValidMove = validMoves.some(m => m.row === pos.row && m.col === pos.col);
            if (isValidMove) {
                movePiece(selectedPiece, pos);
            } else {
                setSelectedPiece(null);
                setValidMoves([]);
            }
        } else if (piece && piece.player === currentPlayer) {
            setSelectedPiece(pos);
            setValidMoves(gameLogic.getValidMoves(piece, pos, board));
        }
    }, [board, currentPlayer, selectedPiece, validMoves, gameStatus, movePiece, gameSettings]);

    // AI Move logic
    useEffect(() => {
        if (gameSettings && currentPlayer === gameSettings.aiColor && !gameStatus.includes('wins') && !gameStatus.includes('Draw')) {
            setTimeout(() => {
                const bestMove = ai.findBestMove(board, gameSettings.aiDepth, gameSettings.aiColor!);
                if (bestMove) {
                    movePiece(bestMove.from, bestMove.to);
                }
            }, 500); // Small delay for user to see the move
        }
    }, [currentPlayer, gameSettings, board, movePiece, gameStatus]);
    
    // Timer logic
    useEffect(() => {
        if (gameState !== 'playing' || gameSettings?.time === 'unlimited' || gameStatus.includes('wins') || gameStatus.includes('Draw') || history.length <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimers(prevTimers => {
                const newTime = prevTimers[currentPlayer] - 1;
                if (newTime <= 0) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    const winner = currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE;
                    setGameStatus(`Time out! ${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`);
                    return { ...prevTimers, [currentPlayer]: 0 };
                }
                return { ...prevTimers, [currentPlayer]: newTime };
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentPlayer, gameState, gameSettings, gameStatus, history]);
    
    // Main render logic
    if (gameState === 'menu') {
        return <MainMenu onStartGame={setupNewGame} onShowHelp={() => setGameState('help')} />;
    }

    if (gameState === 'help') {
        return <HelpScreen onBack={goToMainMenu} />;
    }

    if (!gameSettings || !gameSettings.playerColor || !gameSettings.aiColor) {
        return <div>Loading...</div>;
    }

    const isGameOver = gameStatus.includes('wins') || gameStatus.includes('Draw');
    const isPlayerBlack = gameSettings.playerColor === Player.BLACK;
    const topPlayer = isPlayerBlack ? Player.WHITE : Player.BLACK;
    const bottomPlayer = isPlayerBlack ? Player.BLACK : Player.WHITE;
    
    return (
        <main className="bg-slate-800 min-h-screen text-white font-sans flex flex-col justify-center items-center p-2 sm:p-4">
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-start gap-4">

                {/* --- Mobile Top Info Bar --- */}
                <div className="w-full md:hidden">
                    <MobileInfoBar 
                        player={topPlayer}
                        isAI={topPlayer === gameSettings.aiColor}
                        time={timers[topPlayer]}
                        isActive={currentPlayer === topPlayer}
                        capturedPieces={capturedPieces[bottomPlayer]}
                    />
                </div>
                
                {/* --- Game Board Area --- */}
                <div className="relative w-full aspect-square max-w-2xl mx-auto md:flex-1">
                    <Board 
                        board={board}
                        selectedPiece={selectedPiece}
                        validMoves={validMoves}
                        onSquareClick={handleSquareClick}
                        kingInCheckPos={kingInCheckPos}
                        isFlipped={isPlayerBlack}
                    />
                    {isGameOver && <GameOverOverlay gameStatus={gameStatus} onReset={resetGame} onGoToMainMenu={goToMainMenu}/>}
                </div>

                {/* --- Desktop Side Panel --- */}
                <div className="w-full md:w-80 lg:w-96 hidden md:block">
                    <SidePanel 
                        gameSettings={gameSettings}
                        timers={timers}
                        currentPlayer={currentPlayer}
                        gameStatus={gameStatus}
                        capturedPieces={capturedPieces}
                        onReset={resetGame}
                        onGoToMainMenu={goToMainMenu}
                    />
                </div>
                
                {/* --- Mobile Bottom Info Bar & Actions --- */}
                <div className="w-full md:hidden">
                    <MobileInfoBar 
                        player={bottomPlayer}
                        isAI={bottomPlayer === gameSettings.aiColor}
                        time={timers[bottomPlayer]}
                        isActive={currentPlayer === bottomPlayer}
                        capturedPieces={capturedPieces[topPlayer]}
                    />
                    <ActionPanel gameStatus={gameStatus} onReset={resetGame} onGoToMainMenu={goToMainMenu} />
                </div>
            </div>
        </main>
    );
};

export default App;
