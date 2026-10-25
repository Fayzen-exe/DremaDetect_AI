import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Code2,
  Heart,
  Mail,
  ExternalLink,
  ArrowUp,
  Sparkles,
  Activity,
  PhoneCall,
  Lock,
} from 'lucide-react';
import { BRAND_LOGO_URL } from './Header';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

const NavLink: React.FC<{
  onClick: () => void;
  badge?: string;
  children: React.ReactNode;
}> = ({ onClick, badge, children }) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className="text-white/85 hover:text-white transition-all duration-200 cursor-pointer text-left flex items-center justify-between group w-full py-1 text-sm font-medium"
    >
      <span className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-200" />
        <span className="group-hover:translate-x-1 transition-transform duration-200">
          {children}
        </span>
      </span>
      {badge && (
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 group-hover:bg-white group-hover:text-[#D81E5B] transition-colors">
          {badge}
        </span>
      )}
    </button>
  </li>
);

export const MedicalDisclaimerFooter: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative sunset-hero-bg text-white mt-20 no-print print:hidden overflow-hidden shadow-2xl">
      {/* ── Micro-dot Grid Texture Overlay ── */}
      <div className="absolute inset-0 bg-dot-grid-white opacity-25 pointer-events-none" />

      {/* ── Ambient Radial Glow Overlays ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="footer-glow-orb-1 -top-32 -left-32 opacity-40" />
        <div className="footer-glow-orb-2 -bottom-32 -right-32 opacity-30" />
      </div>

      <div className="relative z-10">
        {/* ── Elevated Clinical Alert & Emergency Guidance Bar ── */}
        <div className="border-b border-white/20 bg-black/15 backdrop-blur-xl py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 text-amber-200 flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
              </div>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                <strong className="text-white font-bold font-display">Clinical Disclaimer: </strong>
                DermaDetect AI provides preliminary educational triage and symptom preparation, not definitive medical diagnoses or prescriptions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('safety')}
                className="btn-pill btn-pill-white !px-4 !py-1.5 !text-xs !text-[#D81E5B] font-bold flex items-center gap-2 cursor-pointer shadow-md hover:shadow-xl"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
                </span>
                <PhoneCall className="w-3.5 h-3.5 text-[#D81E5B]" />
                <span>Emergency Guide (911 / 112)</span>
              </button>

              <div className="inline-flex items-center gap-1.5 text-xs text-white bg-white/15 border border-white/30 px-3.5 py-1.5 rounded-full font-semibold shadow-xs backdrop-blur-md">
                <Lock className="w-3 h-3 text-white" />
                <span>Zero Photo Retention · Ephemeral Memory</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Footer Navigation Grid ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

            {/* ── Brand Column & Authors Spotlight (5 cols) ── */}
            <div className="sm:col-span-2 lg:col-span-5 space-y-6">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="flex items-center gap-3.5 cursor-pointer group text-left"
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-white/40 opacity-50 blur-sm group-hover:opacity-100 transition-opacity" />
                  <img
                    src={BRAND_LOGO_URL}
                    alt="DermaDetect AI Logo"
                    className="relative w-12 h-12 rounded-2xl object-contain border border-white/30 bg-white/20 backdrop-blur-md p-1 shrink-0 transition-transform group-hover:scale-105 shadow-md"
                  />
                </div>
                <div>
                  <span className="block text-2xl font-black text-white tracking-tight font-display drop-shadow-sm">
                    DermaDetect AI
                  </span>
                  <span className="block text-xs text-white/90 font-bold tracking-wide">
                    Caring Skin &amp; Symptom Companion
                  </span>
                </div>
              </button>

              <p className="text-sm text-white/90 leading-relaxed max-w-md font-medium">
                Empowering individuals and families with empathetic preliminary symptom triage, high-resolution dermatological awareness, and hospital-grade doctor discussion notes.
              </p>

              {/* Authors Spotlight Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/25 hover:bg-white/20 transition-all duration-300 shadow-md space-y-3 max-w-md group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-white/25 border border-white/30 flex items-center justify-center text-white shadow-xs">
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Clinical AI Engineering
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-white/75 font-semibold">Architects &amp; Authors</p>
                    <p className="text-sm font-bold text-white drop-shadow-xs">
                      Fizza Amin &amp; Muhammad Faizan Ud Din
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30 shadow-xs">
                    <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Column 2: Clinical Screening Modules (2.5 cols) ── */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 font-display">
                <Activity className="w-3.5 h-3.5 text-white" />
                <span>Screening</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <NavLink onClick={() => onNavigate('home')}>Home</NavLink>
                <NavLink onClick={() => onNavigate('symptoms')} badge="Triage">Symptom Checker</NavLink>
                <NavLink onClick={() => onNavigate('skin')} badge="Vision">Skin Analysis</NavLink>
                <NavLink onClick={() => onNavigate('doctor')} badge="24/7 AI">Dr. Fizza (AI MD)</NavLink>
                <NavLink onClick={() => onNavigate('results')}>Analysis Results</NavLink>
                <NavLink onClick={() => onNavigate('demo')}>Case Studies</NavLink>
              </ul>
            </div>

            {/* ── Column 3: Trust & Safety (2 cols) ── */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 font-display">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>Trust &amp; Safety</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <NavLink onClick={() => onNavigate('about')}>About DermaDetect</NavLink>
                <NavLink onClick={() => onNavigate('safety')} badge="Red Flags">Safety &amp; Warning</NavLink>
                <NavLink onClick={() => onNavigate('privacy')} badge="0-Logs">Privacy Policy</NavLink>
                <NavLink onClick={() => onNavigate('contact')}>Contact &amp; Research</NavLink>
              </ul>
            </div>

            {/* ── Column 4: Health Resources (2.5 cols) ── */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 font-display">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Official Resources</span>
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://medlineplus.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white transition-all flex items-center justify-between group py-1 font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">MedlinePlus (NIH)</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.cdc.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white transition-all flex items-center justify-between group py-1 font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">CDC Guidelines</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.aad.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white transition-all flex items-center justify-between group py-1 font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">AAD Dermatology</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.who.int"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white transition-all flex items-center justify-between group py-1 font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">WHO Global Health</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              </ul>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="btn-pill btn-pill-white !w-full !py-2.5 !text-xs !text-[#D81E5B] font-bold shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D81E5B]" />
                  <span>Clinical Collaboration Inquiry</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Giant Shimmering Brand Watermark ── */}
          <div className="relative overflow-hidden w-full select-none pointer-events-none pt-8 pb-3 text-center">
            <span className="footer-watermark block uppercase font-display font-black">
              DERMADETECT
            </span>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/85">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p>© {new Date().getFullYear()} DermaDetect AI. All rights reserved.</p>
              <span className="hidden sm:inline text-white/40">|</span>
              <p className="flex items-center gap-1.5 text-white/95 font-semibold">
                Created with <Heart className="w-3 h-3 text-white fill-white animate-pulse" /> by{' '}
                <strong className="text-white">Fizza Amin</strong> &amp;{' '}
                <strong className="text-white">Muhammad Faizan Ud Din</strong>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('safety')}
                className="hover:text-white transition-colors cursor-pointer font-medium"
              >
                Health &amp; Safety
              </button>
              <span className="text-white/40">·</span>
              <button
                type="button"
                onClick={() => onNavigate('privacy')}
                className="hover:text-white transition-colors cursor-pointer font-medium"
              >
                Privacy
              </button>
              <span className="text-white/40">·</span>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="hover:text-white transition-colors cursor-pointer font-medium"
              >
                Contact
              </button>
              <span className="text-white/40">·</span>
              <button
                type="button"
                onClick={scrollToTop}
                className="btn-pill btn-pill-white !px-3.5 !py-1.5 !text-xs !text-[#D81E5B] font-bold flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5"
                title="Scroll back to top"
              >
                <span>Top</span>
                <ArrowUp className="w-3 h-3 text-[#D81E5B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
