import React, { useState, useEffect } from 'react';

const AdminGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  // OPTIONAL: Remember login for this session so you don't have to type it every refresh
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('mpl_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // --- SET YOUR SECRET PIN HERE ---
    const SECRET_PIN = "2311"; 
    // -------------------------------

    if (pin === SECRET_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('mpl_admin_auth', 'true');
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
        <p className="text-slate-400 text-sm mb-6">Enter the PIN to control the auction.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-black/50 border border-slate-600 rounded-lg px-4 py-3 text-center text-xl tracking-widest text-white focus:border-neon-green focus:outline-none transition-colors"
            placeholder="Enter PIN"
            autoFocus
          />
          
          {error && (
            <div className="text-red-500 text-sm font-semibold animate-pulse">
              Incorrect PIN
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-neon-green/90 hover:bg-neon-green text-black font-bold py-3 rounded-lg transition-all transform active:scale-95"
          >
            Unlock Panel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminGate;