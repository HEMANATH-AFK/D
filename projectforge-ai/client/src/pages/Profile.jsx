import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Code, Heart, Briefcase, 
  Save, Camera, Plus, X, CheckCircle 
} from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [],
    interests: [],
    domain: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        skills: res.data.skills || [],
        interests: res.data.interests || [],
        domain: res.data.domain || 'General'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addTag = (type) => {
    if (type === 'skill' && newSkill.trim()) {
      if (!formData.skills.includes(newSkill.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      }
      setNewSkill('');
    } else if (type === 'interest' && newInterest.trim()) {
      if (!formData.interests.includes(newInterest.trim())) {
        setFormData({ ...formData, interests: [...formData.interests, newInterest.trim()] });
      }
      setNewInterest('');
    }
  };

  const removeTag = (type, tag) => {
    if (type === 'skill') {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== tag) });
    } else {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== tag) });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-24 px-4 pb-20 text-slate-200 relative overflow-hidden font-sans">
      <div className="mesh-bg" />
      <div className="noise" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          {/* Cover */}
          <div className="h-48 bg-gradient-to-r from-[#0B0F19] to-[#1F2937] relative">
            <div className="absolute -bottom-16 left-10 p-1.5 bg-[#111827] rounded-[2.2rem] border border-white/5 shadow-2xl">
              <div className="w-32 h-32 rounded-[2rem] bg-slate-900 flex items-center justify-center border border-white/5 overflow-hidden relative group">
                <User className="w-16 h-16 text-slate-700" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-24 px-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1.5">{formData.name}</h1>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Master Architect • Identity Protocol</p>
              </div>
              <button 
                onClick={handleUpdate}
                disabled={saving}
                className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl active:scale-95 ${
                  success 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-cyan-500 text-black hover:bg-cyan-400'
                }`}
              >
                {saving ? <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" /> : success ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                <span>{saving ? 'Synchronizing...' : success ? 'Confirmed' : 'Update Profile'}</span>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-10">
                {/* Basic Info */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
                    <User className="w-3.5 h-3.5" /> Identity Metadata
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Display Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700 shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Network Address</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input 
                          type="email" 
                          value={formData.email}
                          disabled
                          className="w-full bg-slate-900/20 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-600 cursor-not-allowed shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Domain */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Briefcase className="w-3.5 h-3.5" /> Specialization
                  </h3>
                  <select 
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
                  >
                    <option value="General">General Architecture</option>
                    <option value="AI/ML">Artificial Intelligence</option>
                    <option value="Full Stack">Full Stack Systems</option>
                    <option value="Web3">Decentralized Web</option>
                  </select>
                </section>
              </div>

              <div className="space-y-10">
                {/* Skills */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Code className="w-3.5 h-3.5" /> Technical Substrate
                  </h3>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-900/30 border border-white/5 rounded-3xl min-h-[70px] shadow-inner">
                    {formData.skills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-bold text-cyan-400 uppercase tracking-tight transition-all hover:bg-cyan-500/20">
                        {skill}
                        <button type="button" onClick={() => removeTag('skill', skill)} className="hover:text-cyan-200 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Inject skill..."
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag('skill'))}
                      className="flex-1 bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
                    />
                    <button 
                      type="button"
                      onClick={() => addTag('skill')}
                      className="p-4 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-2xl transition-all border border-white/5 shadow-lg active:scale-90"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </section>

                {/* Interests */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Heart className="w-3.5 h-3.5" /> System Interests
                  </h3>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-900/30 border border-white/5 rounded-3xl min-h-[70px] shadow-inner">
                    {formData.interests.map(interest => (
                      <span key={interest} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-tight transition-all hover:bg-white/5">
                        {interest}
                        <button type="button" onClick={() => removeTag('interest', interest)} className="hover:text-red-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Inject interest..."
                      value={newInterest}
                      onChange={e => setNewInterest(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag('interest'))}
                      className="flex-1 bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
                    />
                    <button 
                      type="button"
                      onClick={() => addTag('interest')}
                      className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all border border-white/5 shadow-lg active:scale-90"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </section>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
