import React, { useState } from 'react';
import {
  Mail,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Building2,
  Send,
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-center">
      {/* Centered Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-3 max-w-3xl mx-auto flex flex-col items-center text-center"
      >
        <div className="text-xs font-bold uppercase tracking-widest text-[#249A96]">
          Clinical Feedback · Institutional & Research Inquiries
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#153B50] tracking-tight text-center">
          Contact DermaDetect AI
        </h1>
        <p className="text-base text-[#687986] leading-relaxed max-w-2xl mx-auto text-center">
          Have questions about our clinical triage methodology, privacy architecture, or the UnivaBio competition submission? Reach out to our clinical engineering team below.
        </p>
      </motion.div>

      {/* 3 Centered Communication Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MedicalCard padding="sm" className="flex flex-col items-center text-center space-y-2.5">
          <div className="w-11 h-11 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#153B50] text-sm">Clinical & Research Team</div>
          <p className="text-[#687986] text-xs font-mono">
            research@dermadetect-univabio.org
          </p>
        </MedicalCard>

        <MedicalCard padding="sm" className="flex flex-col items-center text-center space-y-2.5">
          <div className="w-11 h-11 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#153B50] text-sm">Initiative & Evaluation</div>
          <p className="text-[#687986] text-xs">
            UnivaBio — AI for Human Health Division
          </p>
        </MedicalCard>

        <MedicalCard padding="sm" className="flex flex-col items-center text-center space-y-2.5">
          <div className="w-11 h-11 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
            <Clock className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#153B50] text-sm">Response Window</div>
          <p className="text-[#687986] text-xs">
            Within 24–48 hours for non-clinical inquiries
          </p>
        </MedicalCard>
      </div>

      {/* Centered Contact Form Card */}
      <div className="max-w-3xl mx-auto">
        <MedicalCard padding="lg" hoverEffect={false} className="space-y-6 text-center">
          {submitted ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-[#153B50] text-center">
                  Thank you, {fullName}
                </h2>
                <p className="text-sm text-[#687986] leading-relaxed text-center">
                  Your inquiry under <strong>{role}</strong> has been logged. A confirmation note has been prepared for <span className="font-mono text-[#153B50]">{email}</span>.
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
                <h2 className="text-2xl font-bold text-[#153B50] text-center">
                  Send a Message
                </h2>
                <p className="text-xs text-[#687986] text-center">
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
                  <label className="block text-sm font-semibold text-[#153B50]">
                    Your Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full min-h-[46px] px-4 py-2.5 text-sm rounded-xl border border-[#DDE5ED] bg-white text-[#253746] focus:outline-none focus:ring-2 focus:ring-[#249A96]"
                  >
                    <option value="Patient / General User">Patient / General User</option>
                    <option value="Physician / Dermatologist">Physician / Dermatologist</option>
                    <option value="UnivaBio Competition Judge">UnivaBio Competition Judge</option>
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
                <span className="text-xs text-[#687986] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#249A96]" />
                  <span>Encrypted transmission · Zero third-party sharing</span>
                </span>

                <MedicalButton
                  type="submit"
                  variant="teal"
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
