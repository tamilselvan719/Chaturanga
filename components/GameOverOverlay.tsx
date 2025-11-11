
import React from 'react';

interface GameOverOverlayProps {
  gameStatus: string;
  onReset: () => void;
  onGoToMainMenu: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ gameStatus, onReset, onGoToMainMenu }) => {
  const [titlePart, ...subtitleParts] = gameStatus.split('! ');
  const title = titlePart ? `${titlePart}!` : '';
  const subtitle = subtitleParts.join('! ');

  return (
    <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center z-30 gap-6">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg text-center px-4">{title}</h2>
        {subtitle && <p className="text-2xl text-amber-200 drop-shadow-md text-center px-4">{subtitle}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onReset}
          className="px-8 py-4 bg-amber-600 text-white font-bold text-xl rounded-lg hover:bg-amber-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
        >
          Play Again
        </button>
        <button
          onClick={onGoToMainMenu}
          className="px-8 py-4 bg-slate-600 text-white font-bold text-xl rounded-lg hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 shadow-lg"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default GameOverOverlay;
