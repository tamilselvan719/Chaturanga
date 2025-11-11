import React from 'react';
import { Player } from '../types';

interface TimerProps {
  time: number;
  isActive: boolean;
}

const formatTime = (seconds: number): string => {
  if (seconds === Infinity) return '∞';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Timer: React.FC<TimerProps> = ({ time, isActive }) => {
  const bgColor = isActive ? 'bg-amber-500' : 'bg-slate-700';
  const textColor = isActive ? 'text-slate-900' : 'text-slate-100';

  return (
    <div className={`px-3 py-1 rounded-md transition-colors duration-300 ${bgColor} ${textColor}`}>
      <div className={`text-2xl font-bold font-mono tracking-wide`}>{formatTime(time)}</div>
    </div>
  );
};

export default Timer;