import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Brain, Activity, Layers, Cpu, 
  ChevronRight, Calendar, ArrowUpRight 
} from 'lucide-react';
import axios from 'axios';
import Magnetic from '../components/Magnetic';

// 1. AI THINKING CORE
const AIThinkingCore = ({ ideasCount, score }) => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-visible">
      {/* Outer Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-80 h-80 border border-cyan-500/10 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-64 h-64 border border-sky-500/20 rounded-full border-dashed"
      />

      {/* Central Core */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-40 h-40 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-400 to-sky-600 rounded-full shadow-[0_0_50px_rgba(34,211,238,0.5)] flex items-center justify-center group overflow-hidden">
          <Brain className="w-16 h-16 text-black/80 z-10" />
          <div className="absolute inset-0 bg-white/20 group-hover:translate-y-full transition-transform duration-1000" />
        </div>
      </motion.div>

      {/* Orbiting Labels */}
      <OrbitingLabel angle={0} distance={180} label="Ideas Generated" value={ideasCount} />
      <OrbitingLabel angle={120} distance={180} label="Quality Index" value={`${score}%`} />
      <OrbitingLabel angle={240} distance={180} label="Neural Nodes" value="1.2k" />
    </div>
  );
};

const OrbitingLabel = ({ angle, distance, label, value }) => (
  <motion.div 
    animate={{ 
      x: Math.cos(angle * Math.PI / 180) * distance,
      y: Math.sin(angle * Math.PI / 180) * distance,
    }}
    className="absolute flex flex-col items-center bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl"
  >
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
    <span className="text-xl font-black text-white tracking-tighter">{value}</span>
  </motion.div>
);

// 2. LIVE SIGNAL STREAM
const LiveSignalStream = () => {
  return (
    <div className="w-full h-32 bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-shimmer" />
      <svg className="w-full h-full p-6" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <motion.path
          d="M0 50 Q 50 10, 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50 T 700 50 T 800 50 T 900 50 T 1000 50"
          fill="none"
          stroke="rgba(34, 211, 238, 0.4)"
          strokeWidth="2"
          animate={{
            d: [
              "M0 50 Q 50 80, 100 50 T 200 50 T 300 20 T 400 50 T 500 80 T 600 50 T 700 20 T 800 50 T 900 80 T 1000 50",
              "M0 50 Q 50 20, 100 50 T 200 50 T 300 80 T 400 50 T 500 20 T 600 50 T 700 80 T 800 50 T 900 20 T 1000 50",
              "M0 50 Q 50 80, 100 50 T 200 50 T 300 20 T 400 50 T 500 80 T 600 50 T 700 20 T 800 50 T 900 80 T 1000 50"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Moving Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.circle
            key={i}
            r="3"
            fill="#22D3EE"
            initial={{ cx: 0 }}
            animate={{ cx: 1000 }}
            transition={{ duration: 2 + i, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            className="shadow-[0_0_10px_#22D3EE]"
          />
        ))}
      </svg>
      <div className="absolute bottom-4 right-8 text-[10px] font-black text-cyan-400 uppercase tracking-widest">Signal Latency: 0.02ms</div>
    </div>
  );
};

// 3. IDEA DNA CARDS
const IdeaDNACard = ({ idea }) => (
  <Magnetic strength={0.15}>
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative p-8 w-full min-h-[220px] transition-all group"
    >
      {/* Organic Shape Backdrop */}
      <div className="absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-xl group-hover:border-cyan-500/50 transition-colors" 
           style={{ borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10">
            {idea.innovationScore}% Match
          </div>
        </div>
        <h3 className="text-xl font-black text-white mb-4 line-clamp-1">{idea.title}</h3>
        <div className="flex flex-wrap gap-2">
          {idea.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[9px] font-bold text-cyan-400/60 uppercase tracking-tighter">#{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  </Magnetic>
);

// 4. NEURAL TIMELINE
const NeuralTimeline = ({ ideas }) => (
  <div className="relative pl-12 space-y-12">
    <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-white/5 to-transparent" />
    {ideas.slice(0, 5).map((idea, idx) => (
      <motion.div 
        key={idx}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative group"
      >
        <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-[#0B0F19] border border-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:scale-125 transition-transform">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(idea.createdAt).toLocaleDateString()}</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{idea.title}</h4>
        </div>
      </motion.div>
    ))}
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/ideas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full shadow-[0_0_20px_#22D3EE]" />
      </div>
    );
  }

  const avgScore = data.length > 0 ? (data.reduce((acc, c) => acc + c.innovationScore, 0) / data.length).toFixed(0) : 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-24 px-6 pb-20 text-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Stats & Signal */}
        <div className="lg:col-span-8 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">Neural Core.</h1>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Quantum Logic Stream Active</p>
            </div>
            <Magnetic>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Node</span>
              </div>
            </Magnetic>
          </motion.div>

          {/* AI Thinking Core */}
          <section className="relative py-12">
            <AIThinkingCore ideasCount={data.length} score={avgScore} />
          </section>

          {/* Live Signal Stream */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-4 h-4 text-cyan-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Live Signal Flux</h2>
            </div>
            <LiveSignalStream />
          </section>

          {/* Idea DNA Cards */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-sky-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Idea DNA Substrates</h2>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.slice(0, 4).map((idea, idx) => (
                <IdeaDNACard key={idx} idea={idea} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-4 space-y-12 border-l border-white/5 pl-12">
          <div className="flex items-center gap-3 mb-10">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Neural Timeline</h2>
          </div>
          <NeuralTimeline ideas={data} />
          
          {/* Action Card */}
          <div className="mt-20 p-8 rounded-[3rem] bg-gradient-to-br from-cyan-500 to-sky-600 border border-white/10 text-black">
            <h3 className="text-3xl font-black tracking-tight mb-4 leading-none">Expand Neural Network.</h3>
            <p className="text-black/60 font-bold text-sm mb-8">Synthesize more blueprints to increase your feasibility index.</p>
            <Magnetic>
              <button className="w-full py-4 bg-black text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                Initialize Forge
              </button>
            </Magnetic>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
