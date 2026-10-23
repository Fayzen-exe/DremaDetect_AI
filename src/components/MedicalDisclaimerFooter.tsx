import React from 'react';
import { ShieldCheck, AlertTriangle, Code2 } from 'lucide-react';
import { BRAND_LOGO_URL } from './Header';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const MedicalDisclaimerFooter: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#153B50] text-slate-200 border-t border-[#102d3e] text-sm mt-20 no-print print:hidden">
      {/* Clinical & Safety Disclaimer Banner */}
      <div className="border-b border-white/10 bg-[#102d3e] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#E7A23B]/20 border border-[#E7A23B]/40 text-[#E7A23B] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-white">Clinical Disclaimer: </strong>
              This tool gives information, not a medical diagnosis. Please consult a qualified physician or dermatologist for serious medical concerns.
            </p>
          </div>
          <span className="text-xs text-[#E9F7F5] font-medium whitespace-nowrap shrink-0">
            Zero Photo Retention · Private In-Memory Triage
          </span>
        </div>
      </div>

      {/* Main Footer Navigation Mirroring All Pages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={BRAND_LOGO_URL}
                alt="DermaDetect AI Logo"
                className="w-10 h-10 rounded-xl object-contain p-0.5 border border-white/20 bg-white shrink-0"
              />
              <span className="text-base font-extrabold text-white tracking-tight font-display">
                DermaDetect AI
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Premium medical SaaS platform for preliminary symptom assessment and dermatological morphology screening.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E9F7F5] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#249A96]" />
              <span>HIPAA-Conscious Ephemeral Design</span>
            </div>
            <div className="pt-2 border-t border-white/10 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-[#E9F7F5] font-semibold">
                <Code2 className="w-3.5 h-3.5 text-[#249A96]" />
                <span>Lead Developers</span>
              </div>
              <p className="text-white font-semibold">
                Fizza Amin &amp; Muhammad Faizan Ud Din
              </p>
            </div>
          </div>

          {/* Column 2: Clinical Screening Pages */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Clinical Screening
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('symptoms')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  AI Symptom Checker
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('skin')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  AI Skin Analysis
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('results')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  Analysis Results
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Safety Pages */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Governance & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  About DermaDetect AI
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('safety')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  Health Information and Safety
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Clinical Support & Benchmarks */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Clinical Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('doctor')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  Consult Dr. Fizza (AI MD)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('demo')}
                  className="hover:text-[#E9F7F5] transition-colors cursor-pointer"
                >
                  Standardized Sample Cases
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Developer Credit Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
            <p>© {new Date().getFullYear()} DermaDetect AI. All rights reserved.</p>
            <span className="hidden sm:inline text-white/30">|</span>
            <p className="text-[#E9F7F5] font-medium">
              Developed by <strong className="text-white">Fizza Amin</strong> and{' '}
              <strong className="text-white">Muhammad Faizan Ud Din</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('safety')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Health & Safety
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
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
