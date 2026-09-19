import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart3, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, qualified: 0, highPriority: 0, pending: 0 });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(`${API_BASE}/leads`);
        setLeads(res.data);
        
        // Calculate stats
        const qualified = res.data.filter(l => l.status === 'Analyzed' && l.priority === 'High').length;
        const highPriority = res.data.filter(l => l.priority === 'High').length;
        const pending = res.data.filter(l => l.status === 'New').length;
        
        setStats({ total: res.data.length, qualified, highPriority, pending });
      } catch (err) {
        console.error("Failed to fetch leads", err);
      }
    };
    
    fetchLeads();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">Overview</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage and track your lead qualification pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats.total} icon={<Users className="w-5 h-5 text-zinc-600" />} />
        <StatCard title="Qualified" value={stats.qualified} icon={<CheckCircle className="w-5 h-5 text-zinc-600" />} />
        <StatCard title="High Priority" value={stats.highPriority} icon={<BarChart3 className="w-5 h-5 text-zinc-600" />} />
        <StatCard title="Pending Actions" value={stats.pending} icon={<Clock className="w-5 h-5 text-zinc-600" />} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-800">Recent Leads</h3>
        </div>
        <div className="divide-y divide-zinc-100">
          {leads.map(lead => (
            <div key={lead.id} className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">{lead.company_name}</h4>
                <p className="text-sm text-zinc-500 mt-0.5">{lead.industry}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-semibold ${
                  lead.priority === 'High' ? 'bg-zinc-900 text-white' :
                  lead.priority === 'Medium' ? 'bg-zinc-200 text-zinc-700' :
                  'bg-zinc-100 text-zinc-600'
                }`}>
                  {lead.priority} Priority
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-semibold ${
                  lead.status === 'Analyzed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  'bg-zinc-50 text-zinc-600 border border-zinc-200'
                }`}>
                  {lead.status}
                </span>
                <Link to={`/analysis/${lead.id}`} className="text-zinc-400 hover:text-zinc-900 transition-colors ml-2 p-1">
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
          {leads.length === 0 && (
            <div className="p-8 text-center text-sm text-zinc-500">No leads found. Create one to get started.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-zinc-200 flex flex-col gap-3 hover:border-zinc-300 transition-colors">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-medium text-zinc-600">{title}</p>
      </div>
      <div>
        <h4 className="text-2xl font-bold text-zinc-900">{value}</h4>
      </div>
    </div>
  )
}
