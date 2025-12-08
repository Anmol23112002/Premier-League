import React, { useEffect, useRef } from 'react';
import { useAuctionState } from '../api/hooks';
import TeamGrid from '../components/TeamGrid';

const AuctionDisplayPage: React.FC = () => {
  const state = useAuctionState(500);
  const current = state?.currentPlayer || null;

  // --- SOUND EFFECT LOGIC START ---
  const prevStatusRef = useRef<string>('');

  // --- SIMPLIFIED SOUND LOGIC ---
  useEffect(() => {
    // 1. Log every status change to the console
    if (current?.auctionStatus) {
        console.log("🔥 STATUS DETECTED:", current.auctionStatus);
    }

    // 2. FORCE PLAY on 'Sold'
    if (current?.auctionStatus === 'Sold') {
       console.log("🔊 FOUND 'SOLD' STATUS -> PLAYING NOW!");
       const audio = new Audio('/sounds/sold.mp3');
       audio.play().catch(e => alert("Please CLICK screen! Audio error: " + e));
    }

    // 3. FORCE PLAY on 'Unsold'
    if (current?.auctionStatus === 'Unsold') {
       console.log("🔊 FOUND 'UNSOLD' STATUS -> PLAYING NOW!");
       const audio = new Audio('/sounds/unsold.mp3');
       audio.play().catch(e => console.error(e));
    }
    

  }, [current?.auctionStatus]); // Only run when status changes
  // --- SOUND EFFECT LOGIC END ---
  // --- DEBUGGING LOGS ---
  console.log("Current Status:", current?.auctionStatus);
  console.log("Sold To Team Name:", current?.soldToTeam?.name);
  console.log("Logo URL:", current?.soldToTeam?.logoUrl); // <--- THIS IS THE KEY
  // ----------------------

  
  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-neon-green">
        Live Auction Display
      </h1>

      <div className="grid md:grid-cols-[2fr,1.2fr] gap-4 md:gap-6 items-start">
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-neon-green/40 rounded-2xl p-4 md:p-6 shadow-neon-green">
      {/* --- 1. THE SOLD STAMP --- */}
          {current?.auctionStatus === 'Sold' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="border-[10px] border-neon-green text-neon-green text-8xl md:text-9xl font-black uppercase tracking-widest px-12 py-4 -rotate-12 opacity-0 animate-stamp shadow-[0_0_50px_rgba(57,255,20,0.5)] bg-black/40 backdrop-blur-sm">
                SOLD
              </div>
            </div>
          )}

         {/* --- 2. THE TEAM LOGO (Positioned Lower) --- */}
          {current?.auctionStatus === 'Sold' && current.soldToTeam?.logoUrl && (
            <div className="absolute inset-x-0 top-[115%] flex justify-center z-[60] pointer-events-none">
              {/* - top-[95%]: Starts the container way below the center (where the stamp is).
                  - animate-pop-logo: Your custom animation.
              */}
              <img 
                src={current.soldToTeam.logoUrl} 
                alt="Team Logo" 
                className="w-64 h-64 md:w-80 md:h-80 object-contain animate-pop-logo drop-shadow-2xl"
                style={{ animationDelay: '0.4s' }} 
              />
            </div>
          )}

          {/* --- 3. THE UNSOLD STAMP --- */}
          {current?.auctionStatus === 'Unsold' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden backdrop-grayscale">
              <div className="border-[10px] border-red-600 text-red-600 text-8xl md:text-9xl font-black uppercase tracking-widest px-12 py-4 -rotate-12 opacity-0 animate-stamp shadow-[0_0_50px_rgba(220,38,38,0.5)] bg-black/40 backdrop-blur-sm">
                UNSOLD
              </div>
            </div>
          )}
       
          
          {/* --- STAMP ANIMATIONS END --- */}
          
          {current ? (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-stretch">
              <div className="relative">
                <div
                  className={`rounded-2xl overflow-hidden border border-neon-green/60 bg-black ${
                    current.auctionStatus === 'In Progress'
                      ? 'animate-glow'
                      : ''
                  }`}
                >
                  <img
                    src={
                      current.photoUrl ||
                      'https://via.placeholder.com/320x400.png?text=MPL+Player'
                    }
                    alt={current.name}
                    className="w-44 h-56 md:w-56 md:h-72 object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2 md:space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-4xl font-black tracking-tight mb-4">
                    {current.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide border border-slate-600 text-slate-300">
                    {current.role || 'Player'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wide ${
                      current.auctionStatus === 'Sold'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60'
                        : current.auctionStatus === 'Unsold'
                        ? 'bg-red-500/20 text-red-300 border border-red-400/60'
                        : current.auctionStatus === 'In Progress'
                        ? 'bg-neon-green/20 text-neon-green border border-neon-green/60'
                        : 'bg-slate-700/40 text-slate-200 border border-slate-500/60'
                    }`}
                  >
                    {current.auctionStatus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                  <div>Age: {current.age ?? '-'}</div>
                  <div>Bat: {current.battingStyle || '-'}</div>
                  <div>Bowl: {current.bowlingStyle || '-'}</div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-6 border-t border-slate-800 pt-6">
                  <div className="flex flex-col justify-center">
                    <span className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Set:</span>{' '}
                    <span className="text-white text-3xl font-bold truncate">
                      {state?.currentSet?.name || '—'}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center border-l border-slate-800 pl-8">
                    <span className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Base Price:</span>{' '}
                    <span className="text-neon-red text-4xl font-black">
                      ₹ {current.basePrice}
                    </span>
                  </div>
                  
                  {/* Current Bid - Sized Correctly */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-row items-end gap-4">
                      {/* Label: Reduced to text-2xl */}
                      <span className="text-slate-400 text-2xl font-bold uppercase tracking-widest mb-2">
                          Current Bid:
                      </span>

                      {/* Amount: Reduced to text-6xl */}
                      <span className="text-neon-green text-6xl font-black drop-shadow-lg leading-none">
                          {state?.currentBid ?? current.basePrice}
                      </span>
                  </div>
                </div>

                {current.auctionStatus === 'Sold' && current.soldToTeam && (
                  <div className="mt-2 text-sm">
                    <span className="text-slate-400">Sold To: </span>
                    <span className="font-semibold text-emerald-300">
                      {current.soldToTeam.name}
                    </span>
                    <span className="ml-2 text-slate-400">for</span>
                    <span className="ml-1 font-semibold text-emerald-300">
                      {current.soldPrice}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm md:text-base">
              No player currently in auction. Use the Admin Panel to start.
            </div>
          )}
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-200 mb-2">
            Teams &amp; Budgets
          </div>
          <TeamGrid teams={state?.teams ?? []} />
        </div>
      </div>
    </div>
  );
};

export default AuctionDisplayPage;