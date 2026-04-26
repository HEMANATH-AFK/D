import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Layout, Server, Database, Layers, 
  Star, ShieldCheck, Activity, Cpu, Rocket,
  BrainCircuit, Download, Share2, RefreshCcw, TrendingUp,
  ExternalLink, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import Magnetic from '../components/Magnetic';
import { parseArchitecture, parseImprovements, parseIdea, parseValidation } from '../utils/parser';

const IdeaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('architecture');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const fetchIdea = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/ideas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIdea(res.data);
      
      // Fetch architecture and improvements if missing
      if (!res.data.architecture || Object.keys(res.data.architecture).length === 0) {
        fetchArchitecture();
      }
      if (!res.data.improvements || Object.keys(res.data.improvements).length === 0) {
        fetchImprovements();
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchArchitecture = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/ideas/architecture/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("🚀 ARCH DATA:", res.data);
      setIdea(prev => ({ ...prev, architecture: res.data }));
    } catch (err) { 
      console.error("❌ ARCH FETCH ERROR:", err);
      alert("Neural Link Failure: Could not establish architectural synchronization. Please ensure you are logged in.");
    }
  };

  const fetchImprovements = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/ideas/improve/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIdea(prev => ({ ...prev, improvements: res.data }));
    } catch (err) { console.error(err); }
  };

  const handleExport = () => {
    if (!idea) return;

    // 🛡️ Data Normalization for Report
    const normalizedIdea = parseIdea(idea);
    const arch = parseArchitecture(idea.architecture, normalizedIdea.tech_stack);
    const improvements = parseImprovements(idea.improvements);
    const validation = parseValidation(idea.similarityResults);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const margin = 25;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - (margin * 2);
    let y = 30;

    // Helper: Add Page Header/Footer
    const addTemplate = () => {
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.setFont("helvetica", "italic");
      doc.text("ProjectForge AI - Neural Blueprint Report", margin, 15);
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin - 10, 15);
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.2);
      doc.line(margin, 18, pageWidth - margin, 18);
    };

    // Helper: Page Break Check
    const checkPageBreak = (neededHeight) => {
      if (y + neededHeight > pageHeight - 30) {
        doc.addPage();
        addTemplate();
        y = 35; // Standard start for new pages
        return true;
      }
      return false;
    };

    // 1. COVER PAGE
    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECTFORGE AI", pageWidth / 2, 25, { align: "center" });
    
    doc.setTextColor(0);
    y = 80;
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("AI Project Blueprint Report", pageWidth / 2, y, { align: "center" });
    
    y += 20;
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(normalizedIdea.title.toUpperCase(), contentWidth);
    doc.text(titleLines, pageWidth / 2, y, { align: "center" });
    
    y += (titleLines.length * 12) + 30;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    
    y += 15;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: "center" });
    doc.text(`Neural ID: #${normalizedIdea._id.slice(-8).toUpperCase()}`, pageWidth / 2, y + 8, { align: "center" });
    
    y = pageHeight - 40;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 211, 238);
    doc.text("CONFIDENTIAL TECHNICAL DOCUMENTATION", pageWidth / 2, y, { align: "center" });

    // 2. TABLE OF CONTENTS
    doc.addPage();
    addTemplate();
    y = 40;
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("TABLE OF CONTENTS", margin, y);
    y += 20;
    
    const toc = [
      "1. Project Overview", "2. Problem Statement", "3. Proposed Solution", 
      "4. Tech Stack Specification", "5. System Architecture", "6. Evaluation Metrics", 
      "7. Validation & Market Analysis", "8. Innovation & Uniqueness", "9. Improvement Roadmap",
      "10. Deployment Strategy", "11. Conclusion"
    ];
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    toc.forEach((item) => {
      doc.text(item, margin + 5, y);
      doc.text(".............................................................................................", margin + 70, y);
      y += 12;
    });

    // 3. SECTIONS
    const addSection = (title, content, isList = false) => {
      checkPageBreak(30);
      y += 10;
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text(title, margin, y);
      y += 10;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60);
      
      if (isList && Array.isArray(content)) {
        content.forEach(item => {
          checkPageBreak(10);
          doc.text(`• ${item}`, margin + 5, y);
          y += 8;
        });
      } else {
        const lines = doc.splitTextToSize(content || "Information pending neural synthesis.", contentWidth);
        checkPageBreak(lines.length * 7);
        doc.text(lines, margin, y);
        y += (lines.length * 6) + 5;
      }
    };

    doc.addPage();
    addTemplate();
    y = 35;

    addSection("1. PROJECT OVERVIEW", normalizedIdea.description);
    addSection("2. PROBLEM STATEMENT", normalizedIdea.problem_statement);
    addSection("3. PROPOSED SOLUTION", normalizedIdea.solution);

    // 4. TECH STACK (Custom formatting)
    checkPageBreak(60);
    y += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("4. TECH STACK SPECIFICATION", margin, y);
    y += 12;
    doc.setFontSize(11);
    const stacks = [
      ["Frontend Framework", arch.frontend.framework],
      ["Backend Engine", arch.backend.framework],
      ["Data Repository", arch.database.type],
      ["Core Language", normalizedIdea.tech_stack[0] || "Custom"]
    ];
    stacks.forEach(s => {
      doc.setFont("helvetica", "bold");
      doc.text(`${s[0]}:`, margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(s[1], margin + 55, y);
      y += 10;
    });

    // 5. ARCHITECTURE
    addSection("5. SYSTEM ARCHITECTURE", "");
    y -= 5;
    const archDetails = [
      `Frontend Components: ${arch.frontend.components.join(", ")}`,
      `Backend Modules: ${arch.backend.components.join(", ")}`,
      `Data Collections: ${arch.database.collections.join(", ")}`
    ];
    archDetails.forEach(detail => {
      const lines = doc.splitTextToSize(detail, contentWidth - 10);
      checkPageBreak(lines.length * 7);
      doc.text(lines, margin + 5, y);
      y += (lines.length * 6) + 4;
    });

    // 6. METRICS
    checkPageBreak(70);
    y += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("6. EVALUATION METRICS", margin, y);
    y += 12;
    const evalData = idea.evaluations?.[0] || { innovationScore: 8, feasibilityScore: 7, complexityScore: 7, marketRelevanceScore: 8 };
    const metrics = [
      ["Metric Name", "Neural Score", "Designation"],
      ["Innovation Index", `${evalData.innovationScore}/10`, "High-Tier"],
      ["Technical Feasibility", `${evalData.feasibilityScore}/10`, "Production Ready"],
      ["Architectural Complexity", `${evalData.complexityScore}/10`, "Enterprise"],
      ["Market Potential", `${evalData.marketRelevanceScore}/10`, "Growth Factor"]
    ];
    metrics.forEach((row, i) => {
      doc.setFont("helvetica", i === 0 ? "bold" : "normal");
      doc.text(row[0], margin + 5, y);
      doc.text(row[1], margin + 65, y);
      doc.text(row[2], margin + 105, y);
      y += 10;
    });

    // 7-11 SECTIONS
    addSection("7. VALIDATION & MARKET ANALYSIS", validation.marketAnalysis);
    addSection("8. INNOVATION & UNIQUENESS", normalizedIdea.uniqueness_factor);
    
    checkPageBreak(80);
    y += 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("9. IMPROVEMENT ROADMAP", margin, y);
    y += 12;
    improvements.suggestions.forEach((s, i) => {
      const sLines = doc.splitTextToSize(`${s.title}: ${s.description}`, contentWidth - 15);
      checkPageBreak((sLines.length * 7) + 5);
      doc.setFont("helvetica", "bold");
      doc.text(`${i+1}.`, margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(sLines, margin + 12, y);
      y += (sLines.length * 6) + 6;
    });

    addSection("10. DEPLOYMENT STRATEGY", [
      `Frontend Endpoint: ${arch.deployment.frontend}`,
      `Backend Cluster: ${arch.deployment.backend}`,
      `Data Cloud: ${arch.deployment.database}`
    ], true);

    addSection("11. CONCLUSION", "This project blueprint identifies a high-potential technical implementation that balances innovation with feasibility. The proposed architecture follows enterprise best practices, ensuring a scalable and maintainable foundation for development.");

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(180);
    doc.text("Generated by ProjectForge AI - Technical Documentation", pageWidth / 2, pageHeight - 15, { align: "center" });

    doc.save(`ProjectForge_Report_${normalizedIdea.title.replace(/\s+/g, '_')}.pdf`);
  };

  const handleShare = async () => {
    const shareData = {
      title: idea.title,
      text: idea.description,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSharing(true);
        setTimeout(() => setSharing(false), 2000);
      }
    } catch (err) { console.error(err); }
  };

  const handleReSynthesize = () => {
    navigate('/generator');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-20 h-20 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
    </div>
  );

  if (!idea) return <div className="min-h-screen flex items-center justify-center text-white">Idea not found</div>;

  // 🛡️ UNIVERSAL DATA NORMALIZATION LAYER
  const normalizedIdea = parseIdea(idea);
  const arch = parseArchitecture(idea.architecture, normalizedIdea.tech_stack);
  const improvements = parseImprovements(idea.improvements);
  const validation = parseValidation(idea.similarityResults);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 text-slate-200 bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <section className="relative">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest mb-12"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Shard #{normalizedIdea._id.slice(-4)}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">{normalizedIdea.title}</h1>
              <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-4xl">{normalizedIdea.description}</p>
              
              <div className="flex flex-wrap gap-4">
                {normalizedIdea.tech_stack.map((tech, i) => (
                  <span key={i} className="px-6 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-black text-cyan-400 uppercase tracking-widest">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-96 p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl space-y-8">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Evaluation</h3>
              <div className="space-y-6">
                 {idea.evaluations?.[idea.evaluations.length - 1] && (
                   <>
                    <ScoreBar label="Innovation" score={idea.evaluations[idea.evaluations.length - 1].innovationScore} />
                    <ScoreBar label="Feasibility" score={idea.evaluations[idea.evaluations.length - 1].feasibilityScore} />
                    <ScoreBar label="Market Relevance" score={idea.evaluations[idea.evaluations.length - 1].marketRelevanceScore} />
                   </>
                 )}
              </div>
            </div>
          </div>
        </section>

        {/* Tab System */}
        <section className="space-y-10">
          <div className="flex gap-4 p-2 rounded-3xl bg-white/5 border border-white/10 w-fit">
            <TabButton active={activeTab === 'architecture'} onClick={() => setActiveTab('architecture')} icon={<Layers className="w-4 h-4" />} label="Architecture" />
            <TabButton active={activeTab === 'improvements'} onClick={() => setActiveTab('improvements')} icon={<Star className="w-4 h-4" />} label="Improvements" />
            <TabButton active={activeTab === 'validation'} onClick={() => setActiveTab('validation')} icon={<ShieldCheck className="w-4 h-4" />} label="Validation" />
          </div>

          <div className="min-h-[600px] p-12 md:p-20 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px]" />
            
            <AnimatePresence mode="wait">
              {activeTab === 'architecture' && (
                <motion.div 
                  key="arch"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <ArchCard 
                      icon={<Layout className="w-6 h-6" />} 
                      title="Frontend" 
                      framework={arch.frontend.framework} 
                      components={arch.frontend.components} 
                    />
                    <ArchCard 
                      icon={<Server className="w-6 h-6" />} 
                      title="Backend" 
                      framework={arch.backend.framework} 
                      components={arch.backend.components} 
                    />
                    <ArchCard 
                      icon={<Database className="w-6 h-6" />} 
                      title="Database" 
                      framework={arch.database.type} 
                      components={arch.database.collections} 
                      isDB
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 space-y-6">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-cyan-400" /> Integrated Services
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {arch.services.map((s, i) => (
                          <span key={i} className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                            {s}
                          </span>
                        ))}
                        {arch.services.length === 0 && <p className="text-xs text-slate-500">Mapping services...</p>}
                      </div>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 space-y-6">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Rocket className="w-5 h-5 text-indigo-400" /> Deployment Strategy
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <DeploymentSlot label="Frontend" value={arch.deployment.frontend} />
                        <DeploymentSlot label="Backend" value={arch.deployment.backend} />
                        <DeploymentSlot label="Database" value={arch.deployment.database} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'improvements' && (
                <motion.div 
                  key="imp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-10"
                >
                  <div className="space-y-8">
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Synthesis Upgrades</h3>
                    <div className="space-y-6">
                      {improvements.suggestions.map((s, i) => (
                        <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4 hover:bg-white/10 transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{s.category}</span>
                            <Star className="w-4 h-4 text-cyan-400" />
                          </div>
                          <h4 className="text-xl font-bold text-white">{s.title}</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-10 rounded-[3rem] bg-indigo-500/5 border border-indigo-500/20 space-y-8 h-fit">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Next Evolution Steps</h4>
                    <div className="space-y-4">
                      {improvements.nextSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-4 text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">{i+1}</div>
                          <p className="text-sm font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'validation' && (
                <motion.div 
                  key="val"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-3xl space-y-12"
                >
                  <div className="flex items-center gap-10">
                     <div className="w-32 h-32 rounded-full border-4 border-cyan-500/20 flex items-center justify-center relative">
                        <div className="text-4xl font-black text-white">{validation.uniquenessScore}%</div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 rounded-full text-[8px] font-black text-black">UNIQUE</div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Market Position</h3>
                        <p className="text-slate-400 font-medium leading-relaxed italic">"{validation.marketAnalysis}"</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Similar Entities Identified</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {validation.similarIdeas.map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 text-sm text-slate-300 font-medium">
                          {item}
                        </div>
                      ))}
                      {validation.similarIdeas.length === 0 && <p className="text-xs text-slate-500 italic px-2">No direct matches identified in the neural network.</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Footer Actions */}
        <section className="flex flex-wrap gap-6 justify-center">
           <Magnetic>
             <ActionButton 
               onClick={handleExport}
               icon={<Download className="w-4 h-4" />} 
               label="EXPORT BLUEPRINT" 
             />
           </Magnetic>
           <Magnetic>
             <ActionButton 
               onClick={handleShare}
               icon={sharing ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />} 
               label={sharing ? "LINK COPIED" : "SHARE SYNERGY"} 
             />
           </Magnetic>
           <Magnetic>
             <ActionButton 
               onClick={handleReSynthesize}
               icon={<RefreshCcw className="w-4 h-4" />} 
               label="RE-SYNTHESIZE" 
             />
           </Magnetic>
        </section>

      </div>
    </div>
  );
};

const ScoreBar = ({ label, score }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
      <span className="text-slate-500">{label}</span>
      <span className="text-white">{score}/10</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: `${(score/10) * 100}%` }}
         className="h-full bg-cyan-500 shadow-[0_0_10px_#22D3EE]"
       />
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'text-slate-500 hover:text-white'
    }`}
  >
    {icon} {label}
  </button>
);

const ArchCard = ({ icon, title, framework, components, isDB }) => (
  <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 space-y-8">
    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
      {icon}
    </div>
    <h4 className="text-xs font-black text-white uppercase tracking-widest">{title}</h4>
    <div className="space-y-6">
      <div className="space-y-1">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{isDB ? 'Database Type' : 'Framework / Runtime'}</span>
        <p className="text-sm text-slate-200 font-bold">{framework || 'N/A'}</p>
      </div>
      <div className="space-y-3">
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{isDB ? 'Key Collections' : 'Core Components'}</span>
        <div className="flex flex-wrap gap-2">
          {components?.map((item, i) => (
            <span key={i} className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-bold text-slate-400 border border-white/5">
              {item}
            </span>
          ))}
          {(!components || components.length === 0) && <span className="text-[9px] text-slate-600 italic">Mapping nodes...</span>}
        </div>
      </div>
    </div>
  </div>
);

const DeploymentSlot = ({ label, value }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">{label}</span>
    <span className="text-xs font-bold text-slate-200">{value || '--'}</span>
  </div>
);

const ActionButton = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95"
  >
    {icon} {label}
  </button>
);

export default IdeaDetails;
