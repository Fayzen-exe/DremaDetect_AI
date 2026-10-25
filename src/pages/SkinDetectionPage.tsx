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
  ArrowRight,
  Scan,
  Shield,
  Zap,
} from 'lucide-react';
import { SkinFormData, SkinReport } from '../types/health';
import { analyzeSkin } from '../services/api';
import { ProfessionalMedicalReport } from '../components/ProfessionalMedicalReport';
import { DEMO_CASES } from '../data/sampleCases';
import { MedicalVideoShowcase, MedicalButton } from '../components/ui/MedicalUI';
import { skinAnalysisVideo } from '../assets/videos';
import { motion, AnimatePresence } from 'motion/react';

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

  useEffect(() => {
    if (initialImageData) {
      setPreviewUrl(initialImageData);
      setFormData((prev) => ({
        ...prev,
        imageBase64: initialImageData,
        notes: initialNotes || prev.notes,
        duration: initialDuration || prev.duration,
      }));
      if (typeof initialImageData === 'string' && !initialImageData.startsWith('data:')) {
        fetch(initialImageData)
          .then((r) => r.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const b64 = e.target?.result as string;
              if (b64) {
                setFormData((prev) => ({
                  ...prev,
                  imageBase64: b64,
                  mimeType: blob.type || 'image/jpeg',
                }));
              }
            };
            reader.readAsDataURL(blob);
          })
          .catch(() => {});
      }
    }
  }, [initialImageData, initialNotes, initialDuration]);

  const processFile = (file: File) => {
    setErrorMessage(null);
    setImageQualityNotice(null);

    const fileType = (file.type || '').toLowerCase();
    const fileName = (file.name || '').toLowerCase();
    const isImage = fileType.startsWith('image/') || /\.(jpe?g|png|webp|gif|jfif)$/i.test(fileName);
    if (!isImage) {
      setErrorMessage('Unsupported image format. Please upload a clear JPG, PNG, or WEBP photograph.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('The photograph exceeds 15MB. Please choose a smaller image.');
      return;
    }

    if (file.size < 25 * 1024) {
      setImageQualityNotice('Notice: This image is very small (< 25KB). Highly compressed images may reduce visual morphology accuracy.');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawBase64 = e.target?.result as string;
      if (!rawBase64) {
        setErrorMessage('Failed to read the selected file. Please select another photograph.');
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width < 300 || img.height < 300) {
          setImageQualityNotice('Notice: Image resolution is below 300x300px. For best dermatological evaluation, a high-resolution close-up is recommended.');
        }

        // If photo is huge (> 2400px), downscale to max 2000px to maintain crisp clarity without bloating memory
        const maxDim = 2000;
        if (img.width > maxDim || img.height > maxDim) {
          const scale = Math.min(maxDim / img.width, maxDim / img.height);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const optimized = canvas.toDataURL('image/jpeg', 0.92);
            setPreviewUrl(optimized);
            setFormData((prev) => ({
              ...prev,
              imageBase64: optimized,
              mimeType: 'image/jpeg',
            }));
            return;
          }
        }

        setPreviewUrl(rawBase64);
        setFormData((prev) => ({
          ...prev,
          imageBase64: rawBase64,
          mimeType: file.type || 'image/jpeg',
        }));
      };
      img.onerror = () => {
        setPreviewUrl(rawBase64);
        setFormData((prev) => ({
          ...prev,
          imageBase64: rawBase64,
          mimeType: file.type || 'image/jpeg',
        }));
      };
      img.src = rawBase64;
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
      mimeType: sampleCase.formData?.mimeType || 'image/jpeg',
      notes: sampleCase.formData?.notes || '',
      duration: sampleCase.formData?.duration || '2 weeks',
      symptoms: sampleCase.formData?.symptoms || [],
    }));
    setHasConsent(true);
    setErrorMessage(null);

    // Convert asset path to real base64 data URL
    if (typeof sampleCase.image === 'string' && !sampleCase.image.startsWith('data:')) {
      fetch(sampleCase.image)
        .then((r) => r.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const b64 = e.target?.result as string;
            if (b64) {
              setFormData((prev) => ({
                ...prev,
                imageBase64: b64,
                mimeType: blob.type || 'image/jpeg',
              }));
            }
          };
          reader.readAsDataURL(blob);
        })
        .catch((err) => console.warn('Could not convert sample to data URL in browser:', err));
    }
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

    let payloadBase64 = formData.imageBase64.trim();
    if (!payloadBase64.startsWith('data:') && (payloadBase64.startsWith('/') || payloadBase64.startsWith('http'))) {
      try {
        const resp = await fetch(payloadBase64);
        const blob = await resp.blob();
        payloadBase64 = await new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = (e) => resolve((e.target?.result as string) || payloadBase64);
          r.onerror = () => resolve(payloadBase64);
          r.readAsDataURL(blob);
        });
      } catch {
        // Fall back to server disk resolution
      }
    }

    try {
      const result = await analyzeSkin({
        ...formData,
        imageBase64: payloadBase64,
      });
      setReport(result);
      if (onSaveSkinReport) {
        onSaveSkinReport(result, previewUrl || payloadBase64, formData);
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
      {/* Premium Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative sunset-subpage-banner p-8 sm:p-12 text-white overflow-hidden shadow-xl"
      >
        <div className="absolute inset-0 bg-dot-grid-white opacity-20 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wide">
            <Camera className="w-3.5 h-3.5" />
            <span>Dermatology Observation & ABCDE Analysis</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display leading-[1.15]">
            Private AI Skin &amp; Lesion Analysis
          </h1>

          <p className="text-base text-white/90 max-w-2xl mx-auto leading-relaxed font-medium">
            Upload a clear photograph of a skin spot, mole, or rash. Our clinical vision engine reviews morphology, ABCDE criteria, and prepares thoughtful questions for your dermatologist.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Zero-Retention Architecture · Never Stored</span>
            </span>

            <button
              type="button"
              onClick={onOpenEmergencyModal}
              className="btn-pill bg-white text-rose-600 hover:bg-neutral-50 px-5 py-2 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Urgent Warning Signs</span>
            </button>
          </div>
        </div>

        {/* Video Showcase Section */}
        <div className="mt-8 max-w-4xl mx-auto">
          <MedicalVideoShowcase
            src={skinAnalysisVideo}
            badgeText="Dermatology Surface Observation"
            title="Careful Review of Borders, Color Consistency & Surface Texture"
            subtitle="Evaluates visible skin characteristics securely in real time to help you prepare for a dermatologist consultation."
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
            className="p-4 sm:p-5 rounded-2xl bg-red-50/90 border border-red-200 text-red-900 flex items-start gap-3 shadow-xs"
          >
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="font-semibold text-red-950">Clinical Notice: </strong>
              <span>{errorMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUALITY WARNING NOTICE */}
      <AnimatePresence>
        {imageQualityNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#EAF2FF] border border-[#2458F5]/30 text-[#10264D] flex items-start gap-3 shadow-xs"
          >
            <Info className="w-5 h-5 text-[#2458F5] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-semibold text-[#10264D]">Image Quality Advisory: </strong>
              <span>{imageQualityNotice}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW 1: UPLOAD & INTAKE WORKSTATION (when report is null) */}
      {!report && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Dropzone & Camera Guidance */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-[#E7EDF5] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#10264D] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#EAF2FF] text-[#2458F5] text-xs font-bold inline-flex items-center justify-center">1</span>
                    Upload Skin Photograph
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Supports JPG, PNG, WEBP (up to 10MB)
                  </p>
                </div>

                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
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
                  className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group overflow-hidden ${
                    isDragOver
                      ? 'border-[#2458F5] bg-[#EAF2FF]/50 scale-[1.01]'
                      : 'border-[#E7EDF5] hover:border-[#2458F5] bg-[#F7FAFF]/80 hover:bg-[#F7FAFF]'
                  }`}
                >
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-white border border-[#E7EDF5] text-[#2458F5] shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-200">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-[#10264D]">
                    Click to select photo or drag and drop here
                  </p>
                  <p className="text-xs text-[#64748B] mt-1.5 max-w-sm mx-auto">
                    Hold camera 10–15 cm away under bright natural daylight for optimal morphology assessment
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E7EDF5] text-[11px] font-medium text-[#64748B]">
                    <Shield className="w-3 h-3 text-[#2458F5]" />
                    <span>Confidential Real-Time Analysis</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-[#E7EDF5] bg-[#0c1e3d] max-h-88 flex items-center justify-center group">
                    <img
                      src={previewUrl}
                      alt="Uploaded skin spot preview"
                      className="max-h-88 w-auto object-contain rounded-xl"
                    />

                    {/* Animated Scanning overlay */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#2458F5] to-transparent shadow-[0_0_15px_#2458F5] animate-scan-line" />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#10264D]/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-white">
                      <span className="text-xs font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#2458F5]" />
                        Ready for Clinical Vision Analysis
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-white/80 hover:text-white font-medium underline cursor-pointer"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Benchmark Samples */}
              <div className="pt-2 border-t border-[#E7EDF5]">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-3">
                  Or Test with Verified Reference Cases:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {skinDemoCases.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleLoadSample(sample)}
                      className="p-2.5 rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] hover:bg-white hover:border-[#2458F5]/50 hover:shadow-sm text-left transition-all cursor-pointer flex items-center gap-2.5 group"
                    >
                      {sample.image && (
                        <img
                          src={sample.image}
                          alt={sample.title}
                          className="w-9 h-9 rounded-lg object-cover border border-[#E7EDF5] shrink-0 group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div className="truncate min-w-0">
                        <div className="text-xs font-bold text-[#10264D] truncate group-hover:text-[#2458F5] transition-colors">
                          {sample.badge}
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate">
                          {sample.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Camera Guidelines Card */}
            <div className="bg-[#F7FAFF] border border-[#E7EDF5] rounded-3xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-[#10264D] uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-[#2458F5]" />
                Clinical Photography Best Practices
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#17253B]">
                <div className="p-3 bg-white rounded-xl border border-[#E7EDF5]">
                  <strong className="text-[#2458F5] block mb-1 font-semibold">1. Natural Lighting:</strong>
                  Use diffused daylight. Avoid direct smartphone flash which washes out lesion erythema.
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E7EDF5]">
                  <strong className="text-[#2458F5] block mb-1 font-semibold">2. Macro Focus:</strong>
                  Tap the screen on the lesion center to lock focus. Hold steady approximately 10–15 cm away.
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E7EDF5]">
                  <strong className="text-[#2458F5] block mb-1 font-semibold">3. Normal Margin:</strong>
                  Include 1-2 cm of healthy adjacent skin around the lesion for contrast calibration.
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E7EDF5]">
                  <strong className="text-[#2458F5] block mb-1 font-semibold">4. Scale Reference:</strong>
                  For pigmented moles, placing a clean coin or ruler nearby assists diameter estimation.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contextual Clinical Intake Form */}
          <div className="lg:col-span-6 bg-white border border-[#E7EDF5] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
            <div className="border-b border-[#E7EDF5] pb-4">
              <h3 className="text-base font-bold text-[#10264D] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#EAF2FF] text-[#2458F5] text-xs font-bold inline-flex items-center justify-center">2</span>
                Patient Information & Clinical Context
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Helps tailor differential probabilities and export professional medical reports
              </p>
            </div>

            {/* Patient Demographics */}
            <div className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#E7EDF5] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#10264D] uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-[#2458F5]" />
                <span>Patient Demographics (For Clinical Report)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#10264D] mb-1">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    value={formData.patientName || ''}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. Sara Ahmed"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E7EDF5] bg-white text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#10264D] mb-1">
                    Age:
                  </label>
                  <input
                    type="text"
                    value={formData.patientAge || ''}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    placeholder="e.g. 28 years"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E7EDF5] bg-white text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#10264D] mb-1">
                    Gender:
                  </label>
                  <select
                    value={formData.patientGender || 'Female'}
                    onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E7EDF5] bg-white text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all cursor-pointer"
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
              <label className="block text-xs font-bold text-[#10264D] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2458F5]" />
                Anatomical Body Location:
              </label>
              <select
                value={formData.bodyLocation}
                onChange={(e) => setFormData({ ...formData, bodyLocation: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all cursor-pointer"
              >
                {BODY_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10264D] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2458F5]" />
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
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      formData.duration === dur.id
                        ? 'bg-[#EAF2FF] border-[#2458F5] text-[#2458F5] font-bold shadow-xs'
                        : 'bg-[#F7FAFF] border-[#E7EDF5] text-[#17253B] hover:bg-white'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10264D] mb-1.5">
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
                      className={`text-left p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#EAF2FF] border-[#2458F5] text-[#2458F5] font-bold shadow-xs'
                          : 'bg-[#F7FAFF] border-[#E7EDF5] text-[#17253B] hover:bg-white'
                      }`}
                    >
                      <span className="truncate">{sens}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#2458F5] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10264D] mb-1.5">
                Evolution / Changes Over Time (ABCDE Evolution Tracking):
              </label>
              <select
                value={formData.changesOverTime}
                onChange={(e) => setFormData({ ...formData, changesOverTime: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all cursor-pointer"
              >
                {EVOLUTION_PRESETS.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10264D] mb-1.5">
                Prior Topicals / Treatments Applied:
              </label>
              <input
                type="text"
                value={formData.priorTreatments}
                onChange={(e) => setFormData({ ...formData, priorTreatments: e.target.value })}
                placeholder="e.g. Ceramide moisturizer, OTC hydrocortisone 1%, tea tree oil, none"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10264D] mb-1.5">
                Additional Patient Observations (Optional):
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Spot bleeds when snagged on shirt collar; flares after using new detergent."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E7EDF5] bg-[#F7FAFF] text-[#17253B] focus:outline-none focus:border-[#2458F5] focus:ring-2 focus:ring-[#2458F5]/15 transition-all resize-none"
              />
            </div>

            {/* Mandatory User Consent Checkbox */}
            <div className="pt-2 border-t border-[#E7EDF5]">
              <label className="flex items-start gap-3 text-xs text-[#17253B] cursor-pointer p-3 rounded-xl bg-[#F7FAFF] border border-[#E7EDF5] hover:border-[#2458F5]/30 transition-colors">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#2458F5] focus:ring-[#2458F5] cursor-pointer accent-[#2458F5]"
                />
                <span className="leading-relaxed">
                  I confirm that I have permission to upload this photo. I understand that DermaDetect AI provides educational screening and <strong>DOES NOT diagnose skin cancer or replace in-person dermatological biopsy.</strong>
                </span>
              </label>
            </div>

            {/* Submit Action Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !formData.imageBase64 || !hasConsent}
                className={`w-full min-h-[52px] py-4 px-6 rounded-full font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                  isAnalyzing || !formData.imageBase64 || !hasConsent
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'btn-pill btn-pill-coral shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>Analyzing Lesion Morphology...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-white" />
                    <span>Start AI Skin Analysis</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#64748B]">
                <ShieldCheck className="w-4 h-4 text-[#2458F5]" />
                <span>Confidential Zero-Storage Privacy · Evaluated securely in real time</span>
              </div>
            </div>
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
