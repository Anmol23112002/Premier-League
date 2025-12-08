import React from 'react';
import type { Team } from '../api/types';

interface Props {
  teams: Team[];
}

const TeamGrid: React.FC<Props> = ({ teams }) => {
  if (!teams.length) {
    return <div className="text-sm text-slate-400">No teams yet.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-4 w-full h-full">
      {teams.map((t) => {
        const spent = t.startingBudget - t.remainingBudget;
        const pct = Math.min(
          100,
          Math.max(0, (spent / (t.startingBudget || 1)) * 100)
        );
        return (
          <div
            key={t._id}
            className="bg-slate-900/80 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between min-h-[160px]"
          >
            <div>
              {/* Team Name */}
              <div className="font-bold text-sm md:text-base text-white leading-tight mb-3 break-words">
                {t.name}
              </div>
              
              {/* CHANGED: Budget Info - Much Bigger */}
              <div className="text-slate-400 text-sm">
                Rem: <span className="text-neon-green font-bold text-xl md:text-2xl">{t.remainingBudget}</span>
              </div>
            </div>

            <div className="mt-3">
              {/* Progress Bar */}
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${
                    pct > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-neon-green to-emerald-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              
              {/* Stats Row */}
              <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
                <span>Spent: {spent}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  Players: {t.playerCount ?? 0}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamGrid;