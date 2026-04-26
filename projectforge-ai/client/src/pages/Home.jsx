import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Loader2, Target, Code, TrendingUp, Zap, 
  BrainCircuit, Activity, BarChart3, Clock, ChevronRight, 
  History as HistoryIcon, Layers, Cpu, Radio, Fingerprint
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Magnetic from '../components/Magnetic';

const CountUp = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const end = parseFloat(value);
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount((progress * end).toFixed(value.toString().includes('.') ? 1 : 0));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);
  return <span>{count}</span>;
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState(null);
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgScore: 0, domain: 'AI & Systems' });
  const navigate = useNavigate();

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/ideas/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      setRecentIdeas(data.slice(0, 3));
      if (data.length > 0) {
        const avg = data.reduce((acc, curr) => acc + (curr.innovationScore || 0), 0) / data.length;
        setStats({ total: data.length, avgScore: avg.toFixed(1), domain: 'AI & Systems' });
      }
    } catch (err) { console.error(err); }
  };

  const generateIdea = async () => {
    setLoading(true); setIdea(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/ideas/generate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) { setIdea(res.data.data); fetchDashboardData(); }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 px-6 pb-20 text-slate-200"
    >
      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* 1. CINEMATIC HEADER */}
        <section className="text-center relative py-12 overflow-visible">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] z-0 animate-pulse" />
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-10 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
              Neural Substrate Synced
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 text-white leading-[0.85]">
              Forge the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500">Unforgeable.</span>
            </h1>
            
            <div className="flex justify-center mt-12">
              <Magnetic strength={0.2}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/generator')}
                  disabled={loading}
                  data-cursor="GENERATE"
                  className="px-14 py-7 bg-white text-black font-black rounded-full transition-all disabled:opacity-50 flex items-center gap-4 text-xl shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                >
                  <Zap className="w-6 h-6" />
                  <span>START SYNTHESIS</span>
                </motion.button>
              </Magnetic>
            </div>
          </motion.div>
        </section>

        {/* 2. GENERATED BLUEPRINT LAB */}
        <AnimatePresence mode="wait">
          {idea && (
            <motion.section 
              key={idea._id}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              className="relative"
            >
              <div className="p-12 md:p-20 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] group-hover:bg-cyan-500/20 transition-all duration-1000" />
                
                <div className="flex flex-col lg:flex-row gap-16 relative z-10">
                  <div className="flex-1 space-y-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Substrate Release 01</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic">{idea.title}</h2>
                    <p className="text-slate-400 text-xl md:text-2xl leading-relaxed font-medium max-w-2xl">{idea.description}</p>
                    
                    <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-10">
                      <div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Synthesis Domain</h3>
                        <div className="flex flex-wrap gap-2">
                          {idea.techStack.map((tech, i) => (
                            <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Neural Impact</h3>
                        <p className="text-sm text-slate-400 leading-relaxed italic">"{idea.impact}"</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-96 space-y-8">
                    <ScoreModule label="COGNITIVE SCORE" score={idea.innovationScore} color="bg-cyan-500" icon={<BrainCircuit className="w-5 h-5" />} />
                    <ScoreModule label="SUBSTRATE FEASIBILITY" score={idea.feasibilityScore || 8} color="bg-sky-400" icon={<TrendingUp className="w-5 h-5" />} />
                    <div className="p-8 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Node Recommendation</div>
                       <p className="text-xs text-white/60 font-medium">This architecture is primed for multi-node distribution with a 99.8% semantic match.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* 3. HIGH-END GLASS STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <HighEndGlassCard 
            label="SYNTHESIS VOLUME" 
            value={stats.total} 
            icon={<Target className="w-6 h-6" />}
            cursor="VOLUME"
          />
          <HighEndGlassCard 
            label="SEMANTIC ACCURACY" 
            value={stats.avgScore} 
            suffix="/100"
            icon={<Activity className="w-6 h-6" />}
            cursor="ACCURACY"
          />
          <HighEndGlassCard 
            label="NODE SPECIALTY" 
            value={stats.domain} 
            icon={<BarChart3 className="w-6 h-6" />}
            cursor="NODE"
            isText
          />
        </section>

        {/* 4. LIVE SIGNAL FLUX */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
             <Radio className="w-5 h-5 text-cyan-400" />
             <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Live Signal Flux</h2>
          </div>
          <div className="w-full h-32 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden relative backdrop-blur-xl">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-shimmer" />
             <svg className="w-full h-full p-8" viewBox="0 0 1000 100" preserveAspectRatio="none">
                <motion.path
                  d="M0 50 Q 50 20, 100 50 T 200 50 T 300 80 T 400 50 T 500 20 T 600 50 T 700 80 T 800 50 T 900 20 T 1000 50"
                  fill="none"
                  stroke="rgba(34, 211, 238, 0.4)"
                  strokeWidth="2"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
             </svg>
          </div>
        </section>

        {/* 5. NEURAL ARCHIVE VAULT */}
        <section className="bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-20 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
            <Fingerprint className="w-96 h-96 text-cyan-400" />
          </div>
          
          <div className="flex justify-between items-center mb-16 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
                 <Clock className="w-5 h-5 text-slate-500" />
               </div>
               <h2 className="text-sm font-black text-white uppercase tracking-[0.4em]">Neural Archive</h2>
            </div>
            <Magnetic>
              <button 
                onClick={() => navigate('/history')} 
                data-cursor="OPEN"
                className="group flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.2em]"
              >
                Open Vault <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Magnetic>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {recentIdeas.map((item, idx) => (
              <Magnetic key={idx} strength={0.1}>
                <div 
                  onClick={() => navigate(`/idea/${item._id}`)}
                  className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group"
                >
                   <div className="flex justify-between items-start mb-8">
                     <span className="text-[10px] font-black text-slate-500 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">Shard {idx + 1}</span>
                     <div className="text-xl font-black text-white tracking-tighter">{item.innovationScore}%</div>
                   </div>
                   <h4 className="text-lg font-black text-slate-200 group-hover:text-white transition-colors tracking-tight mb-4 line-clamp-1">{item.title}</h4>
                   <div className="flex flex-wrap gap-2">
                     {item.techStack?.slice(0, 2).map((tech, i) => (
                        <span key={i} className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">#{tech}</span>
                     ))}
                   </div>
                </div>
              </Magnetic>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
};

const HighEndGlassCard = ({ label, value, icon, suffix = "", cursor, isText = false }) => (
  <Magnetic strength={0.15}>
    <div 
      data-cursor={cursor}
      className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl hover:bg-white/10 hover:border-cyan-500/30 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-6">{label}</p>
      <p className={`font-black text-white tracking-tighter ${isText ? 'text-2xl' : 'text-6xl'}`}>
        {isText ? value : <CountUp value={value} />}{suffix}
      </p>
      <div className="mt-8 flex items-center gap-3">
         <div className="w-8 h-[2px] bg-cyan-500/30 group-hover:w-12 group-hover:bg-cyan-500 transition-all" />
         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Secure Link Status</span>
      </div>
    </div>
  </Magnetic>
);

const ScoreModule = ({ label, score, color, icon }) => (
  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md">
    <div className="flex justify-between items-center mb-6">
      <span className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
        {icon} {label}
      </span>
      <span className="text-xl font-black text-white tracking-widest">{score}/10</span>
    </div>
    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${(score / 10) * 100}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={`h-full ${color} shadow-[0_0_20px_rgba(34,211,238,0.4)]`}
      />
    </div>
  </div>
);

export default Home;
