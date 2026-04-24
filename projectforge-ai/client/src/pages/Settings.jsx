import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, Bell, Moon, Sun, 
  Shield, Brain, Trash2, ChevronRight, 
  Globe, Zap, MessageSquare 
} from 'lucide-react';

const Settings = () => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true
  });
  const [aiLevel, setAiLevel] = useState(75);

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-24 px-4 pb-20 text-slate-200 relative overflow-hidden font-sans">
      <div className="mesh-bg" />
      <div className="noise" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-4">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
              <SettingsIcon className="w-6 h-6 text-slate-400" />
            </div>
            Configuration
          </h1>
          <p className="text-sm text-slate-500 font-medium">Manage your workspace parameters and neural preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            <TabItem icon={<Sun className="w-4 h-4" />} label="Interface" active={true} />
            <TabItem icon={<Bell className="w-4 h-4" />} label="Alert Protocols" />
            <TabItem icon={<Brain className="w-4 h-4" />} label="AI Cognition" />
            <TabItem icon={<Shield className="w-4 h-4" />} label="Security" />
            <TabItem icon={<Globe className="w-4 h-4" />} label="Localization" />
            <div className="pt-6 mt-6 border-t border-white/5">
              <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest">
                <Trash2 className="w-4 h-4" /> Purge Account
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Appearance */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-[#111827] border border-white/10 rounded-[2rem] space-y-8 shadow-2xl backdrop-blur-xl"
            >
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Visual Interface</h3>
                <p className="text-xs text-slate-500 font-medium">Customize the structural aesthetic of your dashboard.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${theme === 'light' ? 'bg-white text-black border-white shadow-xl' : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-slate-800'}`}
                >
                  <Sun className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Day Mode</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${theme === 'dark' ? 'bg-slate-800 text-white border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'bg-slate-900/50 border-white/5 text-slate-500 hover:bg-slate-800'}`}
                >
                  <Moon className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Deep Night</span>
                </button>
              </div>
            </motion.section>

            {/* AI Cognition */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-[#111827] border border-white/10 rounded-[2rem] space-y-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Neural Creativity</h3>
                  <p className="text-xs text-slate-500 font-medium">Control the architectural divergence of the AI engine.</p>
                </div>
                <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    <span>Structural</span>
                    <span className="text-cyan-400">Experimental {aiLevel}%</span>
                  </div>
                  <div className="relative h-2 bg-slate-900 rounded-full flex items-center">
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={aiLevel}
                      onChange={(e) => setAiLevel(e.target.value)}
                      className="w-full h-full bg-transparent appearance-none cursor-pointer accent-cyan-500 z-10"
                    />
                    <div className="absolute left-0 h-full bg-cyan-500 rounded-full" style={{ width: `${aiLevel}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                    <span>Linear Blueprints</span>
                    <span>Quantum Divergence</span>
                  </div>
                </div>

                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                  <MessageSquare className="w-4 h-4 text-sky-400 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Higher creativity parameters result in more complex and disruptive project architectures but may require higher resource allocation.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Notifications */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-[#111827] border border-white/10 rounded-[2rem] space-y-8 shadow-2xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold text-white">Alert Protocols</h3>
              
              <div className="space-y-2">
                <ToggleItem label="Network Logs" description="Receive weekly summaries of architectural generations." active={notifications.email} onToggle={() => toggleNotification('email')} />
                <ToggleItem label="Real-time Pings" description="Instant alerts for critical system events." active={notifications.push} onToggle={() => toggleNotification('push')} />
                <ToggleItem label="Neural Insights" description="AI-driven suggestions based on your history." active={notifications.updates} onToggle={() => toggleNotification('updates')} />
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  );
};

const TabItem = ({ icon, label, active }) => (
  <button className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl transition-all ${active ? 'bg-white/5 text-white shadow-xl border border-white/5' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />}
  </button>
);

const ToggleItem = ({ label, description, active, onToggle }) => (
  <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 group">
    <div className="pr-8">
      <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{label}</h4>
      <p className="text-xs text-slate-500 mt-1 font-medium">{description}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${active ? 'bg-cyan-500' : 'bg-slate-800'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all shadow-md ${active ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);

export default Settings;
