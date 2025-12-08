import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { fetchPlayersBySet, useSets, useTeams, useAuctionState } from '../api/hooks';
import type { Player } from '../api/types';

const AdminPanelPage: React.FC = () => {
  const { sets } = useSets();
  const { teams, reload: reloadTeams } = useTeams();
  const auctionState = useAuctionState(3000);

  const [selectedSetId, setSelectedSetId] = useState<string | ''>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [customBid, setCustomBid] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  useEffect(() => {
    if (sets.length && !selectedSetId) {
      setSelectedSetId(sets[0]._id);
    }
  }, [sets, selectedSetId]);

  useEffect(() => {
    if (!selectedSetId) return;
    fetchPlayersBySet(selectedSetId)
      .then((list) => {
        setPlayers(list);
        setCurrentIndex(0);
      })
      .catch(console.error);
  }, [selectedSetId]);

  const current = players[currentIndex];

  const loadPlayers = () => {
    if (!selectedSetId) return;
    fetchPlayersBySet(selectedSetId)
      .then((list) => setPlayers(list))
      .catch(console.error);
  };

  const handleStartAuction = async () => {
    if (!current) return;
    await api.post('/api/auction/start', { playerId: current._id });
    loadPlayers();
  };

  const handleIncrementBid = async () => {
    if (!current) return;
    await api.post('/api/auction/bid', { playerId: current._id, type: 'increment' });
  };

  const handleCustomBid = async () => {
    if (!current) return;
    const val = Number(customBid);
    if (!val || val <= 0) return;
    await api.post('/api/auction/bid', {
      playerId: current._id,
      type: 'custom',
      customAmount: val
    });
  };

  const handleSell = async () => {
    if (!current || !selectedTeamId) return;
    await api.post('/api/auction/sell', {
      playerId: current._id,
      teamId: selectedTeamId
    });
    await Promise.all([loadPlayers(), reloadTeams()]);
  };

  const handleUnsold = async () => {
    if (!current) return;
    await api.post('/api/auction/unsold', { playerId: current._id });
    await loadPlayers();
  };

  const goPrev = () => {
    setCurrentIndex((idx) => Math.max(0, idx - 1));
  };
  const goNext = () => {
    setCurrentIndex((idx) => Math.min(players.length - 1, idx + 1));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-neon-green">
        Admin Panel
      </h1>

      <div className="grid md:grid-cols-[1.3fr,1.2fr] gap-4 md:gap-6">
        <div className="space-y-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-3">
            <div className="text-sm font-semibold text-slate-200">
              Set &amp; Player Selection
            </div>
            <div className="flex gap-2 items-center">
              <select
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm"
                value={selectedSetId}
                onChange={(e) => setSelectedSetId(e.target.value)}
              >
                {sets.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-400">
                Players in set: {players.length}
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto text-xs">
              {players.map((p, idx) => (
                <button
                  key={p._id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full flex justify-between items-center px-2 py-1 rounded-md mb-1 text-left ${
                    idx === currentIndex
                      ? 'bg-neon-green/15 border border-neon-green/60'
                      : 'bg-slate-900/60 border border-slate-800 hover:border-neon-green/40'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] uppercase text-slate-400">
                    {p.auctionStatus}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-slate-200">
                Navigation
              </div>
              <div className="text-xs text-slate-400">
                {players.length
                  ? `Player ${currentIndex + 1} of ${players.length}`
                  : 'No players'}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={goPrev}
                className="flex-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
              >
                Previous
              </button>
              <button
                onClick={goNext}
                className="flex-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-3">
            <div className="text-sm font-semibold text-slate-200">
              Auction Controls
            </div>
            {current ? (
              <>
                <div className="text-sm">
                  <div className="font-semibold">{current.name}</div>
                  <div className="text-xs text-slate-400">
                    Base: {current.basePrice} | Status: {current.auctionStatus}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-slate-400 text-xs">Current Bid</div>
                  <div className="text-xl font-bold text-neon-green">
                    {auctionState?.currentPlayer?._id === current._id
                      ? auctionState.currentBid ?? current.basePrice
                      : current.basePrice}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    onClick={handleStartAuction}
                    className="px-3 py-1 rounded-lg bg-neon-green text-black text-xs font-semibold"
                  >
                    Start Auction
                  </button>
                  <button
                    onClick={handleIncrementBid}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs"
                  >
                    Increase Bid
                  </button>
                  <input
                    type="number"
                    value={customBid}
                    onChange={(e) => setCustomBid(e.target.value)}
                    placeholder="Custom bid"
                    className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs"
                  />
                  <button
                    onClick={handleCustomBid}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs"
                  >
                    Set Bid
                  </button>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400">
                Select a player from the list to begin.
              </div>
            )}
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-3">
            <div className="text-sm font-semibold text-slate-200">
              Sell / Unsold
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
              >
                <option value="">Select Team</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSell}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold"
              >
                Sell to Team
              </button>
              <button
                onClick={handleUnsold}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold"
              >
                Mark Unsold
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;


