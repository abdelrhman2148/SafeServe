
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-10">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Settings</h2>
        <p className="text-slate-500 font-medium">Manage your restaurant and team</p>
      </header>

      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-800">Establishment Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Restaurant Name</label>
            <input type="text" defaultValue="Mama's Italian Bistro" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Health Department ID</label>
            <input type="text" defaultValue="HD-9941-NYC" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
            <input type="text" defaultValue="123 Culinary Way, Brooklyn, NY" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Manage Staff</h3>
          <button className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
            + Add Member
          </button>
        </div>
        <div className="space-y-4">
          <StaffMember name="Alex Rivera" role="Manager" email="alex@mamas.com" />
          <StaffMember name="Jamie Chen" role="Chef" email="jamie@mamas.com" />
          <StaffMember name="Sam Smith" role="Staff" email="sam@mamas.com" />
        </div>
      </section>

      <section className="bg-emerald-600 p-8 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-100">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">SafeServe Pro</h3>
          <p className="text-emerald-100 text-sm opacity-90">Upgrade to unlock multi-location support, advanced analytics, and SMS alerts.</p>
        </div>
        <button className="px-8 py-3 bg-white text-emerald-600 font-black rounded-xl hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/20 whitespace-nowrap">
          Upgrade Now - $15/mo
        </button>
      </section>
    </div>
  );
};

const StaffMember: React.FC<{ name: string; role: string; email: string }> = ({ name, role, email }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group">
    <div className="flex items-center gap-4">
      <img src={`https://picsum.photos/seed/${name}/100`} className="w-12 h-12 rounded-full border-2 border-slate-50" alt="" />
      <div>
        <p className="font-bold text-slate-800">{name}</p>
        <p className="text-xs text-slate-500">{role} • {email}</p>
      </div>
    </div>
    <button className="p-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
      <i className="fas fa-trash-can"></i>
    </button>
  </div>
);

export default Settings;
