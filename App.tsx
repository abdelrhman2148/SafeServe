
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import StaffDashboard from './pages/StaffDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Settings from './pages/Settings';
import { LogEntry, User } from './types';
import { CURRENT_USER } from './constants';

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('safeserve_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('safeserve_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (entry: LogEntry) => {
    setLogs(prev => [entry, ...prev]);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 shrink-0 sticky top-0 md:h-screen">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xl">
              <i className="fas fa-shield-halved"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SafeServe</h1>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Compliance OS</p>
            </div>
          </div>

          <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
            <NavLink to="/" icon="fa-list-check" label="Daily Checklist" />
            <NavLink to="/manager" icon="fa-chart-pie" label="Management" />
            <NavLink to="/settings" icon="fa-sliders" label="Settings" />
          </div>

          <div className="p-4 bg-slate-800/50 mt-auto border-t border-slate-800">
            <div className="flex items-center gap-3">
              <img src={`https://picsum.photos/seed/${CURRENT_USER.id}/100`} className="w-10 h-10 rounded-full bg-slate-700" alt="Profile" />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{CURRENT_USER.name}</p>
                <p className="text-xs text-slate-400 capitalize">{CURRENT_USER.role.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-50 overflow-auto">
          <Routes>
            <Route path="/" element={<StaffDashboard addLog={addLog} logs={logs} />} />
            <Route path="/manager" element={<ManagerDashboard logs={logs} />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

interface NavLinkProps {
  to: string;
  icon: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/' && location.pathname === '');

  return (
    <Link
      to={to}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <i className={`fas ${icon} w-5 text-center ${isActive ? 'text-white' : 'group-hover:text-emerald-400'}`}></i>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};

export default App;
