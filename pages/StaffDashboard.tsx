
import React, { useState } from 'react';
import { ChecklistTask, LogEntry, TaskCategory } from '../types';
import { DEFAULT_TASKS, CURRENT_USER } from '../constants';

interface StaffDashboardProps {
  logs: LogEntry[];
  addLog: (entry: LogEntry) => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ logs, addLog }) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'ALL'>('ALL');
  
  const categories = Object.values(TaskCategory);
  
  const filteredTasks = selectedCategory === 'ALL' 
    ? DEFAULT_TASKS 
    : DEFAULT_TASKS.filter(t => t.category === selectedCategory);

  const isTaskCompletedToday = (taskId: string) => {
    const today = new Date().toDateString();
    return logs.some(l => l.taskId === taskId && new Date(l.timestamp).toDateString() === today);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Daily Operations</h2>
        <p className="text-slate-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
        <button 
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${
            selectedCategory === 'ALL' 
              ? 'bg-emerald-600 text-white border-emerald-600' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-200'
          }`}
        >
          All Tasks
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === cat 
                ? 'bg-emerald-600 text-white border-emerald-600' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredTasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            isCompleted={isTaskCompletedToday(task.id)} 
            onLog={(val, notes) => {
              addLog({
                id: `log-${Date.now()}`,
                taskId: task.id,
                userId: CURRENT_USER.id,
                userName: CURRENT_USER.name,
                timestamp: new Date().toISOString(),
                value: val,
                notes: notes
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: ChecklistTask;
  isCompleted: boolean;
  onLog: (value: any, notes?: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isCompleted, onLog }) => {
  const [inputValue, setInputValue] = useState('');
  const [notes, setNotes] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLog(task.type === 'CHECKBOX' ? true : inputValue, notes);
    setShowLogForm(false);
    setInputValue('');
    setNotes('');
  };

  const getStatusColor = () => {
    if (isCompleted) return 'bg-emerald-50 border-emerald-200';
    if (task.required) return 'bg-white border-amber-200';
    return 'bg-white border-slate-200';
  };

  return (
    <div className={`p-5 rounded-2xl border-2 transition-all ${getStatusColor()} ${isCompleted ? 'opacity-75' : 'shadow-sm hover:shadow-md'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-tighter">
              {task.category}
            </span>
            {task.required && !isCompleted && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 uppercase">
                Required
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-800">{task.title}</h3>
          <p className="text-sm text-slate-500 mb-4">{task.description}</p>
        </div>

        {isCompleted ? (
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
            <i className="fas fa-check"></i>
          </div>
        ) : (
          <button 
            onClick={() => task.type === 'CHECKBOX' ? onLog(true) : setShowLogForm(!showLogForm)}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-emerald-600 transition-colors"
          >
            {task.type === 'CHECKBOX' ? 'Done' : 'Record'}
          </button>
        )}
      </div>

      {!isCompleted && showLogForm && (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {task.type === 'TEMPERATURE' ? 'Current Temperature (°F)' : 'Details / Observations'}
            </label>
            <input 
              required
              type={task.type === 'TEMPERATURE' ? 'number' : 'text'}
              step={task.type === 'TEMPERATURE' ? '0.1' : undefined}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={task.type === 'TEMPERATURE' ? 'e.g. 38.5' : 'Enter details...'}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Notes (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any issues or corrective actions taken?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-3">
            <button 
              type="submit"
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
            >
              Submit Entry
            </button>
            <button 
              type="button"
              onClick={() => setShowLogForm(false)}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StaffDashboard;
