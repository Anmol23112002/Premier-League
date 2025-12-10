import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useSets, useTeams } from '../api/hooks';
import type { Player, PlayerSet, Team } from '../api/types';

type Tab = 'set' | 'team' | 'global';

interface TeamSummary {
  team: Team;
  players: Player[];
  totals: { totalSpent: number; remainingBudget: number; playerCount: number };
}

interface GlobalSummary {
  totalPlayers: number;
  totalSold: number;
  totalUnsold: number;
  totalMoneySpent: number;
}

const SummaryPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('set');
  const { sets } = useSets();
  const { teams } = useTeams();

  const [selectedSetId, setSelectedSetId] = useState<string | ''>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | ''>('');

  const [setPlayers, setSetPlayers] = useState<Player[]>([]);
  const [teamSummary, setTeamSummary] = useState<TeamSummary | null>(null);
  const [globalSummary, setGlobalSummary] = useState<GlobalSummary | null>(null);

  // --- NEW: State for the Player Popup ---
  const [viewPlayer, setViewPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (sets.length && !selectedSetId) setSelectedSetId(sets[0]._id);
  }, [sets, selectedSetId]);

  useEffect(() => {
    if (teams.length && !selectedTeamId) setSelectedTeamId(teams[0]._id);
  }, [teams, selectedTeamId]);

  useEffect(() => {
    if (!selectedSetId) return;
    api
      .get<Player[]>(`/api/summary/by-set/${selectedSetId}`)
      .then((res) => setSetPlayers(res.data))
      .catch(console.error);
  }, [selectedSetId]);

  useEffect(() => {
    if (!selectedTeamId) return;
    api
      .get<TeamSummary>(`/api/summary/by-team/${selectedTeamId}`)
      .then((res) => setTeamSummary(res.data))
      .catch(console.error);
  }, [selectedTeamId]);

  useEffect(() => {
    api
      .get<GlobalSummary>('/api/summary/global')
      .then((res) => setGlobalSummary(res.data))
      .catch(console.error);
  }, []);

  // Helper to colorize status
  const getStatusBadge = (status: string) => {
    if (status === 'Sold')
      return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">SOLD</span>;
    if (status === 'Unsold')
      return <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">UNSOLD</span>;
    return <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm uppercase">{status}</span>;
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-[95%] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black tracking-widest text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.4)] uppercase">
          Auction Summary
        </h1>
        
        {/* BIG TABS */}
        <div className="flex bg-slate-900 p-1 rounded-full border border-slate-700">
          {(['set', 'team', 'global'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-8 py-3 rounded-full text-lg font-bold uppercase tracking-wide transition-all ${
                tab === t
                  ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.6)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* --- TAB 1: BY SET --- */}
      {tab === 'set' && (
        <div className="space-y-6 animate-slide-in-up">
          <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700 w-fit">
            <span className="text-slate-300 text-lg font-semibold uppercase">Select Set:</span>
            <select
              className="bg-black border border-slate-600 rounded-lg px-4 py-2 text-lg text-white focus:border-neon-green outline-none"
              value={selectedSetId}
              onChange={(e) => setSelectedSetId(e.target.value)}
            >
              {sets.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <span className="text-slate-500 text-base font-mono bg-slate-800 px-3 py-1 rounded-md">
              Count: {setPlayers.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
            <table className="min-w-full text-left">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-sm font-bold">
                <tr>
                  <th className="px-6 py-4">Player Name</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Sold Price</th>
                  <th className="px-6 py-4">Sold To Team</th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/40 divide-y divide-slate-800 text-lg">
                {setPlayers.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/60 transition-colors group">
                    <td className="px-6 py-4">
                      {/* CLICKABLE NAME */}
                      <button 
                        onClick={() => setViewPlayer(p)}
                        className="font-bold text-white text-xl hover:text-neon-green hover:underline decoration-neon-green underline-offset-4 text-left transition-all"
                      >
                        {p.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(p.auctionStatus)}</td>
                    <td className="px-6 py-4 text-right font-mono text-neon-green font-bold text-xl">
                      {p.soldPrice ? `₹ ${p.soldPrice}` : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-300 text-lg">
                      {(p.soldToTeam as any)?.name ?? <span className="text-slate-600">-</span>}
                    </td>
                  </tr>
                ))}
                {!setPlayers.length && (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500 text-xl" colSpan={4}>
                      No players found in this set.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: BY TEAM --- */}
      {tab === 'team' && (
        <div className="space-y-6 animate-slide-in-up">
          <div className="flex flex-wrap items-center justify-between gap-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-4">
                <span className="text-slate-300 text-xl font-semibold uppercase">Select Team:</span>
                <select
                className="bg-black border border-slate-600 rounded-lg px-4 py-2 text-xl text-white focus:border-neon-green outline-none min-w-[250px]"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                >
                {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                    {t.name}
                    </option>
                ))}
                </select>
            </div>
            
            {teamSummary && (
                <div className="flex gap-8 text-right">
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-widest">Total Spent</div>
                        <div className="text-3xl font-black text-neon-green">₹ {teamSummary.totals.totalSpent}</div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-widest">Remaining</div>
                        <div className="text-3xl font-bold text-white">₹ {teamSummary.totals.remainingBudget}</div>
                    </div>
                    <div>
                        <div className="text-slate-500 text-xs uppercase tracking-widest">Players</div>
                        <div className="text-3xl font-bold text-slate-300">{teamSummary.totals.playerCount}</div>
                    </div>
                </div>
            )}
          </div>

          {teamSummary && (
            <div className="overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-sm font-bold">
                    <tr>
                      <th className="px-6 py-4">Player Name</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Original Set</th>
                      <th className="px-6 py-4 text-right">Price Paid</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900/40 divide-y divide-slate-800 text-lg">
                    {teamSummary.players.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-800/60 transition-colors group">
                        <td className="px-6 py-4">
                           {/* CLICKABLE NAME */}
                           <button 
                            onClick={() => setViewPlayer(p)}
                            className="font-bold text-white text-xl hover:text-neon-green hover:underline decoration-neon-green underline-offset-4 text-left transition-all"
                          >
                            {p.name}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{p.role ?? '-'}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm uppercase tracking-wide">
                          {(p.playerSet as PlayerSet | undefined)?.name ?? '-'}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-neon-green font-bold text-xl">
                            ₹ {p.soldPrice ?? '-'}
                        </td>
                      </tr>
                    ))}
                    {!teamSummary.players.length && (
                      <tr>
                        <td className="px-6 py-8 text-center text-slate-500 text-xl" colSpan={4}>
                          This team has not bought any players yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: GLOBAL STATS --- */}
      {tab === 'global' && globalSummary && (
        <div className="grid md:grid-cols-4 gap-6 animate-slide-in-up">
          {/* Card 1 */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center gap-2">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Players</div>
            <div className="text-6xl font-black text-white">{globalSummary.totalPlayers}</div>
          </div>
          {/* Card 2 */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center gap-2">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sold</div>
            <div className="text-6xl font-black text-emerald-400">{globalSummary.totalSold}</div>
          </div>
          {/* Card 3 */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center gap-2">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Unsold</div>
            <div className="text-6xl font-black text-red-500">{globalSummary.totalUnsold}</div>
          </div>
          {/* Card 4 */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center gap-2 border-neon-green/30 shadow-neon-green/10">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Money Spent</div>
            <div className="text-5xl font-black text-neon-green">₹ {globalSummary.totalMoneySpent}</div>
          </div>
        </div>
      )}

      {/* --- PLAYER DETAIL MODAL --- */}
      {viewPlayer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setViewPlayer(null)}>
          <div 
            className="bg-slate-950 border border-neon-green/40 rounded-2xl max-w-3xl w-full overflow-hidden shadow-[0_0_60px_rgba(57,255,20,0.15)] relative flex flex-col md:flex-row animate-scale-up" 
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setViewPlayer(null)}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-red-500/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all border border-slate-600"
            >
              ✕
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-2/5 h-64 md:h-auto bg-slate-900 relative">
              <img 
                src={viewPlayer.photoUrl || 'https://via.placeholder.com/320x400.png?text=No+Image'} 
                alt={viewPlayer.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                 <span className="bg-neon-green text-black px-3 py-1 text-xs font-bold uppercase rounded-sm">
                    {viewPlayer.role}
                 </span>
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 p-8 flex flex-col justify-between">
               <div>
                  <h2 className="text-4xl font-black text-white mb-1 uppercase italic tracking-wider">{viewPlayer.name}</h2>
                  <div className="text-slate-400 text-lg mb-6">Age: {viewPlayer.age ?? 'N/A'}</div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                     <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <div className="text-slate-500 uppercase text-xs font-bold">Batting</div>
                        <div className="text-white font-semibold">{viewPlayer.battingStyle ?? '-'}</div>
                     </div>
                     <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <div className="text-slate-500 uppercase text-xs font-bold">Bowling</div>
                        <div className="text-white font-semibold">{viewPlayer.bowlingStyle ?? '-'}</div>
                     </div>
                  </div>
               </div>

               {/* Sale Info Box */}
               <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700">
                  {viewPlayer.auctionStatus === 'Sold' ? (
                    <div className="flex items-center justify-between">
                       <div>
                          <div className="text-emerald-400 text-xs font-bold uppercase mb-1">Sold To</div>
                          <div className="text-white text-2xl font-bold leading-none">
                            {(viewPlayer.soldToTeam as any)?.name ?? 'Unknown Team'}
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-slate-500 text-xs font-bold uppercase mb-1">Price</div>
                          <div className="text-neon-green text-3xl font-black">₹ {viewPlayer.soldPrice}</div>
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                       <div className="text-slate-400 text-sm font-semibold uppercase">Status</div>
                       <div>{getStatusBadge(viewPlayer.auctionStatus)}</div>
                    </div>
                  )}
                  {viewPlayer.auctionStatus === 'Sold' && (viewPlayer.soldToTeam as any)?.logoUrl && (
                     <div className="mt-4 pt-4 border-t border-slate-800 flex justify-center">
                        <img 
                          src={(viewPlayer.soldToTeam as any).logoUrl} 
                          alt="Team Logo" 
                          className="h-16 object-contain opacity-80"
                        />
                     </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;