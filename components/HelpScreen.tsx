
import React from 'react';

const HelpScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {

  const RuleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-amber-200 border-b-2 border-slate-600 pb-2 mb-3">{title}</h3>
      <div className="text-slate-300 space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-800 p-4 sm:p-8 flex justify-center items-center font-sans">
      <div className="w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 text-white relative">
        <h2 className="text-4xl font-extrabold text-center mb-6">How to Play Chaturanga</h2>
        
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <RuleSection title="Piece Movements">
            <p><strong>King:</strong> Moves one square in any direction (horizontally, vertically, or diagonally).</p>
            <p><strong>General:</strong> Moves 1 or 2 squares in any direction. It cannot jump over pieces.</p>
            <p><strong>Elephant:</strong> Has two types of moves: 1) It can move one square in any direction (like a King). 2) It can jump to a square exactly two steps away diagonally, jumping over any piece in between.</p>
            <p><strong>Horse:</strong> Moves in an "L" shape: two squares in one direction (horizontal or vertical) and then one square perpendicular to that. It can jump over other pieces.</p>
            <p><strong>Chariot:</strong> Moves any number of unoccupied squares horizontally or vertically.</p>
            <p><strong>Pawn:</strong> Moves one square forward and captures one square diagonally forward. On reaching the opponent's back rank, it is promoted to a General.</p>
          </RuleSection>

          <RuleSection title="Winning the Game">
            <p><strong>Checkmate:</strong> You win by placing the opponent's King in a position where it is under attack (in "check") and there is no legal move to escape the check.</p>
            <p><strong>Stalemate Loss:</strong> If your opponent has no legal moves but is NOT in check, they are stalemated and lose the game. You win.</p>
            <p><strong>Bare King:</strong> If your opponent is left with only their King and no other pieces, they lose the game immediately. You win.</p>
            <p><strong>Time Out:</strong> If you have a time control set and your opponent's timer runs out of time, you win.</p>
          </RuleSection>

          <RuleSection title="Drawing the Game">
            <p><strong>Three-Fold Repetition:</strong> If the exact same board position occurs three times during the game with the same player to move, the game is declared a draw.</p>
          </RuleSection>
        </div>
        
        <div className="text-center mt-6">
          <button onClick={onBack} className="px-8 py-3 bg-amber-600 text-white font-bold text-lg rounded-lg hover:bg-amber-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpScreen;
