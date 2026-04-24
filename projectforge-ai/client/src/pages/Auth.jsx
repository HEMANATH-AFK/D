import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Sparkles, ArrowRight, Code, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('token', res.data.token);
      navigate('/home');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen text-slate-200 flex items-center justify-center relative px-6 py-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
          >
            <Sparkles className="w-10 h-10 text-black" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-3">
            {isLogin ? 'Access Node' : 'Establish Identity'}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">
            Neural Protocol v3.1
          </p>
        </div>

        <motion.div 
          className="bg-[#111827]/80 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Identity Label</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="text" 
                      required
                      placeholder="Enter designation"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus-glow transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Network Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="Enter coordinates"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus-glow transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Security Token</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="Enter sequence"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus-glow transition-all"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-cyan-500 text-black font-black rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 text-sm uppercase tracking-widest"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isLogin ? 'Initiate Link' : 'Establish Node'} 
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-8">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">External Sync</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="w-full py-4 bg-white/5 border border-white/5 text-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
            >
              <Code className="w-4 h-4" /> OAuth Node
            </motion.button>

            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black text-slate-600 hover:text-cyan-400 transition-colors uppercase tracking-[0.3em]"
            >
              {isLogin ? 'Establish new identity?' : 'Access existing node?'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
