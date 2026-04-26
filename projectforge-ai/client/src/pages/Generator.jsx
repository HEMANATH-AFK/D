import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Loader2, Zap, BrainCircuit, Activity, 
  ChevronRight, ChevronLeft, Check, Layers, Cpu,
  Database, Layout, Server, Rocket, ShieldCheck, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Magnetic from '../components/Magnetic';

const Generator = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skills: '',
    interests: '',
    domain: 'AI & Machine Learning',
    difficulty: 'Intermediate'
  });
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [finalIdea, setFinalIdea] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startGeneration = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Neural Link Severed: Please sign in again.");
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      // Update user profile first
      const skillsArray = (formData.skills || "").split(',').map(s => s.trim()).filter(s => s);
      const interestsArray = (formData.interests || "").split(',').map(s => s.trim()).filter(s => s);

      await axios.put('http://localhost:5000/api/auth/profile', {
        skills: skillsArray,
        interests: interestsArray,
        domain: formData.domain
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const res = await axios.post('http://localhost:5000/api/ideas/generate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data?.success) {
        setGeneratedIdeas(res.data.data);
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert("Session Expired: Please re-authenticate.");
        navigate('/auth');
      } else {
        alert(`Synthesis Error: ${error.response?.data?.details || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSelectedIdea = async (idea) => {
    setLoading(true);
    setSelectedIdea(idea);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/ideas/save', { ideaData: idea }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data?.success) {
        setFinalIdea(res.data.data);
        setStep(3);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Input Parameters' },
    { id: 2, title: 'Synthesis Selection' },
    { id: 3, title: 'Neural Analysis' }
  ];

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-slate-200 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        
        {/* Progress Stepper */}
        <div className="flex justify-between mb-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10" />
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                step >= s.id ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'bg-slate-900 border-white/10 text-slate-500'
              }`}>
                {step > s.id ? <Check className="w-5 h-5" /> : <span>{s.id}</span>}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: FORM */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">Define Parameters</h2>
                <p className="text-slate-400 font-medium">Calibrate the neural engine with your specific metadata.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Neural Domain</label>
                    <select 
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none transition-all appearance-none"
                    >
                      <option>AI & Machine Learning</option>
                      <option>Full-Stack Web</option>
                      <option>Blockchain & Web3</option>
                      <option>Cybersecurity</option>
                      <option>Embedded Systems</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Cognitive Skills (comma separated)</label>
                    <input 
                      type="text"
                      name="skills"
                      placeholder="React, Node.js, Python, AWS..."
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                   <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Core Interests</label>
                    <input 
                      type="text"
                      name="interests"
                      placeholder="Sustainability, Fintech, HealthTech..."
                      value={formData.interests}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500/50 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Synthesis Complexity</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setFormData({ ...formData, difficulty: lvl })}
                          className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            formData.difficulty === lvl ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-10">
                <Magnetic>
                  <button 
                    onClick={startGeneration}
                    disabled={loading}
                    className="px-12 py-5 bg-white text-black font-black rounded-full flex items-center gap-3 text-sm tracking-widest hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    INITIATE SYNTHESIS
                  </button>
                </Magnetic>
              </div>
            </motion.div>
          )}

          {/* STEP 2: IDEA SELECTION */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">Select Substrate</h2>
                <p className="text-slate-400 font-medium">Choose the most viable neural path for deep analysis.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {generatedIdeas.map((idea, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -10 }}
                    onClick={() => saveSelectedIdea(idea)}
                    className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group flex flex-col justify-between min-h-[400px]"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Shard 0{idx + 1}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{idea.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 font-medium">{idea.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {idea.tech_stack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white/5 rounded-lg text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Select Shard</div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest mx-auto"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Parameters
              </button>
            </motion.div>
          )}

          {/* STEP 3: FINAL RESULTS & ANALYSIS */}
          {step === 3 && finalIdea && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              <div className="p-12 md:p-20 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] z-0" />
                
                <div className="relative z-10 space-y-12">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
                        <Star className="w-3 h-3" /> Synthesis Complete
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">{finalIdea.title}</h2>
                      <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-3xl">{finalIdea.description}</p>
                    </div>

                    <div className="w-full md:w-80 space-y-6">
                      <ScoreMetric label="Innovation" score={finalIdea.evaluations[0]?.innovationScore} />
                      <ScoreMetric label="Feasibility" score={finalIdea.evaluations[0]?.feasibilityScore} />
                      <ScoreMetric label="Complexity" score={finalIdea.evaluations[0]?.complexityScore} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                    <div className="space-y-6">
                       <h4 className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-[0.3em]">
                        <ShieldCheck className="w-5 h-5 text-green-500" /> Validation Report
                      </h4>
                      <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uniqueness Index</span>
                          <span className="text-xl font-black text-green-400">{finalIdea.similarityResults?.uniquenessScore}%</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed italic">"{finalIdea.similarityResults?.marketAnalysis}"</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                       <h4 className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-[0.3em]">
                        <AlertCircle className="w-5 h-5 text-cyan-400" /> Strategic Feedback
                      </h4>
                      <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5">
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">{finalIdea.evaluations[0]?.feedback}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 pt-10">
                    <Magnetic>
                      <button 
                        onClick={() => navigate(`/idea/${finalIdea._id}`)}
                        className="flex-1 px-10 py-5 bg-white text-black font-black rounded-full flex items-center justify-center gap-3 text-xs tracking-widest hover:scale-105 transition-all"
                      >
                        VIEW DEEP ARCHITECTURE <ChevronRight className="w-4 h-4" />
                      </button>
                    </Magnetic>
                    <Magnetic>
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-full text-xs tracking-widest hover:bg-white/10 transition-all"
                      >
                        GOTO DASHBOARD
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && step !== 3 && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
              <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-white tracking-[0.2em] uppercase italic">Synchronizing Neural Paths</h3>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em]">Allocating compute resources...</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const ScoreMetric = ({ label, score }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
      <span className="text-slate-500">{label}</span>
      <span className="text-white">{score}/10</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(score / 10) * 100}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
      />
    </div>
  </div>
);

export default Generator;
