import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star, Brain, Rocket, Shield, Zap, Globe, Cpu, Database, 
  ArrowRight, Layers, Fingerprint, Activity, Terminal, 
  Compass, Hexagon, Radio, Scan 
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import Magnetic from '../components/Magnetic';
import heroVisual from '../assets/hero-visual.png';

const Landing = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const revealVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 relative">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10"
        >
          {/* Left Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="flex-1 text-left"
          >
            <motion.div
              variants={revealVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8 backdrop-blur-md"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Core Engine Online</span>
            </motion.div>

            <motion.h1 
              variants={revealVariants}
              className="text-7xl md:text-[12rem] font-black tracking-tighter mb-8 text-white leading-[0.7] mix-blend-difference"
            >
              PROJECT<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500">FORGE.</span>
            </motion.h1>

            <motion.p 
              variants={revealVariants}
              className="text-lg md:text-xl text-slate-400 mb-12 max-w-xl leading-relaxed font-medium"
            >
              Architectural-grade synthesis. We don't just build; we forge software replicas with 99.8% semantic integrity using high-fidelity quantum substrates.
            </motion.p>

            <motion.div 
              variants={revealVariants}
              className="flex flex-col sm:flex-row gap-5 items-center"
            >
              <Magnetic strength={0.2}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/auth" 
                    data-cursor="FORGE"
                    className="group px-12 py-6 rounded-full bg-cyan-500 text-black font-black transition-all flex items-center gap-3 text-xl overflow-hidden relative shadow-[0_0_50px_rgba(34,211,238,0.4)]"
                  >
                    <span className="relative z-10">Start Forge</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </Magnetic>
              
              <Magnetic strength={0.1}>
                <motion.button 
                  data-cursor="SPECS"
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all backdrop-blur-md text-xl"
                >
                  System Spec
                </motion.button>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 relative"
          >
            <div className="relative aspect-square w-full max-w-2xl mx-auto group cursor-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-transparent rounded-full blur-[150px] animate-pulse" />
              <img 
                src={heroVisual} 
                alt="AI Synthesis" 
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_100px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE NEVER-SEEN-BEFORE: KINETIC SYNTHESIS MODULES */}
      <section className="py-80 px-6 relative container mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-cyan-500/50 via-white/5 to-transparent z-0" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative z-10"
        >
          <motion.h2 variants={revealVariants} className="text-5xl md:text-[8rem] font-black text-white text-center mb-60 tracking-tighter uppercase italic">
            NEURAL<br /><span className="text-cyan-500 not-italic">INTEGRITY.</span>
          </motion.h2>

          {/* KINETIC MODULES GRID */}
          <div className="space-y-60">
            <KineticModule 
              id="01"
              title="QUANTUM ARCHITECT"
              subtitle="Synthesis: Online"
              desc="Deep-learning blueprint engine capable of multi-dimensional architectural simulation."
              icon={<Scan className="w-12 h-12" />}
              side="left"
              cursor="SCAN"
            />
            <KineticModule 
              id="02"
              title="INTEGRITY CORE"
              subtitle="Validation: Active"
              desc="Real-time feasibility scoring using RAG-enhanced architectural validation nodes."
              icon={<Shield className="w-12 h-12" />}
              side="right"
              cursor="SECURE"
            />
            <KineticModule 
              id="03"
              title="DOMAIN SYNTHESIZER"
              subtitle="Substrate: Primed"
              desc="Optimized tech-stack recommendations across multi-sector software substrates."
              icon={<Hexagon className="w-12 h-12" />}
              side="left"
              cursor="SYNTH"
            />
            <KineticModule 
              id="04"
              title="SYNAPTIC VAULT"
              subtitle="Archive: Encrypted"
              desc="High-fidelity storage of synthesized project blueprints in a secure neural repository."
              icon={<Database className="w-12 h-12" />}
              side="right"
              cursor="VAULT"
            />
          </div>
        </motion.div>
      </section>

      {/* 3. LIVE MARQUEE (ANOTHER DIMENSION) */}
      <div className="w-full py-24 bg-white/5 border-y border-white/5 backdrop-blur-xl overflow-hidden relative rotate-[4deg] scale-125 z-20 shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div className="flex whitespace-nowrap gap-20 animate-marquee">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 text-white font-black text-4xl md:text-6xl uppercase tracking-[0.5em] opacity-20">
              <Radio className="w-10 h-10 text-cyan-400" />
              NODE_SECTOR_{i+1000}_STABLE // QUANTUM_LINK_ESTABLISHED
            </div>
          ))}
        </div>
      </div>

      {/* 4. THE VOID - REVISITED */}
      <section className="py-96 px-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2)_0%,transparent_80%)]" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <h2 className="text-7xl md:text-[12rem] font-black text-white mb-20 tracking-tighter text-center leading-none">THE VOID<br />IS CALLING.</h2>
          <Magnetic strength={0.4}>
             <Link to="/auth" 
               data-cursor="ENTER"
               className="w-80 h-80 rounded-full border-2 border-white/10 flex items-center justify-center group hover:border-cyan-400 transition-all duration-1000 relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-cyan-500 scale-0 group-hover:scale-100 transition-transform duration-1000 origin-center rounded-full z-0" />
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <span className="text-3xl font-black relative z-10 group-hover:text-black transition-colors">INITIALIZE</span>
             </Link>
          </Magnetic>
        </motion.div>
      </section>

      {/* Footer Branding */}
      <footer className="py-32 border-t border-white/5 text-center">
        <div className="flex flex-col items-center gap-8 opacity-40">
          <Star className="w-12 h-12 text-cyan-400" />
          <span className="text-[12px] font-black uppercase tracking-[1.5em] text-slate-500">ProjectForge Architectural System © 2026</span>
        </div>
      </footer>
    </div>
  );
};

const KineticModule = ({ id, title, subtitle, desc, icon, side, cursor }) => {
  const isLeft = side === 'left';
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`flex w-full items-center ${isLeft ? 'justify-start' : 'justify-end'} relative`}
    >
      <div className={`flex flex-col md:flex-row items-center gap-20 max-w-5xl ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        {/* Visual Shard */}
        <Magnetic strength={0.2}>
          <div 
            data-cursor={cursor}
            className="w-80 h-80 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[3rem] flex items-center justify-center relative group overflow-hidden transition-all duration-700 hover:border-cyan-500/50"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="relative z-10 text-cyan-400 group-hover:scale-125 group-hover:text-white transition-all duration-700">
               {icon}
             </div>
             {/* Scanning Line Effect */}
             <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 blur-sm -translate-y-full group-hover:animate-scan" />
             <div className="absolute bottom-10 right-10 text-6xl font-black text-white/5 group-hover:text-white/20 transition-colors uppercase italic">{id}</div>
          </div>
        </Magnetic>

        {/* Content */}
        <div className={`max-w-md ${isLeft ? 'text-left' : 'text-right'}`}>
          <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em] mb-6">{subtitle}</div>
          <h3 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">{title}</h3>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">{desc}</p>
          <div className={`mt-10 flex items-center gap-4 ${isLeft ? 'justify-start' : 'justify-end'}`}>
             <div className={`h-px w-20 bg-white/10 ${isLeft ? '' : 'hidden md:block'}`} />
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Neural Path Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Landing;
