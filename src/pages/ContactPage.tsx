import React, { useState } from 'react';
import {
  Mail,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Building2,
  Send,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  MedicalCard,
  MedicalInput,
  MedicalTextarea,
  MedicalAlert,
} from '../components/ui/MedicalUI';

interface ContactPageProps {
  onNavigate: (tab: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Patient / General User');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError('Please complete your name, email address, and message before submitting.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (for example, name@domain.com).');
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 text-center">
      {/* Radiant Sunset Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="sunset-subpage-banner text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl"
      >
        <div className="absolute inset-0 bg-dot-grid-white opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Clinical Feedback · Institutional & Research Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.15]">
            Contact DermaDetect AI
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl mx-auto">
            Have questions about our clinical triage methodology, privacy architecture, or the UnivaBio initiative? Reach out to our clinical engineering team below.
          </p>
        </div>
      </motion.div>

      {/* 3 Communication Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MedicalCard padding="md" className="flex flex-col items-center text-center space-y-3 rounded-3xl border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-[#D81E5B]/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#D81E5B]/10 text-[#D81E5B] flex items-center justify-center mx-auto shadow-2xs">
            <Mail className="w-6 h-6" />
          </div>
          <div className="font-bold text-[#10264D] text-sm font-display">Clinical & Research Team</div>
          <p className="text-[#64748B] text-xs font-mono">
            research@dermadetect-univabio.org
          </p>
        </MedicalCard>

        <MedicalCard padding="md" className="flex flex-col items-center text-center space-y-3 rounded-3xl border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-[#FF7843]/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#FF7843]/10 text-[#FF7843] flex items-center justify-center mx-auto shadow-2xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="font-bold text-[#10264D] text-sm font-display">Initiative & Evaluation</div>
          <p className="text-[#64748B] text-xs">
            UnivaBio — AI for Human Health Division
          </p>
        </MedicalCard>

        <MedicalCard padding="md" className="flex flex-col items-center text-center space-y-3 rounded-3xl border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-[#8B5CF6]/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mx-auto shadow-2xs">
            <Clock className="w-6 h-6" />
          </div>
          <div className="font-bold text-[#10264D] text-sm font-display">Response Window</div>
          <p className="text-[#64748B] text-xs">
            Within 24–48 hours for non-clinical inquiries
          </p>
        </MedicalCard>
      </div>

      {/* Centered Contact Form Card */}
      <div className="max-w-3xl mx-auto">
        <MedicalCard padding="lg" hoverEffect={false} className="space-y-6 text-center rounded-3xl border-[#E7EDF5] shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          {submitted ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-[#D81E5B]/10 text-[#D81E5B] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl font-extrabold text-[#10264D] text-center font-display">
                  Thank you, {fullName}
                </h2>
                <p className="text-sm text-[#64748B] leading-relaxed text-center">
                  Your inquiry under <strong>{role}</strong> has been logged. A confirmation note has been prepared for <span className="font-mono text-[#10264D] font-medium">{email}</span>.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-pill btn-pill-glass !text-[#10264D] !border-[#E7EDF5] !bg-white hover:!bg-slate-50 !px-5 !py-2.5 !text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Send Another Message
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="btn-pill btn-pill-dark !px-5 !py-2.5 !text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-extrabold text-[#10264D] text-center font-display">
                  Send a Message
                </h2>
                <p className="text-xs text-[#64748B] text-center">
                  All fields marked with * are required. Do not include sensitive medical record numbers.
                </p>
              </div>

              {error && (
                <MedicalAlert tone="urgent" title="Form Validation Notice" centered>
                  {error}
                </MedicalAlert>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <MedicalInput
                  label="Full Name *"
                  placeholder="Dr. Sarah Jenkins / Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <MedicalInput
                  label="Email Address *"
                  type="email"
                  placeholder="name@organization.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 text-left">
                  <label className="block text-sm font-semibold text-[#10264D]">
                    Your Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full min-h-[46px] px-4 py-2.5 text-sm rounded-xl border border-[#E7EDF5] bg-white text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all cursor-pointer"
                  >
                    <option value="Patient / General User">Patient / General User</option>
                    <option value="Physician / Dermatologist">Physician / Dermatologist</option>
                    <option value="Clinical Evaluator / Healthcare Partner">Clinical Evaluator / Healthcare Partner</option>
                    <option value="Healthcare Researcher">Healthcare Researcher</option>
                  </select>
                </div>

                <MedicalInput
                  label="Subject"
                  placeholder="Feedback on Skin Analysis / Partnership"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <MedicalTextarea
                label="Message *"
                rows={4}
                placeholder="Share your questions, clinical feedback, or evaluation notes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#64748B] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#FA4B4B]" />
                  <span>Encrypted transmission · Zero third-party sharing</span>
                </span>

                <button
                  type="submit"
                  className="btn-pill btn-pill-coral flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </MedicalCard>
      </div>
    </div>
  );
};
