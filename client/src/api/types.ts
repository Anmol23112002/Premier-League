export interface Team {
  _id: string;
  name: string;
  startingBudget: number;
  remainingBudget: number;
  playerCount?: number;
  logoUrl?: string;
}

export interface PlayerSet {
  _id: string;
  name: string;
  defaultBasePrice?: number;
  biddingIncrement: number;
}

export type AuctionStatus = 'Not Started' | 'In Progress' | 'Sold' | 'Unsold';

export interface Player {
  _id: string;
  name: string;
  age?: number;
  battingStyle?: string;
  bowlingStyle?: string;
  role?: string;
  photoUrl?: string;
  basePrice: number;
  auctionStatus: AuctionStatus;
  soldPrice?: number;
  soldToTeam?: Team;
  playerSet?: PlayerSet;
}

export interface AuctionState {
  currentPlayer: Player | null;
  currentBid: number | null;
  currentSet: PlayerSet | null;
  teams: Team[];
}


