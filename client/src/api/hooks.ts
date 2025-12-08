import { useEffect, useState } from 'react';
import api from './client';
import type { AuctionState, PlayerSet, Team, Player } from './types';

export function useAuctionState(pollMs = 3000) {
  const [state, setState] = useState<AuctionState | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchState = async () => {
      try {
        const res = await api.get<AuctionState>('/api/auction/current-state');
        if (!cancelled) setState(res.data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    };

    fetchState();
    const id = setInterval(fetchState, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollMs]);

  return state;
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);

  const load = async () => {
    const res = await api.get<Team[]>('/api/teams');
    setTeams(res.data);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  return { teams, reload: load };
}

export function useSets() {
  const [sets, setSets] = useState<PlayerSet[]>([]);

  const load = async () => {
    const res = await api.get<PlayerSet[]>('/api/sets');
    setSets(res.data);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  return { sets, reload: load };
}

export async function fetchPlayersBySet(setId: string): Promise<Player[]> {
  const res = await api.get<Player[]>(`/api/sets/${setId}/players`);
  return res.data;
}


