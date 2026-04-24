import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';

// Smooth Scroll Wrapper
const ScrollProvider = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return children;
};

// Page Transition Wrapper
const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

import ThreeBackground from './components/ThreeBackground';

function App() {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  return (
    <Router>
      <AnimatePresence>
        {loading && <Loader key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <ScrollProvider>
          <div className="min-h-screen selection:bg-cyan-500/30 overflow-x-hidden relative">
            <CustomCursor />
            <ThreeBackground />
            <div className="noise-overlay" />
            
            <Navbar />
            
            <main className="pt-16">
              <PageTransition>
                <Routes>
                  <Route path="/" element={token ? <Navigate to="/home" /> : <Landing />} />
                  <Route path="/auth" element={token ? <Navigate to="/home" /> : <Auth />} />
                  <Route path="/home" element={token ? <Home /> : <Navigate to="/auth" />} />
                  <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/auth" />} />
                  <Route path="/history" element={token ? <HistoryPage /> : <Navigate to="/auth" />} />
                  <Route path="/profile" element={token ? <Profile /> : <Navigate to="/auth" />} />
                  <Route path="/settings" element={token ? <Settings /> : <Navigate to="/auth" />} />
                </Routes>
              </PageTransition>
            </main>
            
            {token && <Chatbot />}
          </div>
        </ScrollProvider>
      )}
    </Router>
  );
}

export default App;
