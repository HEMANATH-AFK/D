import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, History, Star, Trash2, Filter, 
  ChevronRight, X, Code, ExternalLink, Download, 
  Layers, Database, Cpu, Terminal, ArrowRight,
  Sparkles, Fingerprint, Activity
} from 'lucide-react';
import axios from 'axios';
import Magnetic from '../components/Magnetic';

const HistoryPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [filterDomain, setFilterDomain] = useState('All');

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/ideas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteIdea = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Confirm blueprint purge from Neural Archive?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/ideas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIdeas(ideas.filter(i => i._id !== id));
      if (selectedIdea?._id === id) setSelectedIdea(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredIdeas = ideas
    .filter(i => i.title.toLowerCase().includes(search.toLowerCase()))
    .filter(i => filterDomain === 'All' || i.domain === filterDomain);

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-24 px-6 pb-20 text-slate-200 relative overflow-hidden">
      {/* Background Visual Detail */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 1. CINEMATIC HEADER & FILTERS */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                 <Database className="w-6 h-6 text-cyan-400" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Neural Repository v2.0</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              The <span className="text-cyan-500 not-italic">Archive.</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
          >
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Archive Index..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all backdrop-blur-xl"
              />
            </div>
            <div className="relative group">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select 
                value={filterDomain}
                onChange={e => setFilterDomain(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-full pl-14 pr-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl cursor-pointer"
              >
                <option value="All">All Sectors</option>
                <option value="AI/ML">AI & ML</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Web3">Web3</option>
              </select>
            </div>
          </motion.div>
        </div>

        {/* 2. CINEMATIC GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-80 bg-white/5 border border-white/10 animate-pulse rounded-[3rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredIdeas.map((idea, idx) => (
                <ArchiveCard 
                  key={idea._id} 
                  idea={idea} 
                  idx={idx} 
                  onSelect={() => setSelectedIdea(idea)}
                  onDelete={(e) => deleteIdea(e, idea._id)}
                />
              ))}
            </AnimatePresence>

            {filteredIdeas.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-40 border border-dashed border-white/5 rounded-[4rem]"
              >
                <div className="p-6 bg-white/5 rounded-3xl mb-8 border border-white/5">
                  <Fingerprint className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">No Neural Records</h3>
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Index parameters returned null</p>
              </motion.div>
            )}
          </div>
        )}

        {/* 3. PREMIUM DETAILS MODAL */}
        <AnimatePresence>
          {selectedIdea && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedIdea(null)}
                className="absolute inset-0 bg-[#0B0F19]/95 backdrop-blur-3xl"
              />
              <motion.div 
                layoutId={`card-${selectedIdea._id}`}
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="w-full max-w-5xl bg-[#111827] border border-white/10 rounded-[4rem] shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col cursor-auto"
              >
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
                
                {/* Modal Header */}
                <div className="p-16 pb-0 flex justify-between items-start relative z-10">
                  <div className="flex-1 pr-20">
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-400/20">
                         <Terminal className="w-6 h-6" />
                       </div>
                       <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Blueprint Extraction Complete</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">{selectedIdea.title}</h2>
                  </div>
                  <Magnetic>
                    <button 
                      onClick={() => setSelectedIdea(null)}
                      className="p-5 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all shadow-2xl"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </Magnetic>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-16 pt-10 space-y-20 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7 space-y-16">
                      <section>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6">Manifest Description</h4>
                        <p className="text-slate-300 text-2xl font-medium leading-relaxed">
                          {selectedIdea.description}
                        </p>
                      </section>

                      <section>
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6">Substrate Technologies</h4>
                        <div className="flex flex-wrap gap-3">
                          {selectedIdea.techStack.map((tech, i) => (
                            <span key={i} className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </section>
                    </div>

                    <div className="lg:col-span-5 space-y-12">
                      <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-md">
                        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-12 text-center">Neural Scores</h4>
                        <div className="space-y-12">
                          <HighEndMetric label="Innovation" score={selectedIdea.innovationScore} color="bg-cyan-500" />
                          <HighEndMetric label="Feasibility" score={selectedIdea.feasibilityScore || 8} color="bg-sky-500" />
                        </div>
                      </div>

                      <div className="p-10 rounded-[3rem] bg-gradient-to-br from-cyan-500/10 to-transparent border border-white/10">
                         <div className="flex items-center gap-4 mb-6">
                            <Activity className="w-5 h-5 text-cyan-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cognitive Impact</span>
                         </div>
                         <p className="text-lg text-white/70 font-medium italic">"{selectedIdea.impact || "Architecture shows a high degree of integration readiness."}"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-16 py-10 bg-[#0B0F19] border-t border-white/5 flex flex-wrap gap-6 justify-between items-center relative z-10">
                  <div className="flex gap-6">
                    <Magnetic>
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('toggle-chatbot'))}
                        className="group flex items-center gap-4 px-10 py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-all text-sm shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                      >
                        <ExternalLink className="w-5 h-5" /> START SYNTHESIS
                      </button>
                    </Magnetic>
                    <Magnetic>
                      <button className="flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-full hover:bg-white/10 transition-all text-sm">
                        <Download className="w-5 h-5" /> DOWNLOAD BLUEPRINT
                      </button>
                    </Magnetic>
                  </div>
                  <button 
                    onClick={(e) => deleteIdea(e, selectedIdea._id)}
                    className="flex items-center gap-2 px-6 py-3 text-red-500/40 font-black rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all text-[10px] uppercase tracking-[0.3em]"
                  >
                    <Trash2 className="w-5 h-5" /> PURGE FROM ARCHIVE
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ArchiveCard = ({ idea, idx, onSelect, onDelete }) => (
  <Magnetic strength={0.1}>
    <motion.div
      layoutId={`card-${idea._id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onSelect}
      className="group relative p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:border-cyan-500/50 transition-all cursor-none overflow-hidden h-[450px] flex flex-col"
      data-cursor="VIEW"
    >
      <div className="absolute top-0 right-0 p-12 text-8xl font-black text-white/[0.02] group-hover:text-cyan-500/5 transition-colors uppercase italic pointer-events-none">
        {idx < 9 ? `0${idx + 1}` : idx + 1}
      </div>

      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] bg-cyan-400/10 px-4 py-2 rounded-full border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <Sparkles className="w-4 h-4" /> Score: {idea.innovationScore}.0
        </div>
        <button 
          onClick={onDelete}
          data-cursor="PURGE"
          className="p-3 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <h3 className="font-black text-3xl md:text-4xl text-white mb-6 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-none tracking-tighter uppercase relative z-10">
        {idea.title}
      </h3>
      
      <p className="text-slate-500 text-lg line-clamp-3 mb-10 font-medium leading-relaxed relative z-10 flex-1">
        {idea.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-10 relative z-10">
        {idea.techStack.slice(0, 2).map((tech, i) => (
          <span key={i} className="text-[10px] px-4 py-2 bg-slate-950 border border-white/5 rounded-xl text-slate-500 font-black uppercase tracking-widest">
            {tech}
          </span>
        ))}
        {idea.techStack.length > 2 && (
          <span className="text-[10px] px-4 py-2 bg-slate-950 border border-white/5 rounded-xl text-slate-700 font-black">
            +{idea.techStack.length - 2}
          </span>
        )}
      </div>

      <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] relative z-10">
        <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  </Magnetic>
);

const HighEndMetric = ({ label, score, color }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
      <span>{label}</span>
      <span className="text-white text-lg">{score}.0</span>
    </div>
    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${(score / 10) * 100}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={`h-full ${color} shadow-[0_0_20px_rgba(34,211,238,0.3)]`}
      />
    </div>
  </div>
);

export default HistoryPage;
