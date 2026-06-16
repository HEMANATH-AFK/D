import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * A luxury animated preloader screen displaying particle tunnel effects
 * and a stylized entrance animation before entering the application.
 * 
 * @param {Object} props - Component props.
 * @param {Function} props.onComplete - Callback executed when the load phase finishes.
 */
const Loader = ({ onComplete }) => {
  const [phase, setPhase] = useState('start'); // start -> zoom -> complete

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('zoom'), 500);
    const timer2 = setTimeout(() => setPhase('complete'), 3500);
    const timer3 = setTimeout(onComplete, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.1,
        filter: "blur(40px)",
        transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } 
      }}
      className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* THE VOID PARTICLES (Tunnel Effect) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: "50%", 
              y: "50%", 
              scale: 0, 
              opacity: 0 
            }}
            animate={{ 
              x: `${Math.random() * 200 - 50}%`, 
              y: `${Math.random() * 200 - 50}%`, 
              scale: Math.random() * 2 + 1,
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity, 
              ease: "easeOut",
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ 
              boxShadow: "0 0 10px white"
            }}
          />
        ))}
      </div>

      {/* THE LUXURY TEXT "AFK" */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 10, opacity: 0, filter: "blur(50px)" }}
          animate={phase === 'zoom' ? { 
            scale: 1, 
            opacity: 1, 
            filter: "blur(0px)" 
          } : phase === 'complete' ? {
            scale: 0.8,
            opacity: 0,
            filter: "blur(20px)"
          } : {}}
          transition={{ 
            duration: 3, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="flex flex-col items-center"
        >
          <h1 className="text-white text-[15vw] font-black tracking-[-0.05em] leading-none select-none">
            AFK
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-4 shadow-[0_0_20px_#22D3EE]"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-white/40 text-[10px] font-black uppercase tracking-[1em] mt-8"
          >
            Entering Neural Void
          </motion.p>
        </motion.div>
      </div>

      {/* AMBIENT FLARE */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)] pointer-events-none"
      />
    </motion.div>
  );
};

export default Loader;
