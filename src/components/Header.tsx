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

  return (
    <header
      className={`sticky top-0 z-50 print:hidden transition-all duration-300 ${
        scrolled
          ? 'navbar-floating navbar-scrolled'
          : 'bg-white/80 backdrop-blur-md border-b border-[#E7EDF5]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-6">

          {/* ── Logo ── */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left cursor-pointer shrink-0 focus-visible:outline-none group"
            aria-label="DermaDetect AI — Home"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-[#2458F5]/10 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <img
                src={BRAND_LOGO_URL}
                alt="DermaDetect AI Logo"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-contain border border-[#E7EDF5] shadow-sm shrink-0 bg-white relative z-10 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[1.05rem] font-extrabold tracking-tight text-[#10264D] font-display">
                DermaDetect AI
              </span>
              <span className="text-[11px] font-medium text-[#2458F5]">
                AI Health Platform
              </span>
            </div>
          </button>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    relative flex items-center gap-1.5 px-4 py-2 rounded-xl
                    text-sm font-semibold transition-all duration-200 cursor-pointer
                    focus-visible:outline-2 focus-visible:outline-[#2458F5] focus-visible:outline-offset-2
                    ${isActive
                      ? 'text-[#2458F5] bg-[#EAF2FF]'
                      : 'text-[#64748B] hover:text-[#10264D] hover:bg-[#F7FAFF]'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#2458F5] rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Desktop Right ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('results')}
              className="text-sm font-medium text-[#64748B] hover:text-[#10264D] transition-colors px-3 py-2 rounded-lg hover:bg-[#F7FAFF]"
            >
              My Results
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('symptoms')}
              className="btn btn-primary btn-sm flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Start Assessment
            </button>
          </div>

          {/* ── Mobile / Tablet CTA + Hamburger ── */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('symptoms')}
              className="btn btn-primary btn-sm hidden sm:flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Free</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#10264D] hover:bg-[#F7FAFF] rounded-xl transition-colors cursor-pointer border border-[#E7EDF5]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{ rotate: 90,   opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90,   opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{ rotate: -90,  opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-white border-t border-[#E7EDF5] shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

              {/* Primary nav */}
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full min-h-[48px] text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 cursor-pointer ${
                    currentTab === item.id
                      ? 'bg-[#EAF2FF] text-[#2458F5]'
                      : 'text-[#17253B] hover:bg-[#F7FAFF] hover:text-[#10264D]'
                  }`}
                >
                  <span className={currentTab === item.id ? 'text-[#2458F5]' : 'text-[#64748B]'}>
                    {item.icon}
                  </span>
                  {item.label}
                </motion.button>
              ))}

              {/* Separator */}
              <div className="pt-2 border-t border-[#E7EDF5] space-y-1">
                {mobileSecondaryItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + i) * 0.05, duration: 0.25 }}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full min-h-[40px] text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      currentTab === item.id
                        ? 'bg-[#EAF2FF] text-[#2458F5]'
                        : 'text-[#64748B] hover:bg-[#F7FAFF] hover:text-[#10264D]'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="pt-3 sm:hidden">
                <button
                  type="button"
                  onClick={() => handleNavClick('symptoms')}
                  className="btn btn-primary w-full justify-center"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Free Assessment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
