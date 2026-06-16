import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ArrowLeftRight, Star, 
  BrainCircuit, Zap, AlertCircle, Check 
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Magnetic from '../components/Magnetic';

/**
 * Compare page component. Allows side-by-side comparative analysis of 
 * two saved blueprints utilizing the `/api/ideas/compare` endpoint.
 */
const Compare = () => {
  const [ideas, setIdeas] = useState([]);
  const [selection, setSelection] = useState({ idA: '', idB: '' });
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/ideas/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIdeas(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCompare = async () => {
    if (!selection.idA || !selection.idB) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/ideas/compare', selection, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComparison(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-slate-200 bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <header className="flex justify-between items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Core
          </button>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Neural Comparison</h1>
        </header>

        {/* Selection Interface */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl">
          <div className="md:col-span-5 space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Subject Alpha</label>
            <select 
              value={selection.idA}
              onChange={(e) => setSelection({ ...selection, idA: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none transition-all"
            >
              <option value="">Select Blueprint</option>
              {ideas.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
          </div>

          <div className="md:col-span-5 space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Subject Beta</label>
            <select 
              value={selection.idB}
              onChange={(e) => setSelection({ ...selection, idB: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none transition-all"
            >
              <option value="">Select Blueprint</option>
              {ideas.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
            </select>
          </div>

          <div className="md:col-span-12 flex justify-center pt-6">
            <Magnetic>
              <button 
                onClick={handleCompare}
                disabled={loading || !selection.idA || !selection.idB}
                className="px-12 py-5 bg-white text-black font-black rounded-full flex items-center gap-3 text-xs tracking-widest hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50"
              >
                {loading ? <Zap className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                INITIATE CROSS-ANALYSIS
              </button>
            </Magnetic>
          </div>
        </section>

        {/* Results */}
        <AnimatePresence mode="wait">
          {comparison && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ComparisonSection title="Innovation Matrix" data={comparison.innovationComparison} />
                <ComparisonSection title="Feasibility Vector" data={comparison.feasibilityComparison} />
                <ComparisonSection title="Market Dynamics" data={comparison.marketComparison} />
                <div className="p-10 rounded-[3rem] bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                    <Star className="w-5 h-5 text-cyan-400" /> Neural Consensus
                  </h3>
                  <p className="text-slate-400 text-lg font-medium italic leading-relaxed">"{comparison.conclusion}"</p>
                  <div className="pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Strategic Recommendation</span>
                    <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5 text-cyan-400 font-bold text-sm">
                      {comparison.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

const ComparisonSection = ({ title, data }) => (
  <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-8">
    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{title}</h3>
    <p className="text-slate-300 font-medium leading-relaxed">{data}</p>
  </div>
);

export default Compare;
