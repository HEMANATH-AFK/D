import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, LogOut, LayoutDashboard, Home, Zap, ArrowLeftRight,
  History, User, Settings, Menu, X, ChevronDown 
} from 'lucide-react';
import { useState } from 'react';

/**
 * Top navigation bar component. Renders logo, responsive nav links, 
 * user profile dropdown, authorization buttons, and responsive hamburger mobile menus.
 */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full border-b border-white/5 bg-[#0B0F19]/70 backdrop-blur-xl z-[60]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to={token ? "/home" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Star className="w-5 h-5 text-[#0B0F19]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight leading-none">ProjectForge</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {token ? (
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/home" icon={<Home className="w-4 h-4" />} label="Home" current={location.pathname} />
            <NavLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Analytics" current={location.pathname} />
            <NavLink to="/generator" icon={<Zap className="w-4 h-4" />} label="Generator" current={location.pathname} />
            <NavLink to="/compare" icon={<ArrowLeftRight className="w-4 h-4" />} label="Compare" current={location.pathname} />
            <NavLink to="/history" icon={<History className="w-4 h-4" />} label="Archive" current={location.pathname} />
            
            <div className="h-6 w-px bg-white/10 mx-3" />
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pl-3 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-all group"
              >
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">Workspace</span>
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-cyan-400 border border-white/10">
                  <User className="w-3.5 h-3.5" />
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-[#111827] border border-white/10 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden backdrop-blur-xl"
                    >
                      <DropdownLink to="/profile" icon={<User className="w-3.5 h-3.5" />} label="Profile" onClick={() => setProfileOpen(false)} />
                      <DropdownLink to="/settings" icon={<Settings className="w-3.5 h-3.5" />} label="Settings" onClick={() => setProfileOpen(false)} />
                      <div className="h-px bg-white/5 my-1.5" />
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/auth" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/auth" className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              Get Started
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0B0F19] border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {token ? (
                <>
                  <MobileNavLink to="/home" label="Home" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/dashboard" label="Analytics" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/generator" label="Generator" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/compare" label="Compare" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/history" label="Archive" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/profile" label="Profile" onClick={() => setIsOpen(false)} />
                  <MobileNavLink to="/settings" label="Settings" onClick={() => setIsOpen(false)} />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-4 text-sm font-bold text-red-400"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center bg-cyan-500 text-black font-bold rounded-xl">
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, icon, label, current }) => {
  const isActive = current === to;
  return (
    <Link 
      to={to} 
      className={`relative flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        {icon} {label}
      </span>
      {isActive && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-white/5 rounded-lg z-0"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </Link>
  );
};

const DropdownLink = ({ to, icon, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
  >
    {icon} {label}
  </Link>
);

const MobileNavLink = ({ to, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="block px-4 py-3 text-sm font-semibold text-slate-300 hover:text-white border-b border-white/5"
  >
    {label}
  </Link>
);

export default Navbar;
