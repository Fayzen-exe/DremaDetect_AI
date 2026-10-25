import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Stethoscope,
  ShieldCheck,
  Volume2,
  VolumeX,
  RotateCcw,
  FileText,
  MessageSquare,
  HeartPulse,
  Pill,
  ClipboardList,
} from 'lucide-react';
import { consultDoctor } from '../services/api';
import { DoctorClinicalReplay } from './DoctorClinicalReplay';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  sources?: Array<{ title: string; uri: string }>;
}

interface AIDoctorConsultationProps {
  reportContext?: any;
  reportType?: 'symptom' | 'skin';
  initialMessage?: string;
}

const TOPIC_STARTERS: Array<{
  category: string;
  icon: React.FC<{ className?: string }>;
  prompts: string[];
}> = [
  {
    category: 'Symptoms & Recovery',
    icon: HeartPulse,
    prompts: [
      'I have a sore throat, mild fever, and fatigue for 2 days. What are the possible explanations?',
      'How can I tell if my headache is a tension headache or a migraine?',
      'What gentle home comfort measures help most during a viral illness?',
    ],
  },
  {
    category: 'Skin & Rash Care',
    icon: Sparkles,
    prompts: [
      'I noticed a dry, red, itchy patch on my arm. How do doctors tell eczema apart from contact dermatitis?',
      'What does the ABCDE checklist mean when checking a skin spot or mole?',
      'What gentle, fragrance-free skincare routine protects an irritated skin barrier?',
    ],
  },
  {
    category: 'Medication Safety',
    icon: Pill,
    prompts: [
      'What should I ask a pharmacist before using an over-the-counter pain or fever reliever?',
      'Why is it important not to apply steroid creams to an undiagnosed skin rash?',
      'What precautions apply to children, pregnancy, or drug allergies when considering OTC comfort care?',
    ],
  },
  {
    category: 'Doctor Visit Prep',
    icon: ClipboardList,
    prompts: [
      'What are the most helpful questions to ask my doctor at my upcoming appointment?',
      'What information and symptom timeline should I write down before seeing a physician?',
      'What warning signs mean I should seek urgent care instead of waiting for a routine visit?',
    ],
  },
];

export const AIDoctorConsultation: React.FC<AIDoctorConsultationProps> = ({
  reportContext,
  reportType = 'symptom',
  initialMessage,
}) => {
  const getWelcomeMessage = (ctx: any, type: 'symptom' | 'skin'): Message => ({
    role: 'assistant',
    timestamp: 'Just now',
    content: ctx
      ? `Hello${ctx.patientName && ctx.patientName !== 'Not Provided' ? ` ${ctx.patientName}` : ''}, I'm Dr. Fizza, MD. I have reviewed your ${
          type === 'skin' ? 'Skin Analysis' : 'Symptom Assessment'
        } report${ctx.caseId ? ` (${ctx.caseId})` : ''}.\n\nPRIMARY WORKING DIAGNOSIS & POSSIBLE EXPLANATIONS\n1. Report Context Loaded: I am ready to walk you through each possible condition in your report, explain what the medical terms mean in everyday language, and clarify how a clinician evaluates them.\n2. Important Clinical Boundary: Please remember that these are possible explanations rather than a confirmed diagnosis.\n\nPHYSIOLOGICAL SUPPORT & COMFORT MEASURES\n1. Safe Recovery Guidance: Ask me about gentle self-care steps, what to avoid, or general educational information about medications.\n\nQUESTIONS FOR YOUR DOCTOR\n1. Appointment Preparation: I can help you tailor a personalized checklist of questions to bring to your physician or dermatologist.`
      : `Hello, I'm Dr. Fizza, MD — your AI Clinical Educator at DermaDetect AI.\n\nPRIMARY WORKING DIAGNOSIS & POSSIBLE EXPLANATIONS\n1. How We Work Together: Share the symptoms or skin changes you are noticing, how long they have been present, and what concerns you most. I will organize possible explanations and explain how doctors evaluate them in person.\n\nPHYSIOLOGICAL SUPPORT & COMFORT MEASURES\n1. Practical Self-Care: I provide calm, evidence-informed comfort measures, skincare tips, and general medication safety education.\n\nQUESTIONS FOR YOUR DOCTOR\n1. Prepared & Confident: Every response includes practical questions you can check off and bring to your doctor appointment.`,
  });

  const [messages, setMessages] = useState<Message[]>(() => [getWelcomeMessage(reportContext, reportType)]);
  const [input, setInput] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [enableSearchGrounding, setEnableSearchGrounding] = useState(true);
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState(false);
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.geminiConfigured === 'boolean') {
          setGeminiConfigured(data.geminiConfigured);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [getWelcomeMessage(reportContext, reportType)];
      }
      return prev;
    });
  }, [reportContext, reportType]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: query, timestamp: nowTime },
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await consultDoctor(apiMessages, reportContext, reportType, enableSearchGrounding);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: res.sources,
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to get response from Dr. Fizza.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([messages[0]]);
    setError(null);
  };

  return (
    <div className="bg-white border border-[#E7EDF5] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      {/* Premium Clinical Header */}
      <div className="bg-[#10264D] text-white p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-13 h-13 rounded-2xl bg-[#2458F5] flex items-center justify-center shadow-[0_4px_16px_rgba(36,88,245,0.4)] border border-white/20">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#10264D] shadow-xs" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg tracking-tight text-white font-display">
                Dr. Fizza, MD — Clinical Health Educator
              </h3>
              <span className="text-[11px] bg-[#EAF2FF] text-[#10264D] px-2.5 py-0.5 rounded-full font-bold">
                Health Companion
              </span>
              {geminiConfigured === true && (
                <span className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Clinical Intelligence Online
                </span>
              )}
              {geminiConfigured === false && (
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-semibold"
                  title="Autonomous Clinical Decision Support active."
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Clinical Intelligence Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Structured plain-language explanations, physiological comfort measures & doctor visit questions
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const nextState = !autoVoiceEnabled;
              setAutoVoiceEnabled(nextState);
              if (!nextState && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-semibold ${
              autoVoiceEnabled
                ? 'bg-[#2458F5] text-white border-[#2458F5] shadow-xs'
                : 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/20'
            }`}
          >
            {autoVoiceEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span>{autoVoiceEnabled ? 'Auto-Voice: ON' : 'Auto-Voice: OFF'}</span>
          </button>

          <label className="flex items-center gap-2 text-xs bg-white/10 px-3.5 py-2 rounded-xl cursor-pointer border border-white/15 hover:bg-white/20 transition-colors">
            <input
              type="checkbox"
              checked={enableSearchGrounding}
              onChange={(e) => setEnableSearchGrounding(e.target.checked)}
              className="rounded text-[#2458F5] focus:ring-0 cursor-pointer accent-[#2458F5]"
            />
            <span className="text-slate-100 font-medium">Literature Grounding</span>
          </label>

          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleResetChat}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Attached Assessment Context Banner */}
      {reportContext && (
        <div className="bg-[#EAF2FF] border-b border-[#2458F5]/20 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-[#10264D]">
            <FileText className="w-4 h-4 text-[#2458F5] shrink-0" />
            <span>
              <strong>Active Report Attached:</strong> Dr. Fizza has context from your{' '}
              {reportType === 'skin' ? 'Skin Analysis' : 'Symptom Assessment'} ({reportContext.caseId || 'Current Report'}).
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handleSend(
                  'Please explain the possible conditions in my report in simple, reassuring everyday terms.'
                )
              }
              className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-[#10264D] text-[#10264D] hover:text-white border border-[#2458F5]/30 font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              Explain My Report Simply
            </button>
            <button
              type="button"
              onClick={() =>
                handleSend(
                  'What are the most important questions I should ask my doctor about this report?'
                )
              }
              className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-[#10264D] text-[#10264D] hover:text-white border border-[#2458F5]/30 font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              Prepare Doctor Questions
            </button>
          </div>
        </div>
      )}

      {/* Interactive Topic Explorer */}
      <div className="bg-[#F7FAFF] border-b border-[#E7EDF5] px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#2458F5]" />
            Consultation Topics & Starter Questions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TOPIC_STARTERS.map((topic, idx) => {
              const Icon = topic.icon;
              const isSelected = selectedTopicIdx === idx;
              return (
                <button
                  key={topic.category}
                  type="button"
                  onClick={() => setSelectedTopicIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#10264D] text-white shadow-xs'
                      : 'bg-white text-[#64748B] hover:text-[#10264D] border border-[#E7EDF5]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{topic.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {TOPIC_STARTERS[selectedTopicIdx].prompts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-left text-xs p-3 rounded-2xl bg-white hover:bg-[#EAF2FF]/60 text-[#17253B] hover:text-[#10264D] border border-[#E7EDF5] hover:border-[#2458F5]/40 transition-all cursor-pointer leading-relaxed shadow-2xs group"
            >
              <span className="group-hover:text-[#2458F5] transition-colors">“{q}”</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Stream */}
      <div className="p-6 sm:p-8 max-h-[640px] overflow-y-auto space-y-6 bg-[#F7FAFF]/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-2xl bg-[#10264D] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Stethoscope className="w-5 h-5 text-[#EAF2FF]" />
              </div>
            )}

            <div
              className={`rounded-2xl ${
                msg.role === 'user'
                  ? 'max-w-[82%] sm:max-w-[70%] bg-[#10264D] text-white px-5 py-4 rounded-tr-xs shadow-xs'
                  : 'w-full max-w-[95%] sm:max-w-[88%] bg-white border border-[#E7EDF5] text-[#17253B] p-6 rounded-tl-xs shadow-[0_4px_20px_rgb(0,0,0,0.02)]'
              }`}
            >
              {msg.role === 'assistant' ? (
                <DoctorClinicalReplay
                  text={msg.content}
                  autoRead={autoVoiceEnabled && idx === messages.length - 1 && idx > 0}
                  onSelectFollowUp={(followUpQuestion) => handleSend(followUpQuestion)}
                />
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                      Patient
                    </span>
                    {msg.timestamp && (
                      <span className="text-[10px] text-slate-300">{msg.timestamp}</span>
                    )}
                  </div>
                  <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-line text-white">
                    {msg.content}
                  </p>
                </div>
              )}

              {/* Grounded Literature Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-[#E7EDF5]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2458F5]" />
                    Clinical Reference Sources:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.slice(0, 4).map((src, sIdx) => {
                      const isSafeHttpUrl = typeof src.uri === 'string' && /^https?:\/\//i.test(src.uri);
                      if (!isSafeHttpUrl) {
                        return (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1 text-[11px] px-3 py-1 rounded-lg bg-[#F7FAFF] text-[#64748B] border border-[#E7EDF5] font-medium"
                          >
                            <span className="truncate max-w-[220px]">{src.title}</span>
                          </span>
                        );
                      }
                      return (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-lg bg-[#F7FAFF] hover:bg-[#EAF2FF] text-[#2458F5] border border-[#E7EDF5] hover:border-[#2458F5]/30 font-medium transition-colors"
                        >
                          <span className="truncate max-w-[220px]">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#10264D] border border-[#2458F5]/30 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                <User className="w-5 h-5 text-[#2458F5]" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-10 h-10 rounded-2xl bg-[#10264D] text-white flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-[#EAF2FF]" />
            </div>
            <div className="bg-white border border-[#E7EDF5] rounded-2xl rounded-tl-xs px-5 py-4 flex items-center gap-3 text-sm text-[#17253B] shadow-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-[#2458F5]" />
              <span>
                Dr. Fizza is organizing a clear clinical consultation note for you...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-5 sm:p-6 bg-white border-t border-[#E7EDF5]"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms, ask about a condition, or ask what to discuss with your doctor..."
            className="flex-1 px-4 py-3.5 text-sm rounded-2xl border border-[#E7EDF5] bg-[#F7FAFF] text-[#17253B] focus:bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
              !input.trim() || isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#2458F5] hover:bg-[#1a3fcc] text-white shadow-[0_4px_16px_rgba(36,88,245,0.3)] hover:shadow-[0_8px_28px_rgba(36,88,245,0.4)] hover:-translate-y-0.5'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Ask Dr. Fizza</span>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2458F5] shrink-0" />
            Educational clinical guidance only • Does not replace an in-person doctor examination or prescribe medicine
          </span>
        </div>
      </form>
    </div>
  );
};
