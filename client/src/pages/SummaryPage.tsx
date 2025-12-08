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

  const currentSet: PlayerSet | undefined = sets.find(
    (s) => s._id === selectedSetId
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-neon-green">
        Auction Summary
      </h1>

      <div className="flex gap-2 text-xs md:text-sm">
        <button
          onClick={() => setTab('set')}
          className={`px-3 py-1 rounded-full border ${
            tab === 'set'
              ? 'border-neon-green bg-neon-green/10 text-neon-green'
              : 'border-slate-700 text-slate-300 hover:border-neon-green/60'
          }`}
        >
          By Set
        </button>
        <button
          onClick={() => setTab('team')}
          className={`px-3 py-1 rounded-full border ${
            tab === 'team'
              ? 'border-neon-green bg-neon-green/10 text-neon-green'
              : 'border-slate-700 text-slate-300 hover:border-neon-green/60'
          }`}
        >
          By Team
        </button>
        <button
          onClick={() => setTab('global')}
          className={`px-3 py-1 rounded-full border ${
            tab === 'global'
              ? 'border-neon-green bg-neon-green/10 text-neon-green'
              : 'border-slate-700 text-slate-300 hover:border-neon-green/60'
          }`}
        >
          Global
        </button>
      </div>

      {tab === 'set' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-300">Set:</span>
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs"
              value={selectedSetId}
              onChange={(e) => setSelectedSetId(e.target.value)}
            >
              {sets.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-500">
              Players: {setPlayers.length}
            </span>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="min-w-full border border-slate-800 rounded-lg overflow-hidden text-left">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-2 py-1 border-b border-slate-800">Player</th>
                  <th className="px-2 py-1 border-b border-slate-800">Status</th>
                  <th className="px-2 py-1 border-b border-slate-800">
                    Sold Price
                  </th>
                  <th className="px-2 py-1 border-b border-slate-800">Team</th>
                </tr>
              </thead>
              <tbody>
                {setPlayers.map((p) => (
                  <tr key={p._id} className="odd:bg-slate-950/60">
                    <td className="px-2 py-1">{p.name}</td>
                    <td className="px-2 py-1">{p.auctionStatus}</td>
                    <td className="px-2 py-1">{p.soldPrice ?? '-'}</td>
                    <td className="px-2 py-1">
                      {(p.soldToTeam as any)?.name ?? '-'}
                    </td>
                  </tr>
                ))}
                {!setPlayers.length && (
                  <tr>
                    <td
                      className="px-2 py-2 text-slate-400 text-center"
                      colSpan={4}
                    >
                      No players in this set yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-300">Team:</span>
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs"
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
            <>
              <div className="text-xs text-slate-300">
                <div>
                  Total Spent:{' '}
                  <span className="font-semibold text-neon-green">
                    {teamSummary.totals.totalSpent}
                  </span>
                </div>
                <div>
                  Remaining Budget:{' '}
                  <span className="font-semibold">
                    {teamSummary.totals.remainingBudget}
                  </span>
                </div>
                <div>Players: {teamSummary.totals.playerCount}</div>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="min-w-full border border-slate-800 rounded-lg overflow-hidden text-left">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-2 py-1 border-b border-slate-800">
                        Player
                      </th>
                      <th className="px-2 py-1 border-b border-slate-800">
                        Role
                      </th>
                      <th className="px-2 py-1 border-b border-slate-800">
                        Set
                      </th>
                      <th className="px-2 py-1 border-b border-slate-800">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamSummary.players.map((p) => (
                      <tr key={p._id} className="odd:bg-slate-950/60">
                        <td className="px-2 py-1">{p.name}</td>
                        <td className="px-2 py-1">{p.role ?? '-'}</td>
                        <td className="px-2 py-1">
                          {(p.playerSet as PlayerSet | undefined)?.name ?? '-'}
                        </td>
                        <td className="px-2 py-1">{p.soldPrice ?? '-'}</td>
                      </tr>
                    ))}
                    {!teamSummary.players.length && (
                      <tr>
                        <td
                          className="px-2 py-2 text-slate-400 text-center"
                          colSpan={4}
                        >
                          This team has not bought any players yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'global' && globalSummary && (
        <div className="grid md:grid-cols-4 gap-3 text-sm">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs">Total Players</div>
            <div className="text-2xl font-bold mt-1">
              {globalSummary.totalPlayers}
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs">Sold</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {globalSummary.totalSold}
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs">Unsold</div>
            <div className="text-2xl font-bold text-red-400 mt-1">
              {globalSummary.totalUnsold}
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400 text-xs">Total Money Spent</div>
            <div className="text-2xl font-bold text-neon-green mt-1">
              {globalSummary.totalMoneySpent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;


