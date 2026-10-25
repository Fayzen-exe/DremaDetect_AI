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
  MedicalButton,
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
      {/* Centered Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-3.5 max-w-3xl mx-auto flex flex-col items-center text-center"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2FF] border border-[#2458F5]/20 text-[#2458F5] text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clinical Feedback · Institutional & Research Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#10264D] tracking-tight font-display text-center leading-[1.15]">
          Contact DermaDetect AI
        </h1>
        <p className="text-base text-[#64748B] leading-relaxed max-w-2xl mx-auto text-center">
          Have questions about our clinical triage methodology, privacy architecture, or the UnivaBio initiative? Reach out to our clinical engineering team below.
        </p>
      </motion.div>

      {/* 3 Communication Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MedicalCard padding="md" className="flex flex-col items-center text-center space-y-2.5 rounded-3xl border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto shadow-2xs">
            <Mail className="w-6 h-6" />
          </div>
          <div className="font-bold text-[#10264D] text-sm font-display">Clinical & Research Team</div>
          <p className="text-[#64748B] text-xs font-mono">
            research@dermadetect-univabio.org
          </p>
        </MedicalCard>

        <MedicalCard padding="md" className="flex flex-col items-center text-center space-y-2.5 rounded-3xl border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto shadow-2xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="font-bold text-[#10264D] text-sm font-display">Initiative & Evaluation</div>
          <p className="text-[#64748B] text-xs">
            UnivaBio — AI for Human Health Division
          </p>
        </MedicalCard>

        <MedicalCard padding="md" className="flex flex-col items-center text-center space-y-2.5 rounded-3xl border-[#E7EDF5] shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto shadow-2xs">
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
              <div className="w-16 h-16 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto shadow-xs">
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
                <MedicalButton variant="outline" onClick={handleReset}>
                  Send Another Message
                </MedicalButton>
                <MedicalButton variant="navy" onClick={() => onNavigate('home')}>
                  Return to Home
                </MedicalButton>
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
                  <ShieldCheck className="w-4 h-4 text-[#2458F5]" />
                  <span>Encrypted transmission · Zero third-party sharing</span>
                </span>

                <MedicalButton
                  type="submit"
                  variant="blue"
                  size="lg"
                  icon={<Send className="w-4 h-4" />}
                >
                  Submit Inquiry
                </MedicalButton>
              </div>
            </form>
          )}
        </MedicalCard>
      </div>
    </div>
  );
};
