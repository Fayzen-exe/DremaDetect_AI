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
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    <div className="bg-white border border-[#DCE6ED] rounded-3xl shadow-sm overflow-hidden">
      {/* Premium Clinical Header */}
      <div className="bg-[#153B50] text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#249A96] flex items-center justify-center shadow-xs border border-white/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#153B50]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg tracking-tight text-white">
                Dr. Fizza, MD — Interactive Clinical Consultation
              </h3>
              <span className="text-[11px] bg-[#E9F7F5] text-[#153B50] px-2.5 py-0.5 rounded-full font-bold">
                Educational Health Companion
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Structured plain-language explanations, self-care guidance & doctor visit questions
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
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-semibold ${
              autoVoiceEnabled
                ? 'bg-[#249A96] text-white border-[#249A96]'
                : 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/15'
            }`}
          >
            {autoVoiceEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>{autoVoiceEnabled ? 'Auto-Read: ON' : 'Auto-Read: OFF'}</span>
          </button>

          <label className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1.5 rounded-xl cursor-pointer border border-white/15 hover:bg-white/15 transition-colors">
            <input
              type="checkbox"
              checked={enableSearchGrounding}
              onChange={(e) => setEnableSearchGrounding(e.target.checked)}
              className="rounded text-[#249A96] focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-100 font-medium">Medical Literature Grounding</span>
          </label>

          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleResetChat}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Attached Assessment Context Banner (When opened inside Symptom or Skin Report) */}
      {reportContext && (
        <div className="bg-[#E9F7F5] border-b border-[#249A96]/25 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-[#153B50]">
            <FileText className="w-4 h-4 text-[#249A96] shrink-0" />
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
              className="text-xs px-3 py-1 rounded-lg bg-white hover:bg-[#153B50] text-[#153B50] hover:text-white border border-[#249A96]/30 font-semibold transition-colors cursor-pointer"
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
              className="text-xs px-3 py-1 rounded-lg bg-white hover:bg-[#153B50] text-[#153B50] hover:text-white border border-[#249A96]/30 font-semibold transition-colors cursor-pointer"
            >
              Prepare Doctor Questions
            </button>
          </div>
        </div>
      )}

      {/* Interactive Topic Explorer & Quick Questions */}
      <div className="bg-[#F7FAFC] border-b border-[#E3EDF2] px-5 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#687986] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#249A96]" />
            Choose a Consultation Topic or Click a Starter Question:
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#153B50] text-white'
                      : 'bg-white text-[#687986] hover:text-[#153B50] border border-[#DCE6ED]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{topic.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {TOPIC_STARTERS[selectedTopicIdx].prompts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-left text-xs p-2.5 rounded-xl bg-white hover:bg-[#E9F7F5]/60 text-[#253746] hover:text-[#153B50] border border-[#DCE6ED] hover:border-[#249A96]/40 transition-all cursor-pointer leading-snug shadow-2xs"
            >
              “{q}”
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Stream */}
      <div className="p-5 sm:p-6 max-h-[600px] overflow-y-auto space-y-5 bg-[#F7FAFC]/60">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-9 h-9 rounded-xl bg-[#153B50] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Stethoscope className="w-4 h-4 text-[#E9F7F5]" />
              </div>
            )}

            <div
              className={`rounded-2xl ${
                msg.role === 'user'
                  ? 'max-w-[82%] sm:max-w-[70%] bg-[#153B50] text-white px-5 py-3.5 rounded-tr-xs shadow-xs'
                  : 'w-full max-w-[95%] sm:max-w-[88%] bg-white border border-[#DCE6ED] text-[#253746] p-5 rounded-tl-xs shadow-xs'
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
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E9F7F5]">
                      Your Question
                    </span>
                    {msg.timestamp && (
                      <span className="text-[10px] text-slate-300">{msg.timestamp}</span>
                    )}
                  </div>
                  <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-line">
                    {msg.content}
                  </p>
                </div>
              )}

              {/* Grounded Literature Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E3EDF2]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#687986] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#249A96]" />
                    Clinical Reference Sources:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.slice(0, 4).map((src, sIdx) => (
                      <a
                        key={sIdx}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#F7FAFC] hover:bg-[#E9F7F5] text-[#249A96] border border-[#DCE6ED] font-medium transition-colors"
                      >
                        <span className="truncate max-w-[220px]">{src.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-9 h-9 rounded-xl bg-[#E9F7F5] text-[#153B50] border border-[#249A96]/30 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-9 h-9 rounded-xl bg-[#153B50] text-white flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4 text-[#E9F7F5]" />
            </div>
            <div className="bg-white border border-[#DCE6ED] rounded-2xl rounded-tl-xs px-5 py-4 flex items-center gap-3 text-sm text-[#253746] shadow-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-[#249A96]" />
              <span>
                Dr. Fizza is organizing a clear, patient-friendly clinical note for you...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
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
        className="p-4 sm:p-5 bg-white border-t border-[#DCE6ED]"
      >
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms, ask about a condition, or ask what to discuss with your doctor..."
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-[#DCE6ED] bg-[#F7FAFC] text-[#253746] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#249A96] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
              !input.trim() || isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#249A96] hover:bg-[#1d807c] text-white shadow-xs'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Ask Dr. Fizza</span>
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#687986]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#249A96] shrink-0" />
            Educational clinical guidance only • Does not replace an in-person doctor examination or prescribe medicine
          </span>
        </div>
      </form>
    </div>
  );
};
