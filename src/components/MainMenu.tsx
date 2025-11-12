
import React, { useState } from 'react';
import { GameSettings, PlayerColorChoice, Difficulty, TimeOption, IncrementOption } from '../types';
import { unlockAudio } from '../services/soundService';

interface MainMenuProps {
  onStartGame: (settings: Omit<GameSettings, 'playerColor' | 'aiColor' | 'aiDepth'>) => void;
  onShowHelp: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowHelp }) => {
  const [playerChoice, setPlayerChoice] = useState<PlayerColorChoice>('random');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [time, setTime] = useState<TimeOption>(10);
  const [increment, setIncrement] = useState<IncrementOption>(5);

  const handleStart = () => {
    unlockAudio();
    onStartGame({ playerChoice, difficulty, time, increment });
  };
  
  const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-center w-full">
      <label className="text-lg text-slate-300">{label}</label>
      <div className="w-1/2">{children}</div>
    </div>
  );
  
  const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className={`bg-slate-700 border border-slate-600 text-white text-md rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {props.children}
    </select>
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-800 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-900 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white tracking-wider">Chaturanga</h1>
          <p className="text-xl text-amber-200 mt-2">The Ancient Game of Chess</p>
        </div>
        
        <div className="space-y-6">
           <SettingRow label="Play as">
              <Select value={playerChoice} onChange={(e) => setPlayerChoice(e.target.value as PlayerColorChoice)}>
                <option value="random">Random</option>
                <option value="white">White</option>
                <option value="black">Black</option>
              </Select>
            </SettingRow>

            <SettingRow label="Difficulty">
              <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Select>
            </SettingRow>

            <SettingRow label="Time">
              <Select value={time} onChange={(e) => setTime(e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value) as TimeOption)}>
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={30}>30 min</option>
                <option value="unlimited">Unlimited</option>
              </Select>
            </SettingRow>

            <SettingRow label="Increment">
              <Select value={increment} onChange={(e) => setIncrement(Number(e.target.value) as IncrementOption)} disabled={time === 'unlimited'}>
                <option value={1}>1 sec</option>
                <option value={5}>5 sec</option>
                <option value={10}>10 sec</option>
              </Select>
            </SettingRow>
        </div>
        
        <div className="flex flex-col space-y-4">
           <button onClick={handleStart} className="w-full px-6 py-3 bg-amber-600 text-white font-bold text-xl rounded-lg hover:bg-amber-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400">
             Start Game
           </button>
            <button onClick={onShowHelp} className="w-full px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500">
             How to Play
           </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
