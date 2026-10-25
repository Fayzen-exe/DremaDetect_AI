import React, { useState, useEffect, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Copy,
  Check,
  MessageSquarePlus,
  HeartHandshake,
} from 'lucide-react';

interface DoctorClinicalReplayProps {
  text: string;
  autoRead?: boolean;
  onSelectFollowUp?: (question: string) => void;
}

interface ParsedSection {
  title: string;
  type: 'intro' | 'diagnosis' | 'care' | 'questions' | 'warning' | 'general';
  lines: string[];
}

function classifySection(title: string): ParsedSection['type'] {
  const upper = title.toUpperCase();
  if (
    upper.includes('DIAGNOSIS') ||
    upper.includes('DISEASE') ||
    upper.includes('CONDITION') ||
    upper.includes('EXPLANATION') ||
    upper.includes('POSSIBILIT') ||
    upper.includes('ASSESSMENT')
  ) {
    return 'diagnosis';
  }
  if (
    upper.includes('SUPPORT') ||
    upper.includes('COMFORT') ||
    upper.includes('CARE') ||
    upper.includes('RECOVERY') ||
    upper.includes('RELIEF') ||
    upper.includes('MEDICATION')
  ) {
    return 'care';
  }
  if (upper.includes('QUESTION') || upper.includes('DOCTOR') || upper.includes('APPOINTMENT')) {
    return 'questions';
  }
  if (
    upper.includes('URGENT') ||
    upper.includes('RED-FLAG') ||
    upper.includes('RED FLAG') ||
    upper.includes('EMERGENCY') ||
    upper.includes('SAFETY') ||
    upper.includes('CRITICAL')
  ) {
    return 'warning';
  }
  return 'general';
}

function parseConsultationSections(cleanText: string): ParsedSection[] {
  const rawLines = cleanText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const sections: ParsedSection[] = [];
  let current: ParsedSection = {
    title: 'Clinical Overview',
    type: 'intro',
    lines: [],
  };

  for (const line of rawLines) {
    const strippedLine = line.replace(/^#{1,4}\s*/, '').trim();
    const isAllCapsHeader =
      /^[A-Z][A-Z0-9\s&/—:()-]{5,85}$/.test(strippedLine) &&
      !strippedLine.startsWith('1.') &&
      !strippedLine.startsWith('2.') &&
      !strippedLine.startsWith('3.') &&
      !strippedLine.startsWith('4.') &&
      !strippedLine.startsWith('5.');

    if (isAllCapsHeader) {
      if (current.lines.length > 0) {
        sections.push(current);
      }
      const cleanHeader = strippedLine.replace(/:$/, '').trim();
      current = {
        title: cleanHeader,
        type: classifySection(cleanHeader),
        lines: [],
      };
    } else {
      current.lines.push(strippedLine);
    }
  }

  if (current.lines.length > 0) {
    sections.push(current);
  }

  return sections;
}

export const DoctorClinicalReplay: React.FC<DoctorClinicalReplayProps> = ({
  text,
  autoRead = false,
  onSelectFollowUp,
}) => {
  const cleanText = useMemo(
    () =>
      (text || '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/^#{1,4}\s*/gm, ''),
    [text]
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (autoRead) {
      startVoiceSynthesis();
    }
  }, [cleanText]);

  const startVoiceSynthesis = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.98;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.includes('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Victoria') ||
          v.name.includes('Karen') ||
          v.name.includes('Google'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const togglePauseSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      startVoiceSynthesis();
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const handleCopyNote = () => {
    navigator.clipboard.writeText(cleanText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2500);
  };

  const sections = parseConsultationSections(cleanText);

  const followUpPrompts = useMemo(() => {
    const lower = cleanText.toLowerCase();
    if (/mole|melanoma|abcde|pigment|nevus|dermoscopy/.test(lower)) {
      return [
        'How does a dermatologist examine a spot with a dermoscope?',
        'What sun-protection habits best protect pigmented skin spots?',
        'What changes in a mole mean I should schedule a prompt biopsy check?',
      ];
    }
    if (/eczema|dermatitis|rash|itch|psoriasis|fungal|tinea|skin barrier|acne/.test(lower)) {
      return [
        'What daily fragrance-free skincare routine helps repair the skin barrier?',
        'How can a doctor tell if a rash is eczema, contact dermatitis, or fungal?',
        'What common soaps, fabrics, or topical products should I avoid right now?',
      ];
    }
    if (/medication|pharmacist|otc|ibuprofen|acetaminophen|steroid/.test(lower)) {
      return [
        'What non-medication comfort steps can I use alongside or instead of OTC products?',
        'What drug interactions or health conditions should I mention to my pharmacist?',
        'What signs of a medication side effect or allergy require prompt care?',
      ];
    }
    if (/headache|migraine|tension|dizzy/.test(lower)) {
      return [
        'What should I track in a daily headache diary for my doctor?',
        'What lifestyle, hydration, or sleep habits help prevent recurring headaches?',
        'What headache warning signs require urgent medical evaluation?',
      ];
    }
    if (/stomach|nausea|vomit|diarrhea|reflux|gerd|abdominal/.test(lower)) {
      return [
        'What bland foods and hydration steps are gentlest on an irritated stomach?',
        'Which foods, drinks, or pain relievers should I avoid while recovering?',
        'When does stomach discomfort require an in-person abdominal exam?',
      ];
    }
    if (/throat|cough|fever|cold|flu|viral|sinus/.test(lower)) {
      return [
        'How can a doctor tell if a sore throat or fever is viral or bacterial?',
        'What soothing home hydration and rest measures help most right now?',
        'What breathing or fever signs mean I should be examined sooner?',
      ];
    }
    return [
      'Can you explain the possible causes in simpler words?',
      'What gentle self-care steps can I start at home today?',
      'What warning signs mean I should see a doctor sooner?',
    ];
  }, [cleanText]);

  return (
    <div className="space-y-4">
      {/* Top Consultation Note Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E7EDF5]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2458F5]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#10264D]">
            Dr. Fizza • Clinical Consultation Note
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {'speechSynthesis' in window && (
            <>
              <button
                type="button"
                onClick={togglePauseSpeech}
                className="px-2.5 py-1 rounded-lg bg-[#F7FAFF] hover:bg-[#EAF2FF] text-[#10264D] border border-[#E7EDF5] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Listen to Dr. Fizza read this note aloud"
              >
                {isSpeaking && !isPaused ? (
                  <>
                    <Pause className="w-3 h-3 text-[#2458F5]" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3 text-[#2458F5]" />
                    <span>{isPaused ? 'Resume Audio' : 'Listen Aloud'}</span>
                  </>
                )}
              </button>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeech}
                  className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#C83F49] border border-rose-200 transition-colors cursor-pointer"
                  title="Stop Audio"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}

          <button
            type="button"
            onClick={handleCopyNote}
            className="px-2.5 py-1 rounded-lg bg-[#F7FAFF] hover:bg-[#EAF2FF] text-[#10264D] border border-[#E7EDF5] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copiedNote ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#64748B]" />
                <span>Copy Note</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="space-y-3.5">
        {sections.map((section, sIdx) => {
          if (section.type === 'intro') {
            return (
              <div key={sIdx} className="space-y-2">
                {section.lines.map((line, lIdx) => (
                  <p
                    key={lIdx}
                    className="text-sm sm:text-[15px] text-[#17253B] leading-relaxed font-normal"
                  >
                    {line}
                  </p>
                ))}
              </div>
            );
          }

          if (section.type === 'diagnosis') {
            return (
              <div
                key={sIdx}
                className="rounded-xl bg-[#F7FAFF] border border-[#E7EDF5] p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center shrink-0">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#10264D] uppercase tracking-wider">
                      {section.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2458F5] bg-[#EAF2FF] px-2.5 py-0.5 rounded-md">
                    Possible Explanations • Not a Confirmed Diagnosis
                  </span>
                </div>

                <div className="space-y-2.5">
                  {section.lines.map((line, lIdx) => {
                    const numMatch = line.match(/^(\d+)\.\s*(.+)$/);
                    if (numMatch) {
                      const [, num, rest] = numMatch;
                      const parts = rest.split(/\s+—\s+|\s+-\s+|:\s+/);
                      const label = parts[0];
                      const body = parts.slice(1).join(' — ');
                      return (
                        <div
                          key={lIdx}
                          className="p-3 rounded-xl bg-white border border-[#E7EDF5] shadow-2xs flex items-start gap-3"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#10264D] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {num}
                          </span>
                          <div className="text-xs sm:text-sm leading-relaxed">
                            <span className="font-bold text-[#10264D]">{label}</span>
                            {body && <span className="text-[#17253B]"> — {body}</span>}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <p key={lIdx} className="text-xs sm:text-sm text-[#17253B] leading-relaxed">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (section.type === 'care') {
            return (
              <div
                key={sIdx}
                className="rounded-xl bg-[#EAF2FF]/55 border border-[#2458F5]/25 p-4 space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#2458F5] text-white flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#10264D] uppercase tracking-wider">
                    {section.title}
                  </h4>
                </div>
                <div className="space-y-2">
                  {section.lines.map((line, lIdx) => {
                    const cleanedLine = line.replace(/^(\d+\.|-)\s*/, '');
                    return (
                      <div
                        key={lIdx}
                        className="flex items-start gap-2.5 bg-white/90 p-2.5 rounded-lg border border-[#2458F5]/15 text-xs sm:text-sm text-[#17253B] leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#2458F5] shrink-0 mt-0.5" />
                        <span>{cleanedLine}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (section.type === 'questions') {
            return (
              <div
                key={sIdx}
                className="rounded-xl bg-white border border-[#E7EDF5] p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#10264D] text-white flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#10264D] uppercase tracking-wider">
                      {section.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#64748B]">Click to check off for your visit</span>
                </div>
                <div className="space-y-2">
                  {section.lines.map((line, lIdx) => {
                    const cleanedLine = line.replace(/^(\d+\.|-)\s*/, '');
                    const key = `${sIdx}-${lIdx}`;
                    const checked = !!checkedQuestions[key];
                    return (
                      <button
                        key={lIdx}
                        type="button"
                        onClick={() =>
                          setCheckedQuestions((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                        className={`w-full text-left p-2.5 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 transition-colors cursor-pointer ${
                          checked
                            ? 'bg-[#EAF2FF] border-[#2458F5]/40 text-[#10264D] line-through'
                            : 'bg-[#F7FAFF] border-[#E7EDF5] text-[#17253B] hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="mt-1 rounded text-[#2458F5] cursor-pointer"
                        />
                        <span className="leading-relaxed">{cleanedLine}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (section.type === 'warning') {
            return (
              <div
                key={sIdx}
                className="rounded-xl bg-amber-50/80 border border-amber-200 p-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-[#E7A23B] shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                    {section.title}
                  </h4>
                </div>
                <div className="space-y-1.5">
                  {section.lines.map((line, lIdx) => (
                    <p key={lIdx} className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div
              key={sIdx}
              className="rounded-xl bg-[#F7FAFF] border border-[#E7EDF5] p-4 space-y-2"
            >
              <h4 className="text-xs font-bold text-[#10264D] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2458F5]" />
                {section.title}
              </h4>
              {section.lines.map((line, lIdx) => (
                <p key={lIdx} className="text-xs sm:text-sm text-[#17253B] leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          );
        })}
      </div>

      {/* Interactive Follow-Up Chips */}
      {onSelectFollowUp && (
        <div className="pt-2 border-t border-[#E7EDF5]">
          <div className="text-[11px] font-semibold text-[#64748B] mb-2 flex items-center gap-1.5">
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#2458F5]" />
            <span>Ask Dr. Fizza a follow-up question:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {followUpPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSelectFollowUp(prompt)}
                className="text-left text-xs px-3 py-1.5 rounded-xl bg-[#F7FAFF] hover:bg-[#EAF2FF] text-[#10264D] hover:text-[#2458F5] border border-[#E7EDF5] hover:border-[#2458F5]/40 font-medium transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
