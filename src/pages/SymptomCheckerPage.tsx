import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Activity,
  Check,
  ShieldCheck,
  Search,
  Sparkles,
  HeartPulse,
  PhoneCall,
  User,
  Clock,
  Zap,
} from 'lucide-react';
import { SymptomFormData, SymptomReport } from '../types/health';
import { checkSymptoms } from '../services/api';
import { ProfessionalMedicalReport } from '../components/ProfessionalMedicalReport';
import { MedicalVideoShowcase } from '../components/ui/MedicalUI';
import { systemicTriageVideo } from '../assets/videos';
import { motion, AnimatePresence } from 'motion/react';

interface SymptomCheckerPageProps {
  onOpenEmergencyModal: () => void;
  onSaveSymptomReport?: (report: SymptomReport, intake: SymptomFormData) => void;
}

const SYMPTOM_CATEGORIES = [
  {
    name: 'Common / All',
    symptoms: [
      'Fever / Chills',
      'Persistent Cough',
      'Sore Throat',
      'Headache',
      'Fatigue / Exhaustion',
      'Nausea / Upset Stomach',
      'Body / Muscle Aches',
      'Runny / Stuffy Nose',
      'Shortness of Breath',
      'Chest Pain or Pressure',
      'Dizziness / Lightheadedness',
      'Skin Rash / Redness',
      'Abdominal Pain / Cramping',
      'Loss of Taste or Smell',
      'Joint Pain or Stiffness',
    ],
  },
  {
    name: 'Respiratory & ENT',
    symptoms: [
      'Persistent Cough',
      'Sore Throat',
      'Runny / Stuffy Nose',
      'Shortness of Breath',
      'Wheezing or Stridor',
      'Hoarseness / Voice Loss',
      'Earache or Fullness',
      'Loss of Taste or Smell',
      'Sinus Pressure / Facial Pain',
    ],
  },
  {
    name: 'Constitutional & General',
    symptoms: [
      'Fever / Chills',
      'Fatigue / Exhaustion',
      'Body / Muscle Aches',
      'Night Sweats',
      'Unexplained Weight Loss',
      'General Malaise',
    ],
  },
  {
    name: 'Head & Neurological',
    symptoms: [
      'Headache',
      'Dizziness / Lightheadedness',
      'Sensitivity to Light (Photophobia)',
      'Sensitivity to Sound',
      'Stiff Neck with Fever',
      'Brain Fog / Confusion',
      'Vision Changes / Blurring',
    ],
  },
  {
    name: 'Digestive & Abdominal',
    symptoms: [
      'Nausea / Upset Stomach',
      'Vomiting',
      'Abdominal Pain / Cramping',
      'Diarrhea',
      'Acid Reflux / Heartburn',
      'Bloating / Fullness',
      'Loss of Appetite',
    ],
  },
  {
    name: 'Skin & Musculoskeletal',
    symptoms: [
      'Skin Rash / Redness',
      'Itching / Pruritus',
      'Hives (Urticaria)',
      'Joint Pain or Stiffness',
      'Localized Muscle Tenderness',
      'Swelling in Hands or Feet',
    ],
  },
];

const EMERGENCY_RED_FLAGS = [
  'Chest Pain or Pressure',
  'Shortness of Breath',
  'Stiff Neck with Fever',
  'Vision Changes / Blurring',
];

const PREEXISTING_CONDITIONS = [
  'Asthma / Chronic Bronchitis',
  'Hypertension (High Blood Pressure)',
  'Type 1 or Type 2 Diabetes',
  'Cardiovascular / Heart Disease',
  'Gastrointestinal / Peptic Ulcer Disease',
  'Kidney Disease',
  'Immunosuppressed / Chemotherapy',
  'No chronic conditions reported',
];

const KNOWN_ALLERGIES_PRESETS = [
  'No known drug allergies',
  'Penicillin / Amoxicillin',
  'Aspirin / NSAIDs (Ibuprofen, Naproxen)',
  'Sulfa antibiotics',
  'Codeine / Opioids',
  'Food / Latex allergies',
];

export const SymptomCheckerPage: React.FC<SymptomCheckerPageProps> = ({
  onOpenEmergencyModal,
  onSaveSymptomReport,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState<SymptomFormData>({
    patientName: '',
    patientAge: '28 years',
    patientGender: 'Female',
    mainComplaint: '',
    symptoms: [],
    description: '',
    duration: '2-3 days',
    severity: 'moderate',
    progression: 'gradual',
    ageGroup: 'adult',
    biologicalSex: 'female',
    relevantConditions: [],
    currentMedications: '',
    knownAllergies: 'No known drug allergies',
    recentHistory: '',
    followUpAnswers: {},
    hasEmergencySymptoms: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Common / All');
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [pageState, setPageState] = useState<'wizard' | 'loading' | 'result' | 'emergency-instant'>('wizard');
  const [report, setReport] = useState<SymptomReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const displayedSymptoms = useMemo(() => {
    let list: string[] = [];
    const cat = SYMPTOM_CATEGORIES.find((c) => c.name === selectedCategory);
    list = cat ? cat.symptoms : SYMPTOM_CATEGORIES[0].symptoms;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const allUnique = Array.from(new Set(SYMPTOM_CATEGORIES.flatMap((c) => c.symptoms)));
      return allUnique.filter((s) => s.toLowerCase().includes(q));
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const toggleSymptom = (sym: string) => {
    setFormData((prev) => {
      const exists = prev.symptoms.includes(sym);
      const updated = exists ? prev.symptoms.filter((s) => s !== sym) : [...prev.symptoms, sym];
      const hasEmergency = updated.some((s) => EMERGENCY_RED_FLAGS.includes(s));
      return { ...prev, symptoms: updated, hasEmergencySymptoms: hasEmergency };
    });
  };

  const handleAddCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSymptomInput.trim()) return;
    const trimmed = customSymptomInput.trim();
    if (!formData.symptoms.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        symptoms: [...prev.symptoms, trimmed],
      }));
    }
    setCustomSymptomInput('');
  };

  const toggleCondition = (cond: string) => {
    setFormData((prev) => {
      const current = prev.relevantConditions || [];
      if (cond === 'No chronic conditions reported') {
        return { ...prev, relevantConditions: ['No chronic conditions reported'] };
      }
      const filtered = current.filter((c) => c !== 'No chronic conditions reported');
      const exists = filtered.includes(cond);
      const updated = exists ? filtered.filter((c) => c !== cond) : [...filtered, cond];
      return { ...prev, relevantConditions: updated };
    });
  };

  const setFollowUpAnswer = (questionKey: string, answer: string) => {
    setFormData((prev) => ({
      ...prev,
      followUpAnswers: {
        ...(prev.followUpAnswers || {}),
        [questionKey]: answer,
      },
    }));
  };

  const followUpModules = useMemo(() => {
    const modules: Array<{
      id: string;
      title: string;
      question: string;
      options: string[];
    }> = [];

    const hasFever = formData.symptoms.some((s) => /fever|chills/i.test(s));
    const hasCough = formData.symptoms.some((s) => /cough|sore throat|breath/i.test(s));
    const hasHeadache = formData.symptoms.some((s) => /headache/i.test(s));
    const hasGI = formData.symptoms.some((s) => /nausea|vomiting|abdominal|diarrhea/i.test(s));
    const hasSkin = formData.symptoms.some((s) => /rash|redness|itch|hives/i.test(s));

    if (hasFever) {
      modules.push({
        id: 'fever_temp',
        title: 'Fever Assessment',
        question: 'What is your measured or estimated body temperature, and how are your chills?',
        options: [
          'Mild / Low-grade (< 38.0°C / 100.4°F)',
          'Moderate fever (38.1°C – 39.0°C / 100.5°F – 102.2°F)',
          'High fever (> 39.1°C / 102.4°F)',
          'Chills without measured fever',
        ],
      });
      modules.push({
        id: 'fever_fluids',
        title: 'Hydration Tolerance',
        question: 'Are you currently able to keep oral fluids down?',
        options: [
          'Yes, drinking water/fluids normally',
          'Drinking small sips with slight difficulty',
          'Unable to retain liquids due to nausea',
        ],
      });
    }

    if (hasCough) {
      modules.push({
        id: 'cough_nature',
        title: 'Respiratory Characteristics',
        question: 'How would you describe your cough or throat irritation?',
        options: [
          'Dry, tickly, non-productive cough',
          'Productive with clear or white mucus',
          'Productive with yellow or greenish phlegm',
          'Barking cough with hoarseness',
        ],
      });
      modules.push({
        id: 'breathing_effort',
        title: 'Breathing Effort',
        question: 'How is your breathing at rest versus light walking?',
        options: [
          'Completely comfortable at rest and exertion',
          'Slight chest tightness with heavy activity only',
          'Noticeable breathlessness while talking or resting (Red Flag)',
        ],
      });
    }

    if (hasHeadache) {
      modules.push({
        id: 'headache_type',
        title: 'Headache Pattern',
        question: 'Where is the discomfort centered and what does it feel like?',
        options: [
          'Band-like dull pressure across forehead/temples (Tension type)',
          'Throbbing or pulsating on one side with light sensitivity (Migraine type)',
          'Behind the eyes or facial cheekbones with congestion (Sinus type)',
          'Back of the head radiating down the neck',
        ],
      });
    }

    if (hasGI) {
      modules.push({
        id: 'gi_trigger',
        title: 'Digestive Details',
        question: 'When did the stomach or digestive discomfort begin?',
        options: [
          'Shortly after a specific meal or beverage',
          'Gradually over the past 24-48 hours',
          'Waking up in the middle of the night',
          'Episodes recurring over several weeks',
        ],
      });
    }

    if (hasSkin) {
      modules.push({
        id: 'skin_nature',
        title: 'Skin Sensations',
        question: 'What is the primary sensation in the affected skin area?',
        options: [
          'Intense itching without pain',
          'Stinging or burning discomfort',
          'Tender or painful to the touch',
          'No significant discomfort / asymptomatic',
        ],
      });
    }

    if (modules.length === 0) {
      modules.push({
        id: 'general_onset',
        title: 'Contextual Onset',
        question: 'Did these symptoms begin after any recognizable event or exposure?',
        options: [
          'Exposure to someone who was sick recently',
          'Unusual physical exertion or intense stress',
          'Recent travel or climate change',
          'No specific trigger identified',
        ],
      });
    }

    return modules;
  }, [formData.symptoms]);

  const validateStep = (stepNumber: 1 | 2 | 3 | 4): boolean => {
    setErrorMessage(null);
    if (stepNumber === 1) {
      if (formData.symptoms.length === 0 && !formData.mainComplaint?.trim() && !formData.description.trim()) {
        setErrorMessage('Please enter your main complaint or select at least one symptom to proceed.');
        return false;
      }
      const textLower = `${formData.mainComplaint} ${formData.description}`.toLowerCase();
      const isEmergencyText =
        textLower.includes('chest pain') ||
        textLower.includes('cannot breathe') ||
        textLower.includes("can't breathe") ||
        textLower.includes('slurred speech') ||
        textLower.includes('passed out');

      if (formData.hasEmergencySymptoms || isEmergencyText) {
        setPageState('emergency-instant');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStepIndex)) {
      if (currentStepIndex < 4) {
        setCurrentStepIndex((prev) => (prev + 1) as any);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    if (currentStepIndex > 1) {
      setCurrentStepIndex((prev) => (prev - 1) as any);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSubmitAssessment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(1)) return;

    setPageState('loading');
    setErrorMessage(null);

    try {
      const result = await checkSymptoms(formData);
      setReport(result);
      if (onSaveSymptomReport) {
        onSaveSymptomReport(result, formData);
      }
      if (result.isEmergency) {
        setPageState('emergency-instant');
      } else {
        setPageState('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Unable to complete symptom assessment. Please try again.');
      setPageState('wizard');
    }
  };

  const handleStartNew = () => {
    setFormData({
      patientName: '',
      patientAge: '28 years',
      patientGender: 'Female',
      mainComplaint: '',
      symptoms: [],
      description: '',
      duration: '2-3 days',
      severity: 'moderate',
      progression: 'gradual',
      ageGroup: 'adult',
      biologicalSex: 'female',
      relevantConditions: [],
      currentMedications: '',
      knownAllergies: 'No known drug allergies',
      recentHistory: '',
      followUpAnswers: {},
      hasEmergencySymptoms: false,
    });
    setReport(null);
    setErrorMessage(null);
    setCurrentStepIndex(1);
    setPageState('wizard');
  };

  if (pageState === 'emergency-instant') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50/95 border-2 border-red-500 rounded-3xl p-8 sm:p-12 shadow-[0_12px_40px_rgba(239,68,68,0.15)] text-slate-900">
          <div className="flex items-center gap-4 text-red-600 mb-6">
            <div className="p-4 bg-red-100 rounded-2xl shrink-0">
              <ShieldAlert className="w-10 h-10 animate-pulse text-red-600" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-3 py-1 rounded-full">
                Triage Priority: Critical Emergency (Red)
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-red-950 mt-1 font-display">
                Immediate Emergency Medical Care Required
              </h1>
            </div>
          </div>

          <p className="text-base sm:text-lg text-red-900 font-medium leading-relaxed mb-6">
            Your reported symptoms indicate potentially life-threatening or rapidly evolving physiological distress (such as acute chest pain, acute respiratory difficulty, sudden numbness, or severe allergic reaction).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs">
              <h3 className="font-bold text-red-900 flex items-center gap-2 mb-3 text-base">
                <PhoneCall className="w-5 h-5 text-red-600" /> Immediate Actions:
              </h3>
              <ul className="text-sm text-slate-700 space-y-2.5 list-disc list-inside">
                <li><strong>Call 911 (US/Canada), 112 (Europe/Global), or 999 (UK) immediately.</strong></li>
                <li>Stop all physical exertion; sit or recline in a supported, upright resting posture.</li>
                <li>Alert a family member, colleague, or neighbor in your vicinity right now.</li>
                <li>Keep doors unlocked so emergency paramedics can enter without delay.</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs">
              <h3 className="font-bold text-red-900 flex items-center gap-2 mb-3 text-base">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> What NOT to Do:
              </h3>
              <ul className="text-sm text-slate-700 space-y-2.5 list-disc list-inside">
                <li>Do NOT drive yourself to the emergency department.</li>
                <li>Do NOT take oral sedatives, sleeping aids, or unknown medications.</li>
                <li>Do NOT wait for an online questionnaire or routine clinic hours.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-red-200">
            <button
              onClick={onOpenEmergencyModal}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <AlertTriangle className="w-4 h-4" /> View Complete Red Flag Emergency Checklist
            </button>
            <button
              onClick={handleStartNew}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Start New Routine Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Premium Guided Symptom Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white border border-[#E7EDF5] rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#2458F5]/10 via-[#EAF2FF]/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative max-w-3xl mx-auto space-y-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2FF] border border-[#2458F5]/20 text-[#2458F5] text-xs font-semibold tracking-wide">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Guided Clinical Symptom Triage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#10264D] tracking-tight font-display leading-[1.15]">
            Let’s Understand Your Symptoms Together
          </h1>

          <p className="text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Walk through focused questions about what you are feeling, how long it has lasted, and relevant health background to prepare a clear 12-section summary for your physician.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenEmergencyModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-full transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Urgent Warning Signs</span>
            </button>
          </div>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <MedicalVideoShowcase
            src={systemicTriageVideo}
            badgeText="Step-by-Step Health Intake"
            title="Clear, Structured Symptom & Timeline Review"
            subtitle="Helps organize your symptoms, timeline, and important follow-up questions before your medical appointment."
          />
        </div>
      </motion.div>

      {/* ERROR NOTICE */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="font-semibold text-amber-950">Assessment Notice: </strong>
              <span>{errorMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATE 1: WIZARD FORM */}
      {pageState === 'wizard' && (
        <div className="bg-white border border-[#E7EDF5] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          {/* Wizard Step Progress Tracker */}
          <div className="bg-[#F7FAFF] border-b border-[#E7EDF5] px-6 py-5">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {[
                { step: 1, label: 'Main Complaint' },
                { step: 2, label: 'Onset & Severity' },
                { step: 3, label: 'Clinical Follow-ups' },
                { step: 4, label: 'Patient Background' },
              ].map((s, idx) => (
                <div key={s.step} className="flex items-center">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        currentStepIndex === s.step
                          ? 'bg-[#2458F5] text-white shadow-[0_4px_12px_rgba(36,88,245,0.35)] scale-105'
                          : currentStepIndex > s.step
                          ? 'bg-[#10264D] text-white'
                          : 'bg-white border border-[#E7EDF5] text-[#94A3B8]'
                      }`}
                    >
                      {currentStepIndex > s.step ? <Check className="w-4 h-4" /> : s.step}
                    </div>
                    <span
                      className={`hidden sm:inline text-xs font-bold ${
                        currentStepIndex === s.step ? 'text-[#10264D]' : 'text-[#64748B]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < 3 && <div className="w-8 sm:w-16 h-0.5 bg-[#E7EDF5] mx-3" />}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-10">
            {/* STEP 1 */}
            {currentStepIndex === 1 && (
              <div className="space-y-7">
                {/* Patient Information Card */}
                <div className="p-5 rounded-2xl bg-[#F7FAFF] border border-[#E7EDF5] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#10264D] uppercase tracking-wider">
                    <User className="w-4 h-4 text-[#2458F5]" />
                    <span>Patient Information for Clinical Report & PDF Export</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#10264D] mb-1">
                        Patient Full Name:
                      </label>
                      <input
                        type="text"
                        value={formData.patientName || ''}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        placeholder="e.g. Ayesha Khan"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E7EDF5] bg-white text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#10264D] mb-1">
                        Patient Age:
                      </label>
                      <input
                        type="text"
                        value={formData.patientAge || ''}
                        onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                        placeholder="e.g. 28 years"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E7EDF5] bg-white text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#10264D] mb-1">
                        Gender:
                      </label>
                      <select
                        value={formData.patientGender || 'Female'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            patientGender: e.target.value,
                            biologicalSex: e.target.value.toLowerCase(),
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E7EDF5] bg-white text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all cursor-pointer"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#10264D] mb-1">
                    1. What is your primary health complaint or reason for assessment?
                  </label>
                  <p className="text-xs text-[#64748B] mb-2.5">
                    State clearly what you are experiencing (e.g. "High fever with sudden throat pain", "Persistent dry cough", or "Aching headache with nausea").
                  </p>
                  <input
                    type="text"
                    value={formData.mainComplaint}
                    onChange={(e) => setFormData({ ...formData, mainComplaint: e.target.value })}
                    placeholder="e.g. Mild fever, dry cough, and headache for 2 days"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-[#E7EDF5] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 bg-[#F7FAFF] text-[#17253B] transition-all"
                  />
                </div>

                {/* Symptom Selection Panel */}
                <div className="pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <label className="text-sm font-bold text-[#10264D]">
                      2. Select all symptoms matching your current condition:
                    </label>
                    {formData.symptoms.length > 0 && (
                      <span className="text-xs font-bold text-[#2458F5] bg-[#EAF2FF] border border-[#2458F5]/20 px-3 py-1 rounded-full">
                        {formData.symptoms.length} Selected
                      </span>
                    )}
                  </div>

                  {/* Category Pills & Search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {SYMPTOM_CATEGORIES.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            setSearchQuery('');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            selectedCategory === cat.name && !searchQuery
                              ? 'bg-[#10264D] text-white shadow-xs'
                              : 'bg-[#F7FAFF] border border-[#E7EDF5] text-[#64748B] hover:text-[#10264D] hover:bg-white'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    <div className="relative sm:w-64">
                      <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search symptoms..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] focus:bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Symptom Pills Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-3 bg-[#F7FAFF] rounded-2xl border border-[#E7EDF5]">
                    {displayedSymptoms.map((sym) => {
                      const isSelected = formData.symptoms.includes(sym);
                      const isRedFlag = EMERGENCY_RED_FLAGS.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => toggleSymptom(sym)}
                          className={`text-left p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                            isSelected
                              ? isRedFlag
                                ? 'bg-red-50 border-red-400 text-red-950 font-bold shadow-xs'
                                : 'bg-[#EAF2FF] border-[#2458F5] text-[#2458F5] font-bold shadow-xs'
                              : 'bg-white border-[#E7EDF5] text-[#17253B] hover:border-[#2458F5]/40 hover:shadow-xs'
                          }`}
                        >
                          <span className="truncate">{sym}</span>
                          {isSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-[#2458F5] shrink-0" />
                          ) : isRedFlag ? (
                            <span className="text-[10px] text-red-500 font-bold bg-red-100 px-1.5 py-0.5 rounded">!</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Symptom Form */}
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={customSymptomInput}
                      onChange={(e) => setCustomSymptomInput(e.target.value)}
                      placeholder="Enter other specific symptom (e.g. sharp left knee pain)"
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] focus:bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSymptom}
                      className="px-4 py-2 bg-[#10264D] hover:bg-[#1a3fcc] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Add Custom
                    </button>
                  </div>
                </div>

                {/* Selected Summary Pill Badge Bar */}
                {formData.symptoms.length > 0 && (
                  <div className="p-4 bg-[#F7FAFF] rounded-2xl border border-[#E7EDF5]">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2.5">
                      Active Selected Symptoms:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {formData.symptoms.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white border border-[#E7EDF5] text-[#10264D] shadow-2xs"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => toggleSymptom(s)}
                            className="text-[#94A3B8] hover:text-red-500 ml-1 cursor-pointer font-bold text-sm"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {currentStepIndex === 2 && (
              <div className="space-y-7">
                <div>
                  <label className="block text-sm font-bold text-[#10264D] mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2458F5]" />
                    1. How long have you experienced these symptoms?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { id: '< 24 hours', label: 'Less than 24h', desc: 'Acute onset' },
                      { id: '1-3 days', label: '1 to 3 days', desc: 'Recent' },
                      { id: '4-7 days', label: '4 to 7 days', desc: 'Ongoing' },
                      { id: '1-2 weeks', label: '1 to 2 weeks', desc: 'Subacute' },
                      { id: '> 2 weeks', label: 'Over 2 weeks', desc: 'Persistent' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: d.id })}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          formData.duration === d.id
                            ? 'bg-[#EAF2FF] border-[#2458F5] shadow-xs'
                            : 'bg-[#F7FAFF] border-[#E7EDF5] hover:bg-white'
                        }`}
                      >
                        <div className={`text-xs font-bold ${formData.duration === d.id ? 'text-[#2458F5]' : 'text-[#10264D]'}`}>
                          {d.label}
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">{d.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#10264D] mb-2">
                    2. Reported Discomfort Severity:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {[
                      {
                        id: 'mild',
                        label: 'Mild Discomfort',
                        desc: 'Noticeable symptoms, but able to work, study, and maintain normal daily routine.',
                      },
                      {
                        id: 'moderate',
                        label: 'Moderate Discomfort',
                        desc: 'Disrupts regular tasks, requires resting intervals, or demands comfort measures.',
                      },
                      {
                        id: 'severe',
                        label: 'Severe Discomfort',
                        desc: 'Inability to perform basic daily activities, bedridden, or marked distress.',
                      },
                    ].map((sev) => (
                      <button
                        key={sev.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, severity: sev.id as any })}
                        className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                          formData.severity === sev.id
                            ? 'bg-[#EAF2FF] border-[#2458F5] shadow-xs'
                            : 'bg-[#F7FAFF] border-[#E7EDF5] hover:bg-white'
                        }`}
                      >
                        <div className={`text-xs font-bold mb-1 ${formData.severity === sev.id ? 'text-[#2458F5]' : 'text-[#10264D]'}`}>
                          {sev.label}
                        </div>
                        <div className="text-xs text-[#64748B] leading-relaxed">{sev.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#10264D] mb-2">
                    3. Symptom Progression Pattern:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'gradual', label: 'Gradually worsening', desc: 'Progressively intensifying' },
                      { id: 'sudden', label: 'Sudden rapid onset', desc: 'Began abruptly' },
                      { id: 'fluctuating', label: 'Fluctuating / Episodic', desc: 'Comes and goes' },
                      { id: 'improving', label: 'Gradually improving', desc: 'Decreasing severity' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, progression: p.id })}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          formData.progression === p.id
                            ? 'bg-[#EAF2FF] border-[#2458F5] shadow-xs'
                            : 'bg-[#F7FAFF] border-[#E7EDF5] hover:bg-white'
                        }`}
                      >
                        <div className={`text-xs font-bold ${formData.progression === p.id ? 'text-[#2458F5]' : 'text-[#10264D]'}`}>
                          {p.label}
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#10264D] mb-1.5">
                    4. Additional Notes or Specific Circumstances (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Cough worsens at night when lying flat; slight relief with warm honey tea."
                    className="w-full px-4 py-3 text-xs rounded-2xl border border-[#E7EDF5] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 bg-[#F7FAFF] text-[#17253B] transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStepIndex === 3 && (
              <div className="space-y-7">
                <div>
                  <h3 className="text-base font-bold text-[#10264D] flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#2458F5]" />
                    Adaptive Clinical Triage Inquiries
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    These targeted questions adapt automatically to the symptoms you selected to differentiate common viral, allergic, and inflammatory causes.
                  </p>
                </div>

                <div className="space-y-5">
                  {followUpModules.map((mod, idx) => (
                    <div
                      key={mod.id}
                      className="p-5 rounded-2xl border border-[#E7EDF5] bg-[#F7FAFF] space-y-3.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#10264D] text-white text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-[#10264D] uppercase tracking-wider">
                          {mod.title}
                        </h4>
                      </div>
                      <p className="text-xs font-medium text-[#17253B]">{mod.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {mod.options.map((opt) => {
                          const isSelected = formData.followUpAnswers?.[mod.id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setFollowUpAnswer(mod.id, opt)}
                              className={`text-left p-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#EAF2FF] border-[#2458F5] text-[#2458F5] font-bold shadow-xs'
                                  : 'bg-white border-[#E7EDF5] text-[#17253B] hover:border-[#2458F5]/30'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStepIndex === 4 && (
              <div className="space-y-7">
                <div className="flex items-center gap-2.5 p-4 bg-[#EAF2FF] text-[#10264D] rounded-2xl text-xs font-medium border border-[#2458F5]/20">
                  <ShieldCheck className="w-4 h-4 text-[#2458F5] shrink-0" />
                  <span>
                    Privacy Protected: No names or identity numbers are stored. This clinical context helps evaluate contraindications for medication safety.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#10264D] mb-1.5">
                      Patient Full Name:
                    </label>
                    <input
                      type="text"
                      value={formData.patientName || ''}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] focus:bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10264D] mb-1.5">
                      Patient Age & Demographic Group:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.patientAge || ''}
                        onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                        placeholder="e.g. 28 years"
                        className="w-1/2 px-3.5 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] focus:bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                      />
                      <select
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as any })}
                        className="w-1/2 px-2 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] focus:bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all cursor-pointer"
                      >
                        <option value="infant">Infant (0–2y)</option>
                        <option value="child">Child (3–12y)</option>
                        <option value="adolescent">Teen (13–17y)</option>
                        <option value="adult">Adult (18–64y)</option>
                        <option value="senior">Senior (65+y)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10264D] mb-1.5">
                      Gender / Biological Sex:
                    </label>
                    <select
                      value={formData.patientGender || 'Female'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientGender: e.target.value,
                          biologicalSex: e.target.value.toLowerCase(),
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] focus:bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all cursor-pointer"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10264D] mb-2">
                    Relevant Pre-existing Conditions / Comorbidities (Select all that apply):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PREEXISTING_CONDITIONS.map((cond) => {
                      const isSelected = (formData.relevantConditions || []).includes(cond);
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => toggleCondition(cond)}
                          className={`text-left p-3 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#EAF2FF] border-[#2458F5] text-[#2458F5] font-bold shadow-xs'
                              : 'bg-[#F7FAFF] border-[#E7EDF5] text-[#17253B] hover:bg-white'
                          }`}
                        >
                          <span>{cond}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2458F5]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#10264D] mb-1.5">
                      Known Drug Allergies (Critical for OTC safety):
                    </label>
                    <select
                      value={formData.knownAllergies}
                      onChange={(e) => setFormData({ ...formData, knownAllergies: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] focus:bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all cursor-pointer mb-2"
                    >
                      {KNOWN_ALLERGIES_PRESETS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={formData.knownAllergies}
                      onChange={(e) => setFormData({ ...formData, knownAllergies: e.target.value })}
                      placeholder="Or specify custom drug allergy"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E7EDF5] bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10264D] mb-1.5">
                      Current Medications or Supplements:
                    </label>
                    <input
                      type="text"
                      value={formData.currentMedications}
                      onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                      placeholder="e.g. Inhaler, blood pressure medication, multivitamins"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] focus:bg-white focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                    />
                    <p className="text-[11px] text-[#64748B] mt-1.5">
                      Helps the clinical engine screen for medication interactions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Action Bar */}
            <div className="pt-8 mt-4 border-t border-[#E7EDF5] flex flex-wrap items-center justify-between gap-4">
              {currentStepIndex > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="min-h-[48px] px-5 py-3 rounded-2xl border border-[#E7EDF5] text-sm font-semibold text-[#10264D] hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous Step
                </button>
              ) : (
                <div className="text-xs text-[#64748B]">
                  Tip: You can get insights right away or complete all 4 steps for deeper analysis.
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {currentStepIndex < 4 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#10264D] hover:bg-[#0c1e3d] text-white text-sm font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Next Question <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSubmitAssessment}
                  className="min-h-[48px] px-7 py-3.5 rounded-2xl bg-[#2458F5] hover:bg-[#1a3fcc] text-white text-sm font-bold shadow-[0_4px_16px_rgba(36,88,245,0.3)] hover:shadow-[0_8px_28px_rgba(36,88,245,0.4)] transition-all flex items-center gap-2.5 cursor-pointer hover:-translate-y-0.5"
                >
                  <HeartPulse className="w-4 h-4 text-white" />
                  <span>Generate Clinical Report</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: LOADING ANALYSIS */}
      {pageState === 'loading' && (
        <div className="bg-white border border-[#E7EDF5] rounded-3xl p-12 sm:p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-[#2458F5]/10 animate-ping" />
            <div className="relative w-20 h-20 rounded-3xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center border border-[#2458F5]/20 shadow-sm">
              <Activity className="w-9 h-9 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#10264D] mb-2 font-display">
              Synthesizing Clinical Assessment...
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] max-w-md mx-auto leading-relaxed">
              Evaluating your symptoms, physiological timeline, and background against clinical reference guidelines to prepare your 12-section report.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7FAFF] border border-[#E7EDF5] text-xs font-semibold text-[#10264D]">
            <Sparkles className="w-3.5 h-3.5 text-[#2458F5]" />
            <span>Differential analysis in progress...</span>
          </div>
        </div>
      )}

      {/* STATE 3: 12-SECTION PROFESSIONAL MEDICAL REPORT */}
      {pageState === 'result' && report && (
        <ProfessionalMedicalReport
          type="symptom"
          symptomReport={report}
          intakeContext={formData}
          onStartNew={handleStartNew}
        />
      )}
    </div>
  );
};
