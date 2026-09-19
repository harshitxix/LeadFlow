import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddLead from './pages/AddLead';
import LeadAnalysis from './pages/LeadAnalysis';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
        <nav className="bg-white border-b border-zinc-200 px-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
              LeadFlow
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Dashboard</Link>
              <Link to="/add-lead" className="text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-md transition-all shadow-sm">
                New Lead
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-10 px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-lead" element={<AddLead />} />
            <Route path="/analysis/:id" element={<LeadAnalysis />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;
