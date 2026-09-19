import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight, ThumbsUp, PenTool, XCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export default function LeadAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await axios.get(`${API_BASE}/analysis/${id}`);
        setAnalysis({
          company: res.data.company_name || 'Company',
          qualification: res.data.qualification,
          reasons: res.data.qualification_reasons || [],
          missingInfo: res.data.missing_information || [],
          recommendedAction: res.data.recommended_action || '',
          emailDraft: res.data.email_draft || ''
        });
      } catch (err) {
        console.error("Failed to fetch analysis", err);
      }
    };
    
    fetchAnalysis();
  }, [id]);

  if (!analysis) return <div className="p-12 text-center text-zinc-500">Loading analysis...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8 flex justify-between items-end border-b border-zinc-200 pb-6">
        <div>
          <p className="text-sm font-semibold text-zinc-500 tracking-wider uppercase mb-1">Analysis Report</p>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">{analysis.company}</h2>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-semibold ${
          analysis.qualification === 'HIGH' ? 'bg-zinc-900 text-white border-zinc-900' :
          analysis.qualification === 'MEDIUM' ? 'bg-zinc-100 text-zinc-800 border-zinc-200' :
          'bg-white text-zinc-600 border-zinc-200'
        }`}>
          {analysis.qualification === 'HIGH' && <CheckCircle2 className="w-4 h-4" />}
          <span>{analysis.qualification} Priority</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <ThumbsUp className="w-4 h-4 text-zinc-500" />
            Qualification Factors
          </h3>
          <ul className="space-y-3">
            {analysis.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-2 shrink-0"></div>
                <span className="text-sm text-zinc-600 leading-relaxed">{reason}</span>
              </li>
            ))}
            {analysis.reasons.length === 0 && <li className="text-sm text-zinc-500">No specific factors identified.</li>}
          </ul>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-zinc-200">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-zinc-500" />
            Missing Information
          </h3>
          <ul className="space-y-3">
            {analysis.missingInfo.map((info, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-2 shrink-0"></div>
                <span className="text-sm text-zinc-600 leading-relaxed">{info}</span>
              </li>
            ))}
            {analysis.missingInfo.length === 0 && <li className="text-sm text-zinc-500">No missing information detected.</li>}
          </ul>
        </div>
      </div>

      <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-200 mb-8">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Recommended Action</h3>
        <p className="text-zinc-900 text-lg flex items-center gap-2 font-medium">
          <ArrowRight className="w-5 h-5 text-zinc-400" />
          {analysis.recommendedAction}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-zinc-900">Suggested Follow-up</h3>
          <span className="text-[11px] font-semibold bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded tracking-wide uppercase">AI Draft</span>
        </div>
        <div className="p-6">
          <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-700 leading-relaxed">
            {analysis.emailDraft}
          </pre>
        </div>
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 font-medium flex items-center gap-2 transition-colors">
            <XCircle className="w-4 h-4" />
            Reject
          </button>
          <button className="px-4 py-2 text-sm text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 font-medium flex items-center gap-2 transition-colors">
            <PenTool className="w-4 h-4" />
            Edit
          </button>
          <button onClick={() => {
            alert('Action approved! CRM updated.');
            navigate('/');
          }} className="px-5 py-2 text-sm bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            Approve & Send
          </button>
        </div>
      </div>

    </div>
  );
}
