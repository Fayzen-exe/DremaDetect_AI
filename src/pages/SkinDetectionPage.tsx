import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Info,
  Trash2,
  Check,
  Sparkles,
  Clock,
  MapPin,
  User,
} from 'lucide-react';
import { SkinFormData, SkinReport } from '../types/health';
import { analyzeSkin } from '../services/api';
import { ProfessionalMedicalReport } from '../components/ProfessionalMedicalReport';
import { DEMO_CASES } from '../data/sampleCases';
import { MedicalVideoShowcase } from '../components/ui/MedicalUI';
import { skinAnalysisVideo } from '../assets/videos';
import { motion } from 'motion/react';

interface SkinDetectionPageProps {
  onOpenEmergencyModal: () => void;
  initialImageData?: string;
  initialNotes?: string;
  initialDuration?: string;
  onSaveSkinReport?: (report: SkinReport, imageUrl?: string, intake?: SkinFormData) => void;
}

const COMMON_SKIN_SENSATIONS = [
  'Itching / Pruritus',
  'Pain or Soreness',
  'Burning sensation',
  'Bleeding or Oozing',
  'Recent change in size/color',
  'Roughness / Crusting',
  'Scaling or Flaking',
  'No noticeable sensation',
];

const BODY_LOCATIONS = [
  'Face or Forehead',
  'Scalp',
  'Neck',
  'Chest or Trunk',
  'Back or Shoulders',
  'Arms or Hands',
  'Legs or Feet',
  'Flexural Crease (Elbow/Knee)',
  'Other / Unspecified',
];

const EVOLUTION_PRESETS = [
  'Stable / No recent changes noticed',
  'Gradually enlarging over past weeks',
  'Darkening or developing multiple shades',
  'Irregular border contour developing',
  'Brand new spot that appeared recently',
];

export const SkinDetectionPage: React.FC<SkinDetectionPageProps> = ({
  onOpenEmergencyModal,
  initialImageData,
  initialNotes = '',
  initialDuration = '',
  onSaveSkinReport,
}) => {
  const [formData, setFormData] = useState<SkinFormData>({
    patientName: '',
    patientAge: '28 years',
    patientGender: 'Female',
    imageBase64: initialImageData || '',
    mimeType: 'image/jpeg',
    notes: initialNotes,
    bodyLocation: 'Arms or Hands',
    duration: initialDuration || '1-4 weeks',
    symptoms: [],
    changesOverTime: 'Stable / No recent changes noticed',
    priorTreatments: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageData || null);
  const [hasConsent, setHasConsent] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<SkinReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageQualityNotice, setImageQualityNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If initialImageData is provided, set preview
  useEffect(() => {
    if (initialImageData) {
      setPreviewUrl(initialImageData);
      setFormData((prev) => ({
        ...prev,
        imageBase64: initialImageData,
        notes: initialNotes || prev.notes,
        duration: initialDuration || prev.duration,
      }));
    }
  }, [initialImageData, initialNotes, initialDuration]);

  // Handle file selection with quality screening
  const processFile = (file: File) => {
    setErrorMessage(null);
    setImageQualityNotice(null);

    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validMimes.includes(file.type)) {
      setErrorMessage('Unsupported image format. Please upload a clear JPG, PNG, or WEBP photograph.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('The photograph exceeds 10MB. Please choose a smaller image.');
      return;
    }

    if (file.size < 25 * 1024) {
      setImageQualityNotice('Warning: This image is very small (< 25KB). Highly compressed or low-resolution images may reduce visual morphology accuracy.');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);
      setFormData((prev) => ({
        ...prev,
        imageBase64: base64,
        mimeType: file.type || 'image/jpeg',
      }));

      // Image dimension quality validation
      const img = new Image();
      img.onload = () => {
        if (img.width < 300 || img.height < 300) {
          setImageQualityNotice('Notice: Image resolution is below 300x300px. For best dermatological evaluation, a high-resolution close-up is recommended.');
        }
      };
      img.src = base64;
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected file. Please select another photograph.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setImageQualityNotice(null);
    setFormData((prev) => ({ ...prev, imageBase64: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = (sampleCase: any) => {
    if (!sampleCase.image) return;
    setPreviewUrl(sampleCase.image);
    setFormData((prev) => ({
      ...prev,
      patientName: sampleCase.formData?.patientName || prev.patientName || 'Sara Ahmed',
      patientAge: sampleCase.formData?.patientAge || prev.patientAge || '28 years',
      patientGender: sampleCase.formData?.patientGender || prev.patientGender || 'Female',
      imageBase64: sampleCase.image,
      mimeType: 'image/jpeg',
      notes: sampleCase.formData.notes || '',
      duration: sampleCase.formData.duration || '2 weeks',
      symptoms: sampleCase.formData.symptoms || [],
    }));
    setHasConsent(true);
    setErrorMessage(null);
  };

  const toggleSensation = (sens: string) => {
    setFormData((prev) => {
      const exists = prev.symptoms.includes(sens);
      return {
        ...prev,
        symptoms: exists ? prev.symptoms.filter((s) => s !== sens) : [...prev.symptoms, sens],
      };
    });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.imageBase64) {
      setErrorMessage('Please upload a clear photograph of your skin concern first.');
      return;
    }

    if (!hasConsent) {
      setErrorMessage('Please confirm that you have permission to upload this photo and understand this is an educational screening, not a medical diagnosis.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeSkin(formData);
      setReport(result);
      if (onSaveSkinReport) {
        onSaveSkinReport(result, previewUrl || formData.imageBase64, formData);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Unable to analyze skin image. Please verify lighting and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartAnother = () => {
    setPreviewUrl(null);
    setReport(null);
    setErrorMessage(null);
    setImageQualityNotice(null);
    setFormData({
      patientName: '',
      patientAge: '28 years',
      patientGender: 'Female',
      imageBase64: '',
      mimeType: 'image/jpeg',
      notes: '',
      bodyLocation: 'Arms or Hands',
      duration: '1-4 weeks',
      symptoms: [],
      changesOverTime: 'Stable / No recent changes noticed',
      priorTreatments: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const skinDemoCases = DEMO_CASES.filter((c) => c.type === 'skin');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Dermatology Visual Header + Automatic Skin Analysis Video */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 shadow-xs text-center space-y-7"
      >
        <div className="max-w-3xl mx-auto space-y-3 flex flex-col items-center text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#249A96] flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" />
            <span>Dermatology Observation & ABCDE Review</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#153B50] tracking-tight text-center">
            Private Skin & Lesion Observation
          </h1>
          <p className="text-sm sm:text-base text-[#687986] max-w-2xl mx-auto leading-relaxed text-center">
            Upload a clear photograph of a skin spot, mole, or rash to review surface characteristics, ABCDE educational criteria, and helpful questions for a dermatologist.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#153B50] bg-[#E9F7F5] rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#249A96]" />
              <span>Your photo is never shared or stored</span>
            </span>
            <button
              type="button"
              onClick={onOpenEmergencyModal}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-[#C83F49] bg-[#C83F49]/10 hover:bg-[#C83F49]/15 border border-[#C83F49]/30 rounded-xl transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Urgent Warning Signs</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <MedicalVideoShowcase
            src={skinAnalysisVideo}
            badgeText="Dermatology Surface Observation"
            title="Careful Review of Borders, Color Consistency & Surface Texture"
            subtitle="Evaluates visible skin characteristics in temporary memory to help you prepare for a dermatologist visit."
          />
        </div>
      </motion.div>

      {/* ERROR NOTICE */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold">Clinical Notice: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* QUALITY WARNING NOTICE */}
      {imageQualityNotice && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Image Quality Advisory: </span>
            {imageQualityNotice}
          </div>
        </div>
      )}

      {/* VIEW 1: UPLOAD & INTAKE WORKSTATION (when report is null) */}
      {!report && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Dropzone & Camera Guidance */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-[#E3EAF0] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#102A43]">
                    1. Upload Skin Photograph
                  </h3>
                  <p className="text-xs text-[#62748A]">
                    Supports JPG, PNG, WEBP (up to 10MB)
                  </p>
                </div>

                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Image
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              {!previewUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-[#087F8C] bg-[#DDF5F1]/40'
                      : 'border-[#E3EAF0] hover:border-[#087F8C] bg-[#F7FAFC]'
                  }`}
                >
                  <div className="mx-auto w-12 h-12 rounded-xl bg-[#DDF5F1] text-[#087F8C] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-[#102A43]">
                    Click to select photo or drag and drop here
                  </p>
                  <p className="text-[11px] text-[#62748A] mt-1">
                    Hold camera 10–15 cm away under bright natural daylight
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-[#E3EAF0] bg-neutral-900 max-h-80 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Uploaded skin spot preview"
                      className="max-h-80 w-auto object-contain"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white font-mono">
                      Image Loaded • Ready for Gemini Vision Analysis
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Sample Benchmark Selector */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#62748A] uppercase tracking-wider block mb-2">
                  Or Test with Curated Competition Benchmark Cases:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {skinDemoCases.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleLoadSample(sample)}
                      className="p-2 rounded-lg border border-[#E3EAF0] bg-[#F7FAFC] hover:bg-white text-left transition-all cursor-pointer flex items-center gap-2"
                    >
                      {sample.image && (
                        <img
                          src={sample.image}
                          alt={sample.title}
                          className="w-8 h-8 rounded object-cover border border-[#E3EAF0] shrink-0"
                        />
                      )}
                      <div className="truncate">
                        <div className="text-[11px] font-bold text-[#102A43] truncate">
                          {sample.badge}
                        </div>
                        <div className="text-[10px] text-[#62748A] truncate">
                          {sample.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Camera Capture Guidelines Card */}
            <div className="bg-[#F7FAFC] border border-[#E3EAF0] rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#087F8C]" />
                Clinical Photography Best Practices
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#172B4D]">
                <div className="p-2.5 bg-white rounded-lg border border-[#E3EAF0]">
                  <strong className="text-[#087F8C] block mb-0.5">1. Natural Lighting:</strong>
                  Use diffused natural daylight. Avoid harsh direct smartphone flash which washes out erythema.
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-[#E3EAF0]">
                  <strong className="text-[#087F8C] block mb-0.5">2. Macro Focus:</strong>
                  Tap the screen on the lesion center to lock focus. Hold steady approximately 10–15 cm away.
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-[#E3EAF0]">
                  <strong className="text-[#087F8C] block mb-0.5">3. Normal Margin:</strong>
                  Include 1-2 cm of healthy adjacent skin around the lesion for contrast calibration.
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-[#E3EAF0]">
                  <strong className="text-[#087F8C] block mb-0.5">4. Scale Reference:</strong>
                  For pigmented moles, placing a clean coin or ruler nearby assists diameter estimation.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contextual Clinical Intake Form */}
          <div className="lg:col-span-6 bg-white border border-[#E3EAF0] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-[#102A43] border-b border-[#E3EAF0] pb-3">
              2. Patient Information & Clinical Context
            </h3>

            {/* Patient Identification Fields for Report & PDF Export */}
            <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#DCE6ED] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#153B50] uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-[#249A96]" />
                <span>Patient Details for Report & PDF</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#153B50] mb-1">
                    Patient Full Name:
                  </label>
                  <input
                    type="text"
                    value={formData.patientName || ''}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. Sara Ahmed"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE6ED] bg-white text-[#253746] focus:outline-none focus:ring-1 focus:ring-[#249A96]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#153B50] mb-1">
                    Age:
                  </label>
                  <input
                    type="text"
                    value={formData.patientAge || ''}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    placeholder="e.g. 28 years"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE6ED] bg-white text-[#253746] focus:outline-none focus:ring-1 focus:ring-[#249A96]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#153B50] mb-1">
                    Gender:
                  </label>
                  <select
                    value={formData.patientGender || 'Female'}
                    onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE6ED] bg-white text-[#253746] focus:outline-none focus:ring-1 focus:ring-[#249A96]"
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
              <label className="block text-xs font-bold text-[#102A43] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#087F8C]" />
                Anatomical Body Location:
              </label>
              <select
                value={formData.bodyLocation}
                onChange={(e) => setFormData({ ...formData, bodyLocation: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
              >
                {BODY_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#102A43] mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#087F8C]" />
                Duration of Lesion or Rash:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: '< 24 hours', label: '< 24 Hours' },
                  { id: '1-3 days', label: '1 to 3 Days' },
                  { id: '1-4 weeks', label: '1 to 4 Weeks' },
                  { id: '> 1 month', label: '> 1 Month' },
                ].map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: dur.id })}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      formData.duration === dur.id
                        ? 'bg-[#DDF5F1] border-[#087F8C] text-[#087F8C] font-bold'
                        : 'bg-[#F7FAFC] border-[#E3EAF0] text-[#172B4D]'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                Associated Sensations (Select all that apply):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_SKIN_SENSATIONS.map((sens) => {
                  const isSelected = formData.symptoms.includes(sens);
                  return (
                    <button
                      key={sens}
                      type="button"
                      onClick={() => toggleSensation(sens)}
                      className={`text-left p-2 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#DDF5F1] border-[#087F8C] text-[#087F8C] font-bold'
                          : 'bg-[#F7FAFC] border-[#E3EAF0] text-[#172B4D] hover:bg-white'
                      }`}
                    >
                      <span className="truncate">{sens}</span>
                      {isSelected && <Check className="w-3 h-3 text-[#087F8C] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                Evolution / Changes Over Time (ABCDE Evolution Tracking):
              </label>
              <select
                value={formData.changesOverTime}
                onChange={(e) => setFormData({ ...formData, changesOverTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
              >
                {EVOLUTION_PRESETS.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                Prior Topicals / Treatments Applied:
              </label>
              <input
                type="text"
                value={formData.priorTreatments}
                onChange={(e) => setFormData({ ...formData, priorTreatments: e.target.value })}
                placeholder="e.g. Ceramide moisturizer, OTC hydrocortisone 1%, tea tree oil, none"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                Additional Patient Observations (Optional):
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Spot bleeds when snagged on shirt collar; flares after using new detergent."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3EAF0] bg-[#F7FAFC] focus:outline-none focus:ring-1 focus:ring-[#087F8C]"
              />
            </div>

            {/* Mandatory User Consent Checkbox */}
            <div className="pt-2 border-t border-[#E3EAF0]">
              <label className="flex items-start gap-2.5 text-xs text-[#172B4D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#087F8C] focus:ring-0 cursor-pointer"
                />
                <span className="leading-relaxed">
                  I confirm that I have permission to upload this photo. I understand that DermaDetect AI provides educational screening and <strong>DOES NOT diagnose skin cancer or replace in-person dermatological biopsy.</strong>
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <div className="p-3 rounded-xl bg-[#E6F4F1] text-[#0F766E] text-xs font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>🔒 Your photo is never shared — analyzed privately in memory</span>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !formData.imageBase64 || !hasConsent}
              className={`w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                isAnalyzing || !formData.imageBase64 || !hasConsent
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#E06D53] hover:bg-[#cc5a40] text-white'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>Analyzing carefully...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-white" />
                  <span>Let’s take a look together</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: 12-SECTION PROFESSIONAL DERMATOLOGY REPORT */}
      {report && (
        <ProfessionalMedicalReport
          type="skin"
          skinReport={report}
          previewImageUrl={previewUrl}
          intakeContext={{
            patientName: formData.patientName,
            patientAge: formData.patientAge,
            patientGender: formData.patientGender,
            description: formData.notes,
            bodyLocation: formData.bodyLocation,
            duration: formData.duration,
            symptoms: formData.symptoms,
            changesOverTime: formData.changesOverTime,
            priorTreatments: formData.priorTreatments,
          }}
          onStartNew={handleStartAnother}
        />
      )}
    </div>
  );
};
