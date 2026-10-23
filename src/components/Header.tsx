import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const BRAND_LOGO_URL = '/assets/aistudio/logore_aadb4948.png';

export type PageRoute = string;

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'symptoms', label: 'Symptom Checker' },
    { id: 'skin', label: 'Skin Analysis' },
    { id: 'doctor', label: 'Dr. Fizza (AI MD)' },
    { id: 'about', label: 'About' },
  ];

  const mobileSecondaryItems = [
    { id: 'results', label: 'Analysis Results' },
    { id: 'demo', label: 'Sample Cases' },
    { id: 'safety', label: 'Health Information & Safety' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Official Logo and single-line product name */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#249A96]"
          >
            <img
              src={BRAND_LOGO_URL}
              alt="DermaDetect AI Logo"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-xl object-contain p-0.5 border border-[#DCE6ED] shadow-2xs shrink-0 bg-white"
            />
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-[#153B50] font-display leading-tight">
                DermaDetect AI
              </span>
              <span className="text-[11px] font-medium text-[#249A96] leading-tight">
                Caring Skin &amp; Symptom Companion
              </span>
            </div>
          </button>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#687986]">
            {primaryNavItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#153B50] font-bold underline underline-offset-8 decoration-2 decoration-[#249A96]'
                      : 'hover:text-[#153B50] hover:underline hover:underline-offset-8'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Prominent "Start Free Assessment" button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('symptoms')}
              className="hidden sm:inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#249A96] hover:bg-[#1d807c] rounded-xl shadow-2xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Start Free Assessment
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-[#153B50] hover:bg-[#F7FAFC] rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Collapsible Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {primaryNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full min-h-[44px] text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center ${
                currentTab === item.id
                  ? 'bg-[#E9F7F5] text-[#153B50] font-bold'
                  : 'text-[#253746] hover:bg-[#F7FAFC]'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-[#F1F5F9] space-y-1">
            {mobileSecondaryItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full min-h-[40px] text-left px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center ${
                  currentTab === item.id
                    ? 'bg-[#E9F7F5] text-[#153B50] font-bold'
                    : 'text-[#687986] hover:bg-[#F7FAFC] hover:text-[#153B50]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => handleNavClick('symptoms')}
              className="w-full min-h-[46px] py-3 text-center text-sm font-semibold text-white bg-[#249A96] hover:bg-[#1d807c] rounded-xl shadow-2xs cursor-pointer"
            >
              Start Free Assessment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
