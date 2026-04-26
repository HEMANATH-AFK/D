import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Star, Trash2, Maximize2 } from 'lucide-react';
import axios from 'axios';

const StreamingText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayedText}</span>;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Protocol initiated. I am your ProjectForge AI architect. How shall we structure your vision today?", type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('toggle-chatbot', handleOpen);
    return () => window.removeEventListener('toggle-chatbot', handleOpen);
  }, []);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/chat', 
        { messages: [...messages, userMessage] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const replyText = res.data?.success && res.data?.data?.message 
        ? res.data.data.message 
        : "Critical error in response synthesis.";
        
      setMessages(prev => [...prev, { role: 'assistant', content: replyText, type: 'stream' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Neural link disrupted. Check system status.", type: 'text' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B0F19]/40 backdrop-blur-md z-[80]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-10 w-18 h-18 bg-cyan-500 text-black rounded-[1.8rem] flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.4)] z-[100]"
      >
        {isOpen ? <X className="w-9 h-9" /> : <MessageSquare className="w-9 h-9" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-32 right-10 w-[460px] h-[650px] bg-[#111827]/80 border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden z-[90] backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="bg-slate-900/50 px-10 py-8 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-sky-500" />
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center relative">
                  <Star className="w-6 h-6 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-50" />
                </div>
                <div>
                  <h3 className="font-black text-white tracking-widest uppercase text-xs">Forge Architect</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-white"><Maximize2 className="w-4 h-4" /></button>
                <button onClick={() => setMessages([{ role: 'assistant', content: "Vault cleared. Ready for new input.", type: 'text' }])} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide" data-lenis-prevent>
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-5`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-7 h-7 text-cyan-400" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-[1.8rem] px-6 py-4 text-sm leading-relaxed shadow-xl ${
                    msg.role === 'user' 
                      ? 'bg-cyan-500 text-black font-black rounded-tr-none' 
                      : 'bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.type === 'stream' ? (
                      <StreamingText text={msg.content} />
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-7 h-7 text-cyan-400" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex justify-start gap-5">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="bg-slate-900 border border-white/5 rounded-[1.8rem] rounded-tl-none px-7 py-5 flex items-center gap-2">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input */}
            <div className="p-10 bg-slate-900/50 border-t border-white/5">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Architect a message..."
                  className="w-full bg-slate-900 border border-white/10 rounded-[1.8rem] pl-8 pr-16 py-5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 font-black"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-3 p-4 bg-cyan-500 text-black rounded-2xl hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-lg active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
