import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-900 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-black/70 backdrop-blur">
        <div className="max-w-[95%] mx-auto px-4 py-4 flex flex-col items-center gap-2">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold tracking-[0.25em] uppercase text-neon-green drop-shadow-[0_0_12px_rgba(132,249,115,0.9)]">
              The Loozer’s Club
            </div>
            <div className="mt-1 text-sm md:text-base tracking-[0.3em] uppercase text-slate-400">
              Meghahatuburu Premier League (MPL)
            </div>
          </div>
          <nav className="flex gap-3 text-xs md:text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full border ${
                  isActive
                    ? 'border-neon-green bg-neon-green/10 text-neon-green'
                    : 'border-slate-700 text-slate-300 hover:border-neon-green/60'
                }`
              }
            >
              Auction Display
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full border ${
                  isActive
                    ? 'border-neon-green bg-neon-green/10 text-neon-green'
                    : 'border-slate-700 text-slate-300 hover:border-neon-green/60'
                }`
              }
            >
              Admin Panel
            </NavLink>
            <NavLink
              to="/summary"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full border ${
                  isActive
                    ? 'border-neon-green bg-neon-green/10 text-neon-green'
                    : 'border-slate-700 text-slate-300 hover:border-neon-green/60'
                }`
              }
            >
              Summary
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-[95%] mx-auto w-full px-3 md:px-4 py-4 md:py-6">
        {children}
      </main>
      <footer className="text-center text-xs text-slate-500 py-2 border-t border-slate-800">
        <Link to="/" className="hover:text-neon-green">
          MPL Auction Display
        </Link>
      </footer>
    </div>
  );
};

export default Layout;


