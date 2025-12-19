
import React, { useState, useEffect } from 'react';
import { LogEntry, ChecklistTask } from '../types';
import { DEFAULT_TASKS } from '../constants';
import { getGeminiInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ManagerDashboardProps {
  logs: LogEntry[];
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ logs }) => {
  const [aiReport, setAiReport] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const analyzeWithAI = async () => {
    setLoadingAi(true);
    const result = await getGeminiInsights(logs, DEFAULT_TASKS);
    setAiReport(result);
    setLoadingAi(false);
  };

  const getTaskStats = () => {
    const today = new Date().toDateString();
    const todayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === today);
    const requiredTasks = DEFAULT_TASKS.filter(t => t.required);
    const completedRequired = requiredTasks.filter(t => todayLogs.some(l => l.taskId === t.id));
    
    return {
      total: DEFAULT_TASKS.length,
      completed: todayLogs.length,
      requiredLeft: requiredTasks.length - completedRequired.length,
      percentage: Math.round((todayLogs.length / DEFAULT_TASKS.length) * 100)
    };
  };

  const stats = getTaskStats();

  const chartData = [
    { name: 'Mon', completed: 8 },
    { name: 'Tue', completed: 10 },
    { name: 'Wed', completed: 9 },
    { name: 'Thu', completed: 12 },
    { name: 'Fri', completed: 15 },
    { name: 'Sat', completed: 14 },
    { name: 'Sun', completed: stats.completed },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Operations Center</h2>
          <p className="text-slate-500 font-medium">Monitoring site health and safety compliance</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={analyzeWithAI}
            disabled={loadingAi || logs.length === 0}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loadingAi ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <i className="fas fa-wand-magic-sparkles"></i>
            )}
            AI Safety Review
          </button>
          <button className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <i className="fas fa-file-export"></i>
            Export PDF
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Daily Completion" value={`${stats.percentage}%`} icon="fa-chart-line" color="bg-blue-500" />
        <StatCard title="Tasks Logged" value={stats.completed} icon="fa-clipboard-check" color="bg-emerald-500" />
        <StatCard title="Critical Tasks Left" value={stats.requiredLeft} icon="fa-triangle-exclamation" color="bg-amber-500" />
        <StatCard title="Staff Active" value="3" icon="fa-users" color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Completion Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-calendar-week text-slate-400"></i>
            Weekly Log Activity
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#10b981' : '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <i className="fas fa-robot text-8xl"></i>
          </div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
            <i className="fas fa-sparkles text-emerald-400"></i>
            Inspector AI
          </h3>
          
          {aiReport ? (
            <div className="space-y-6 relative z-10">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Compliance Score</span>
                  <span className={`text-xl font-black ${aiReport.complianceScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {aiReport.complianceScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${aiReport.complianceScore}%` }}></div>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{aiReport.summary}"
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Recommendations</h4>
                <ul className="space-y-2">
                  {aiReport.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-500">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                <i className="fas fa-bolt-lightning text-emerald-400 text-2xl"></i>
              </div>
              <p className="text-slate-400 text-sm px-4">Run an AI safety review to get professional insights on your recent logs.</p>
              <button 
                onClick={analyzeWithAI}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Start analysis now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Recent Activity Logs</h3>
          <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Logged By</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.slice(0, 10).map(log => {
                const task = DEFAULT_TASKS.find(t => t.id === log.taskId);
                const isViolation = task?.type === 'TEMPERATURE' && 
                  (Number(log.value) < (task.minTemp || 0) || Number(log.value) > (task.maxTemp || 1000));

                return (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{task?.title}</p>
                      <p className="text-xs text-slate-400">{task?.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={`https://picsum.photos/seed/${log.userId}/40`} className="w-6 h-6 rounded-full" alt="" />
                        <span className="text-sm text-slate-600">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-bold bg-slate-100 px-2 py-1 rounded">
                        {log.value === true ? 'COMPLETED' : `${log.value}°F`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      {isViolation ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                          <i className="fas fa-circle text-[6px]"></i> Violation
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <i className="fas fa-circle text-[6px]"></i> Compliant
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-sm">No activity recorded today yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-slate-200`}>
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h4>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

export default ManagerDashboard;
