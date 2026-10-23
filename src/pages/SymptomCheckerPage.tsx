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
} from 'lucide-react';
import { SymptomFormData, SymptomReport } from '../types/health';
import { checkSymptoms } from '../services/api';
import { ProfessionalMedicalReport } from '../components/ProfessionalMedicalReport';
import { MedicalVideoShowcase } from '../components/ui/MedicalUI';
import { systemicTriageVideo } from '../assets/videos';
import { motion } from 'motion/react';

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
  // Wizard steps: 1: Complaints & Symptoms, 2: Onset & Severity, 3: Follow-up Questions, 4: Clinical History
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

  // Dynamic symptoms list
  const displayedSymptoms = useMemo(() => {
    let list: string[] = [];
    const cat = SYMPTOM_CATEGORIES.find((c) => c.name === selectedCategory);
    list = cat ? cat.symptoms : SYMPTOM_CATEGORIES[0].symptoms;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      // Search across all categories
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

  // Adaptive Follow-up Questions calculation
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

    // Default general clinical question if no specific cluster
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
      // Check emergency
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

  // Submission to Clinical Engine
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

  // Instant Emergency View
  if (pageState === 'emergency-instant') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 sm:p-10 shadow-lg text-slate-900">
          <div className="flex items-center gap-4 text-red-600 mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <ShieldAlert className="w-10 h-10 animate-pulse text-red-600" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-3 py-1 rounded-full">
                Triage Priority: Critical Emergency (Red)
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-red-900 mt-1">
                Immediate Emergency Medical Care Required
              </h1>
            </div>
          </div>

          <p className="text-base sm:text-lg text-red-800 font-medium leading-relaxed mb-6">
            Your reported symptoms indicate potentially life-threatening or rapidly evolving physiological distress (such as acute chest pain, acute respiratory difficulty, sudden numbness, or anaphylaxis).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-red-200 shadow-xs">
              <h3 className="font-bold text-red-900 flex items-center gap-2 mb-2">
                <PhoneCall className="w-5 h-5 text-red-600" /> Immediate Actions:
              </h3>
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                <li><strong>Call 911 (US/Canada), 112 (Europe/Global), or 999 (UK) immediately.</strong></li>
                <li>Stop all physical exertion; sit or recline in a supported, upright resting posture.</li>
                <li>Alert a family member, colleague, or neighbor in your vicinity right now.</li>
                <li>Keep doors unlocked so emergency paramedics can enter without delay.</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-red-200 shadow-xs">
              <h3 className="font-bold text-red-900 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> What NOT to Do:
              </h3>
              <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                <li>Do NOT drive yourself to the emergency department.</li>
                <li>Do NOT take oral sedatives, sleeping aids, or unknown medications.</li>
                <li>Do NOT wait for an online questionnaire or routine clinic hours.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-red-200">
            <button
              onClick={onOpenEmergencyModal}
              className="px-5 py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" /> View Complete Red Flag Emergency Checklist
            </button>
            <button
              onClick={handleStartNew}
              className="px-5 py-3 bg-white hover:bg-neutral-100 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
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
      {/* Guided Symptom Evaluation Header + Automatic Ambient Video */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 shadow-xs text-center space-y-7"
      >
        <div className="max-w-3xl mx-auto space-y-3 flex flex-col items-center text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#249A96] flex items-center justify-center gap-2">
            <Stethoscope className="w-4 h-4" />
            <span>Guided Symptom Assessment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#153B50] tracking-tight text-center">
            Let’s understand your symptoms together
          </h1>
          <p className="text-sm sm:text-base text-[#687986] max-w-2xl mx-auto leading-relaxed text-center">
            Walk through focused questions about what you are feeling, how long it has lasted, and relevant health background to prepare a clear summary for your physician.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenEmergencyModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#C83F49] bg-[#C83F49]/10 hover:bg-[#C83F49]/15 border border-[#C83F49]/30 rounded-xl transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>View Urgent Warning Signs</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <MedicalVideoShowcase
            src={systemicTriageVideo}
            badgeText="Step-by-Step Health Intake"
            title="Clear, Structured Symptom & Timeline Review"
            subtitle="Helps organize your symptoms, timeline, and important follow-up questions before your medical appointment."
          />
        </div>
      </motion.div>

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">Assessment Notice: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* STATE 1: WIZARD FORM */}
      {pageState === 'wizard' && (
        <div className="bg-white border border-[#E3EAF0] rounded-2xl shadow-xs overflow-hidden">
          {/* Wizard Step Progress Tracker */}
          <div className="bg-[#F7FAFC] border-b border-[#E3EAF0] px-6 py-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {[
                { step: 1, label: 'Main Complaint' },
                { step: 2, label: 'Onset & Severity' },
                { step: 3, label: 'Clinical Follow-ups' },
                { step: 4, label: 'Patient Background' },
              ].map((s, idx) => (
                <div key={s.step} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        currentStepIndex === s.step
                          ? 'bg-[#087F8C] text-white shadow-xs'
                          : currentStepIndex > s.step
                          ? 'bg-[#102A43] text-white'
                          : 'bg-white border border-[#E3EAF0] text-[#62748A]'
                      }`}
                    >
                      {currentStepIndex > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
                    </div>
                    <span
                      className={`hidden sm:inline text-xs font-semibold ${
                        currentStepIndex === s.step ? 'text-[#102A43]' : 'text-[#62748A]'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < 3 && <div className="w-8 sm:w-16 h-0.5 bg-[#E3EAF0] mx-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {/* STEP 1: Patient Details, Main Complaint & Symptoms Selection */}
            {currentStepIndex === 1 && (
              <div className="space-y-6">
                {/* Patient Identification Card for Report Header & PDF Export */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F7FAFC] border border-[#DCE6ED] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#153B50] uppercase tracking-wider">
                    <User className="w-4 h-4 text-[#249A96]" />
                    <span>Patient Information for Clinical Report & PDF Export</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#153B50] mb-1">
                        Patient Full Name:
                      </label>
                      <input
                        type="text"
                        value={formData.patientName || ''}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        placeholder="e.g. Ayesha Khan"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DCE6ED] bg-white text-[#253746] focus:outline-none focus:ring-2 focus:ring-[#249A96]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#153B50] mb-1">
                        Patient Age:
                      </label>
                      <input
                        type="text"
                        value={formData.patientAge || ''}
                        onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                        placeholder="e.g. 28 years"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DCE6ED] bg-white text-[#253746] focus:outline-none focus:ring-2 focus:ring-[#249A96]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#153B50] mb-1">
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
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DCE6ED] bg-white text-[#253746] focus:outline-none focus:ring-2 focus:ring-[#249A96]"
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
                  <label className="block text-sm font-bold text-[#102A43] mb-1.5">
                    1. What is your primary health complaint or reason for assessment?
                  </label>
                  <p className="text-xs text-[#62748A] mb-2.5">
                    State clearly what you are experiencing (e.g., "High fever with sudden throat pain", "Persistent dry cough", or "Aching headache with nausea").
                  </p>
                  <input
                    type="text"
                    value={formData.mainComplaint}
                    onChange={(e) => setFormData({ ...formData, mainComplaint: e.target.value })}
                    placeholder="e.g. Mild fever, dry cough, and headache for 2 days"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-[#E3EAF0] focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:border-transparent bg-[#F7FAFC] text-[#172B4D]"
                  />
                </div>

                {/* Symptom Selection Panel */}
                <div className="pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <label className="text-sm font-bold text-[#102A43]">
                      2. Select all symptoms matching your current condition:
                    </label>
                    {formData.symptoms.length > 0 && (
                      <span className="text-xs font-bold text-[#087F8C] bg-[#DDF5F1] px-2.5 py-1 rounded-full">
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
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCategory === cat.name && !searchQuery
                              ? 'bg-[#102A43] text-white'
                              : 'bg-[#F7FAFC] text-[#62748A] hover:bg-neutral-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    <div className="relative sm:w-60">
                      <Search className="w-3.5 h-3.5 text-[#62748A] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search symptoms..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E3EAF0] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
                      />
                    </div>
                  </div>

                  {/* Symptom Pills Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-2 bg-[#F7FAFC] rounded-xl border border-[#E3EAF0]">
                    {displayedSymptoms.map((sym) => {
                      const isSelected = formData.symptoms.includes(sym);
                      const isRedFlag = EMERGENCY_RED_FLAGS.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => toggleSymptom(sym)}
                          className={`text-left p-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-1.5 cursor-pointer border ${
                            isSelected
                              ? isRedFlag
                                ? 'bg-red-50 border-red-400 text-red-900 font-bold'
                                : 'bg-[#DDF5F1] border-[#087F8C] text-[#087F8C] font-bold shadow-xs'
                              : 'bg-white border-[#E3EAF0] text-[#172B4D] hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate">{sym}</span>
                          {isSelected ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
                          ) : isRedFlag ? (
                            <span className="text-[10px] text-red-500 font-bold">!</span>
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
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E3EAF0] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSymptom}
                      className="px-4 py-2 bg-[#102A43] hover:bg-[#1a3b5c] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Add Custom
                    </button>
                  </div>
                </div>

                {/* Selected Summary Pill Badge Bar */}
                {formData.symptoms.length > 0 && (
                  <div className="p-3 bg-neutral-50 rounded-xl border border-[#E3EAF0]">
                    <span className="text-[11px] font-bold text-[#62748A] uppercase tracking-wider block mb-2">
                      Active Selected Symptoms:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.symptoms.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-[#E3EAF0] text-[#102A43]"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => toggleSymptom(s)}
                            className="text-[#62748A] hover:text-red-500 ml-1 cursor-pointer font-bold"
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

            {/* STEP 2: Onset, Duration & Progression */}
            {currentStepIndex === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#102A43] mb-1.5">
                    1. How long have you experienced these symptoms?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
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
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          formData.duration === d.id
                            ? 'bg-[#DDF5F1] border-[#087F8C] shadow-xs'
                            : 'bg-[#F7FAFC] border-[#E3EAF0] hover:bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#102A43]">{d.label}</div>
                        <div className="text-[11px] text-[#62748A]">{d.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#102A43] mb-1.5">
                    2. Reported Discomfort Severity:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                        className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          formData.severity === sev.id
                            ? 'bg-[#DDF5F1] border-[#087F8C] shadow-xs'
                            : 'bg-[#F7FAFC] border-[#E3EAF0] hover:bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#102A43] mb-1">{sev.label}</div>
                        <div className="text-xs text-[#62748A] leading-relaxed">{sev.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#102A43] mb-1.5">
                    3. Symptom Progression Pattern:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'gradual', label: 'Gradually worsening', desc: 'Progressively intensifying' },
                      { id: 'sudden', label: 'Sudden rapid onset', desc: 'Began abruptly' },
                      { id: 'fluctuating', label: 'Fluctuating / Comes and goes', desc: 'Episodic pattern' },
                      { id: 'improving', label: 'Gradually improving', desc: 'Decreasing severity' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, progression: p.id })}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          formData.progression === p.id
                            ? 'bg-[#DDF5F1] border-[#087F8C] shadow-xs'
                            : 'bg-[#F7FAFC] border-[#E3EAF0] hover:bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#102A43]">{p.label}</div>
                        <div className="text-[11px] text-[#62748A]">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#102A43] mb-1.5">
                    4. Additional Notes or Specific Circumstances (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Cough worsens at night when lying flat; slight relief with warm honey tea."
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#E3EAF0] focus:outline-none focus:ring-1 focus:ring-[#087F8C] bg-[#F7FAFC]"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Adaptive Clinical Follow-ups */}
            {currentStepIndex === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#087F8C]" />
                    Adaptive Clinical Triage Inquiries
                  </h3>
                  <p className="text-xs text-[#62748A]">
                    These targeted questions adapt automatically to the symptoms you selected to differentiate common viral, allergic, and inflammatory causes.
                  </p>
                </div>

                <div className="space-y-5">
                  {followUpModules.map((mod, idx) => (
                    <div
                      key={mod.id}
                      className="p-4 rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#102A43] text-white text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
                          {mod.title}
                        </h4>
                      </div>
                      <p className="text-xs font-medium text-[#172B4D]">{mod.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {mod.options.map((opt) => {
                          const isSelected = formData.followUpAnswers?.[mod.id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setFollowUpAnswer(mod.id, opt)}
                              className={`text-left p-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#DDF5F1] border-[#087F8C] text-[#087F8C] font-bold shadow-xs'
                                  : 'bg-white border-[#E3EAF0] text-[#172B4D] hover:bg-neutral-50'
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

            {/* STEP 4: Patient Background, Pre-existing Conditions & Safety */}
            {currentStepIndex === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 p-3 bg-[#DDF5F1] text-[#087F8C] rounded-xl text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    Privacy Protected: No names or identity numbers are collected. This clinical context helps evaluate contraindications for medication safety.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                      Patient Full Name:
                    </label>
                    <input
                      type="text"
                      value={formData.patientName || ''}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                      Patient Age & Demographic Group:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.patientAge || ''}
                        onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                        placeholder="e.g. 28 years"
                        className="w-1/2 px-3 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
                      />
                      <select
                        value={formData.ageGroup}
                        onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as any })}
                        className="w-1/2 px-2 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
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
                    <label className="block text-xs font-bold text-[#102A43] mb-1.5">
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                    Relevant Pre-existing Conditions / Comorbidities (Select all that apply):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PREEXISTING_CONDITIONS.map((cond) => {
                      const isSelected = (formData.relevantConditions || []).includes(cond);
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => toggleCondition(cond)}
                          className={`text-left p-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#DDF5F1] border-[#087F8C] text-[#087F8C] font-bold'
                              : 'bg-[#F7FAFC] border-[#E3EAF0] text-[#172B4D] hover:bg-white'
                          }`}
                        >
                          <span>{cond}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#087F8C]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                      Known Drug Allergies (Critical for OTC safety):
                    </label>
                    <select
                      value={formData.knownAllergies}
                      onChange={(e) => setFormData({ ...formData, knownAllergies: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C] mb-2"
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
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E3EAF0] bg-white focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                      Current Medications or Supplements:
                    </label>
                    <input
                      type="text"
                      value={formData.currentMedications}
                      onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                      placeholder="e.g. Inhaler, blood pressure medication, multivitamins"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
                    />
                    <p className="text-[11px] text-[#62748A] mt-1">
                      Helps the clinical engine screen for medication interactions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Action Bar */}
            <div className="pt-6 border-t border-[#E3EAF0] flex flex-wrap items-center justify-between gap-4">
              {currentStepIndex > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="min-h-[48px] px-5 py-3 rounded-2xl border border-[#E3EAF0] text-sm font-semibold text-[#102A43] hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous Step
                </button>
              ) : (
                <div className="text-xs text-[#62748A]">
                  Tip: You can get insights right away or continue through optional steps.
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {currentStepIndex < 4 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="min-h-[48px] px-5 py-3 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    Next Question <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSubmitAssessment}
                  className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#E06D53] hover:bg-[#cc5a40] text-white text-sm font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <HeartPulse className="w-4 h-4 text-white" /> Let’s take a look together — Get insights
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: LOADING ANALYSIS */}
      {pageState === 'loading' && (
        <div className="bg-white border border-[#E3EAF0] rounded-3xl p-12 text-center shadow-xs animate-gentle-breathe">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E6F4F1] text-[#0F766E] flex items-center justify-center">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#102A43] mb-2">
            Analyzing carefully...
          </h2>
          <p className="text-base text-[#62748A] max-w-md mx-auto leading-relaxed">
            Taking a calm, thoughtful look at what you shared to prepare your possible causes, self-care tips, and doctor summary.
          </p>
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
