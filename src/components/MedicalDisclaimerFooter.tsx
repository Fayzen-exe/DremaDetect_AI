import React from 'react';
import { ShieldCheck, AlertTriangle, Code2, Heart, Mail, ExternalLink } from 'lucide-react';
import { BRAND_LOGO_URL } from './Header';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className="text-[#94A3B8] hover:text-white transition-colors duration-150 cursor-pointer text-left flex items-center gap-1.5 group"
    >
      <span className="w-0 group-hover:w-3 h-0.5 bg-[#2458F5] rounded-full transition-all duration-200 overflow-hidden" />
      {children}
    </button>
  </li>
);

export const MedicalDisclaimerFooter: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#10264D] text-slate-300 mt-20 no-print print:hidden">

      {/* ── Clinical Disclaimer Banner ── */}
      <div className="border-b border-white/8 bg-[#0c1e3d] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white font-semibold">Clinical Disclaimer: </strong>
              DermaDetect AI provides educational health information, not medical diagnoses. Please consult a qualified physician for serious health concerns.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#2458F5] bg-[#2458F5]/10 border border-[#2458F5]/20 px-3 py-1.5 rounded-full shrink-0 font-medium whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Photo Retention · Private
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ── Brand Column ── */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer group text-left"
            >
              <img
                src={BRAND_LOGO_URL}
                alt="DermaDetect AI Logo"
                className="w-10 h-10 rounded-xl object-contain border border-white/15 bg-white/10 shrink-0 transition-transform group-hover:scale-105"
              />
              <div>
                <span className="block text-base font-extrabold text-white tracking-tight font-display">
                  DermaDetect AI
                </span>
                <span className="block text-xs text-[#2458F5] font-medium">AI Health Platform</span>
              </div>
            </button>

            <p className="text-sm text-slate-400 leading-relaxed">
              An AI-powered platform for preliminary symptom assessment and dermatological screening. Designed to help you understand your health better.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <ShieldCheck className="w-4 h-4 text-[#2458F5]" />
              <span>HIPAA-Conscious Ephemeral Design</span>
            </div>

            <div className="pt-1 border-t border-white/8 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <Code2 className="w-3.5 h-3.5 text-[#2458F5]" />
                <span className="text-white/60">Developed by</span>
              </div>
              <p className="text-sm font-semibold text-white">
                Fizza Amin &amp; Muhammad Faizan Ud Din
              </p>
            </div>
          </div>

          {/* ── Column 2: Clinical Tools ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Clinical Tools
            </h4>
            <ul className="space-y-3 text-sm">
              <NavLink onClick={() => onNavigate('home')}>Home</NavLink>
              <NavLink onClick={() => onNavigate('symptoms')}>AI Symptom Checker</NavLink>
              <NavLink onClick={() => onNavigate('skin')}>AI Skin Analysis</NavLink>
              <NavLink onClick={() => onNavigate('doctor')}>Dr. Fizza (AI MD)</NavLink>
              <NavLink onClick={() => onNavigate('results')}>Analysis Results</NavLink>
              <NavLink onClick={() => onNavigate('demo')}>Sample Cases</NavLink>
            </ul>
          </div>

          {/* ── Column 3: Trust & Policy ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Trust &amp; Policy
            </h4>
            <ul className="space-y-3 text-sm">
              <NavLink onClick={() => onNavigate('about')}>About DermaDetect AI</NavLink>
              <NavLink onClick={() => onNavigate('safety')}>Health &amp; Safety Info</NavLink>
              <NavLink onClick={() => onNavigate('privacy')}>Privacy Policy</NavLink>
              <NavLink onClick={() => onNavigate('contact')}>Contact Us</NavLink>
            </ul>
          </div>

          {/* ── Column 4: Health Resources ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              Health Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://medlineplus.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  MedlinePlus (NIH)
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cdc.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  CDC Health Topics
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.aad.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  AAD Dermatology
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  WHO Health Topics
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>

            <div className="pt-2 space-y-2">
              <h5 className="text-xs font-semibold text-white/60 uppercase tracking-widest">Contact</h5>
              <a
                href="mailto:dermadetect@example.com"
                className="text-sm text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-[#2458F5]" />
                Get in touch
              </a>
            </div>
          </div>
        </div>

        {/* ── Giant Brand Watermark (Reference Style) ── */}
        <div className="relative overflow-hidden w-full select-none pointer-events-none pt-4 pb-2 text-center">
          <span className="footer-watermark block tracking-tighter uppercase font-display font-black text-white/[0.04]">
            DermaDetect
          </span>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© {new Date().getFullYear()} DermaDetect AI. All rights reserved.</p>
            <span className="hidden sm:inline text-white/15">|</span>
            <p className="flex items-center gap-1.5">
              Made with <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> by{' '}
              <strong className="text-white/80">Fizza Amin</strong> &amp;{' '}
              <strong className="text-white/80">Muhammad Faizan Ud Din</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('safety')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Health &amp; Safety
            </button>
            <span className="text-white/15">·</span>
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <span className="text-white/15">·</span>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
