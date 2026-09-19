import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export default function AddLead() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    designation: '',
    industry: 'SaaS',
    company_size: '1-50',
    requirement: '',
    budget: 'Not Specified',
    timeline: 'Not Specified',
    source: 'Website'
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/leads`, formData);
      const leadId = res.data.id;
      
      await axios.post(`${API_BASE}/analysis/${leadId}/analyze`);
      navigate(`/analysis/${leadId}`);
    } catch (error) {
      console.error(error);
      alert('Error creating and analyzing lead. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors";
  const labelClasses = "block text-sm font-medium text-zinc-700 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">New Lead</h2>
        <p className="text-sm text-zinc-500 mt-1">Enter the prospect's details to run automated qualification.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Company Name</label>
            <input required type="text" name="company_name" className={inputClasses} onChange={handleChange} placeholder="e.g. Acme Corp" />
          </div>
          
          <div>
            <label className={labelClasses}>Industry</label>
            <select name="industry" className={inputClasses} onChange={handleChange} value={formData.industry}>
              <option value="SaaS">SaaS</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Healthcare">Healthcare</option>
              <option value="FinTech">FinTech</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>Contact Name</label>
            <input required type="text" name="contact_name" className={inputClasses} onChange={handleChange} placeholder="e.g. Jane Doe" />
          </div>

          <div>
            <label className={labelClasses}>Designation</label>
            <input type="text" name="designation" className={inputClasses} onChange={handleChange} placeholder="e.g. CTO" />
          </div>

          <div>
            <label className={labelClasses}>Company Size</label>
            <select name="company_size" className={inputClasses} onChange={handleChange} value={formData.company_size}>
              <option value="1-50">1-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>Lead Source</label>
            <select name="source" className={inputClasses} onChange={handleChange} value={formData.source}>
              <option value="Website">Website Form</option>
              <option value="Outbound">Outbound Cold</option>
              <option value="Referral">Referral</option>
              <option value="Event">Event/Webinar</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>Estimated Budget</label>
            <select name="budget" className={inputClasses} onChange={handleChange} value={formData.budget}>
              <option value="Not Specified">Not Specified</option>
              <option value="< ₹5 Lakhs">&lt; ₹5 Lakhs</option>
              <option value="₹5-10 Lakhs">₹5-10 Lakhs</option>
              <option value="₹10-20 Lakhs">₹10-20 Lakhs</option>
              <option value="> ₹20 Lakhs">&gt; ₹20 Lakhs</option>
            </select>
          </div>

          <div>
            <label className={labelClasses}>Timeline</label>
            <select name="timeline" className={inputClasses} onChange={handleChange} value={formData.timeline}>
              <option value="Not Specified">Not Specified</option>
              <option value="ASAP (1 month)">ASAP (1 month)</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClasses}>Primary Requirement</label>
          <textarea 
            required 
            name="requirement" 
            rows="4" 
            className={`${inputClasses} resize-none`}
            onChange={handleChange}
            placeholder="Describe the prospect's pain points, needs, and what they are looking to achieve..."
          ></textarea>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-md font-medium text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Analyzing...' : 'Analyze Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
