import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Activity, Scan, Stethoscope, Home, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BRAND_LOGO_URL = '/assets/aistudio/logore_aadb4948.png';

export type PageRoute = string;

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

const navItems = [
  { id: 'home',     label: 'Home',            icon: <Home className="w-4 h-4" /> },
  { id: 'symptoms', label: 'Symptom Checker',  icon: <Activity className="w-4 h-4" /> },
  { id: 'skin',     label: 'Skin Analysis',    icon: <Scan className="w-4 h-4" /> },
  { id: 'doctor',   label: 'Dr. Fizza',        icon: <Stethoscope className="w-4 h-4" /> },
  { id: 'about',    label: 'About',            icon: <Info className="w-4 h-4" /> },
];

const mobileSecondaryItems = [
  { id: 'results', label: 'Analysis Results' },
  { id: 'demo',    label: 'Sample Cases' },
  { id: 'safety',  label: 'Health & Safety' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'contact', label: 'Contact' },
];

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const isHeroMode = currentTab === 'home' && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 print:hidden transition-all duration-300 pt-3 px-3 sm:px-6 ${
        scrolled ? 'backdrop-blur-sm' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`flex items-center justify-between h-[58px] px-4 sm:px-6 rounded-full transition-all duration-300 ${
            isHeroMode
              ? 'pill-nav-glass text-white shadow-2xl border border-white/30'
              : 'pill-nav-light text-slate-800 shadow-lg border border-slate-200/80'
          }`}
        >
          {/* ── Logo ── */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer shrink-0 focus-visible:outline-none group"
            aria-label="DermaDetect AI — Home"
          >
            <div className="relative">
              <img
                src={BRAND_LOGO_URL}
                alt="DermaDetect AI Logo"
                referrerPolicy="no-referrer"
                className={`w-9 h-9 rounded-full object-contain p-0.5 shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  isHeroMode
                    ? 'bg-white/20 border border-white/40 shadow-sm'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`text-[1.05rem] font-extrabold tracking-tight font-display transition-colors ${
                  isHeroMode ? 'text-white' : 'text-[#10264D]'
                }`}
              >
                DermaDetect
              </span>
            </div>
          </button>

          {/* ── Desktop Nav Links ── */}
          <nav
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                    text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer
                    focus-visible:outline-2 focus-visible:outline-offset-2
                    ${
                      isHeroMode
                        ? isActive
                          ? 'bg-white text-[#d81e5b] shadow-md'
                          : 'text-white/85 hover:text-white hover:bg-white/15'
                        : isActive
                          ? 'bg-rose-50 text-[#d81e5b] font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* ── Desktop Right CTAs ── */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('results')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                isHeroMode
                  ? 'text-white/85 hover:text-white hover:bg-white/15'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              My Results
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('symptoms')}
              className={`btn-pill text-xs px-5 py-2 font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${
                isHeroMode
                  ? 'btn-pill-white text-[#d81e5b]'
                  : 'btn-pill-coral text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Free</span>
            </button>
          </div>

          {/* ── Mobile / Tablet CTA + Hamburger ── */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('symptoms')}
              className={`btn-pill text-xs px-3.5 py-1.5 font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1 ${
                isHeroMode
                  ? 'btn-pill-white text-[#d81e5b]'
                  : 'btn-pill-coral text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer border ${
                isHeroMode
                  ? 'text-white border-white/30 bg-white/15 hover:bg-white/25'
                  : 'text-slate-800 border-slate-200 bg-white hover:bg-slate-100'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 overflow-hidden bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl p-4 space-y-1"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    currentTab === item.id
                      ? 'bg-rose-50 text-[#d81e5b]'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={currentTab === item.id ? 'text-[#d81e5b]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}

              <div className="pt-2 border-t border-slate-100 space-y-1">
                {mobileSecondaryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      currentTab === item.id
                        ? 'bg-rose-50 text-[#d81e5b]'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('symptoms')}
                  className="btn-pill btn-pill-coral w-full py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Free Assessment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
