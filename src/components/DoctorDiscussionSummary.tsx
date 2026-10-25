import React, { useState } from 'react';
import {
  Printer,
  Check,
  Copy,
  Download,
  Calendar,
  AlertTriangle,
  HelpCircle,
  FileDown,
  User,
  Sparkles,
} from 'lucide-react';
import { SymptomReport, SkinReport } from '../types/health';
import { BRAND_LOGO_URL } from './Header';
import {
  downloadDoctorSummaryPdf,
  triggerIframeSafePrint,
} from '../utils/pdfReportGenerator';

interface DoctorSummaryProps {
  type: 'symptom' | 'skin';
  symptomReport?: SymptomReport | null;
  skinReport?: SkinReport | null;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportedDuration?: string;
  reportedSymptoms?: string[];
  reportedDescription?: string;
  onClose?: () => void;
}

export const DoctorDiscussionSummary: React.FC<DoctorSummaryProps> = ({
  type,
  symptomReport,
  skinReport,
  patientName = 'Not Specified',
  patientAge = 'Adult',
  patientGender = 'Not Specified',
  reportedDuration,
  reportedSymptoms = [],
  reportedDescription,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const buildSummaryText = () => {
    let summaryText = `DERMADETECT AI — PATIENT CLINICAL DISCUSSION SUMMARY\nDate: ${currentDate}\nPatient Name: ${patientName}\nAge: ${patientAge} | Gender: ${patientGender}\nDeveloped by: Fizza Amin and Muhammad Faizan Ud Din\n\n`;

    if (type === 'symptom' && symptomReport) {
      summaryText += `SYMPTOMS REPORTED:\n${reportedSymptoms.join(', ') || 'See notes'}\n`;
      summaryText += `Duration: ${reportedDuration || 'Unspecified'}\n`;
      summaryText += `Notes: ${reportedDescription || 'None'}\n\n`;
      summaryText += `PRELIMINARY AI EDUCATIONAL SUMMARY:\n${symptomReport.summary}\n\n`;
      summaryText += `POSSIBLE DIFFERENTIAL CONDITIONS TO DISCUSS:\n${symptomReport.possibleCauses
        .map((c) => `- ${c.name}: ${c.description}`)
        .join('\n')}\n\n`;
      summaryText += `KEY QUESTIONS FOR YOUR DOCTOR:\n`;
      summaryText += `1. Could my symptoms be caused by any of the differential conditions listed above?\n`;
      summaryText += `2. What specific physical tests, blood work, or cultures are recommended?\n`;
      summaryText += `3. Under what conditions or timeframes should I return if symptoms don't resolve?\n`;
    } else if (type === 'skin' && skinReport) {
      summaryText += `SKIN CONCERN REPORTED:\nDuration: ${reportedDuration || 'Unspecified'}\n`;
      summaryText += `Sensations: ${reportedSymptoms.join(', ') || 'None reported'}\n`;
      summaryText += `User notes: ${reportedDescription || 'None'}\n\n`;
      summaryText += `VISIBLE MORPHOLOGICAL OBSERVATIONS:\n`;
      summaryText += `- Pigmentation: ${skinReport.visibleFeatures.colorAndPigmentation}\n`;
      summaryText += `- Borders & Shape: ${skinReport.visibleFeatures.shapeAndBorders}\n`;
      summaryText += `- Surface & Texture: ${skinReport.visibleFeatures.textureAndSurface}\n\n`;
      summaryText += `POTENTIAL CONDITIONS TO DISCUSS:\n${skinReport.possibleConditions
        .map((c) => `- ${c.name}: ${c.description}`)
        .join('\n')}\n\n`;
      summaryText += `KEY QUESTIONS FOR YOUR DERMATOLOGIST:\n`;
      summaryText += `1. Does this lesion warrant in-person polarized dermoscopy or punch/shave biopsy?\n`;
      summaryText += `2. Are there warning features (ABCDE criteria) indicating dysplastic change?\n`;
      summaryText += `3. What non-irritating topical treatment or barrier protection is suitable?\n`;
    }

    return summaryText;
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadDoctorSummaryPdf({
        type,
        patientName,
        patientAge,
        patientGender,
        reportedDuration,
        reportedSymptoms,
        reportedDescription,
        symptomReport,
        skinReport,
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Doctor Visit Summary — ${patientName}</title>
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; color: #17253B; padding: 28px; line-height: 1.55; }
    h1 { color: #10264D; font-size: 20px; margin: 0 0 4px; }
    .meta { background: #F7FAFF; border: 1px solid #E7EDF5; border-radius: 10px; padding: 12px 16px; margin: 14px 0; font-size: 13px; }
    .sec { margin-top: 16px; }
    .sec h3 { color: #10264D; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E7EDF5; padding-bottom: 4px; }
    pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; }
  </style>
</head>
<body>
  <h1>DermaDetect AI — Doctor Discussion Summary Sheet</h1>
  <div class="meta">
    <strong>Patient Name:</strong> ${patientName} &nbsp;|&nbsp;
    <strong>Age:</strong> ${patientAge} &nbsp;|&nbsp;
    <strong>Gender:</strong> ${patientGender} &nbsp;|&nbsp;
    <strong>Date:</strong> ${currentDate}
  </div>
  <pre>${buildSummaryText()}</pre>
</body>
</html>`;
    triggerIframeSafePrint(htmlContent);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(buildSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportTxt = () => {
    const content = buildSummaryText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DermaDetect-Doctor-Visit-Summary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-[#E7EDF5] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] print:border-none print:shadow-none print:p-0">
      {/* Header with PDF, Print, Export and Copy CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E7EDF5] no-print print:hidden">
        <div className="flex items-center gap-3">
          <img
            src={BRAND_LOGO_URL}
            alt="DermaDetect AI Logo"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-2xl object-contain p-0.5 border border-[#E7EDF5] bg-white shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#10264D] font-display">
                Doctor Discussion Summary Sheet
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FA4B4B]/10 text-[#FA4B4B] border border-[#FA4B4B]/20 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-[#FA4B4B]" />
                <span>AI-Generated</span>
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Download as PDF, export text, or print to review with your physician.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="btn-pill btn-pill-coral !px-3.5 !py-2 !text-xs !shadow-2xs cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            {pdfSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>PDF Downloaded</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>{isGeneratingPdf ? 'Creating PDF...' : 'Download PDF (.pdf)'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportTxt}
            className="btn-pill btn-pill-glass !text-[#10264D] !border-[#2458F5]/30 !bg-[#EAF2FF] hover:!bg-[#dde8ff] !px-3.5 !py-2 !text-xs cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#2458F5]" />
            <span>Export (.txt)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="btn-pill btn-pill-glass !text-[#17253B] !border-[#E7EDF5] !bg-[#F7FAFF] hover:!bg-slate-100 !px-3.5 !py-2 !text-xs cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#2458F5]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#64748B]" />
            )}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-pill btn-pill-dark !px-3.5 !py-2 !text-xs cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Content */}
      <div className="pt-6 space-y-6">
        {/* Document Header & Patient Record */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E7EDF5] pb-4">
          <div className="flex items-center gap-3">
            <img
              src={BRAND_LOGO_URL}
              alt="DermaDetect AI Logo"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-lg object-contain p-0.5 border border-[#E7EDF5] shrink-0"
            />
            <div>
              <h2 className="text-lg font-bold text-[#10264D]">
                Patient Clinical Preparation Sheet
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Generated via DermaDetect AI · Preliminary Health Awareness
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] tabular-nums">
            <Calendar className="w-3.5 h-3.5 text-[#2458F5]" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Patient Demographics Bar */}
        <div className="bg-[#F7FAFF] p-4 rounded-xl border border-[#E7EDF5] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#2458F5] shrink-0" />
            <div>
              <span className="text-[#64748B] block">Patient Name</span>
              <strong className="text-[#10264D] text-sm">{patientName}</strong>
            </div>
          </div>
          <div>
            <span className="text-[#64748B] block">Age</span>
            <strong className="text-[#10264D] text-sm tabular-nums">{patientAge}</strong>
          </div>
          <div>
            <span className="text-[#64748B] block">Gender</span>
            <strong className="text-[#10264D] text-sm capitalize">{patientGender}</strong>
          </div>
        </div>

        {/* 1. Patient Reported History */}
        <div className="bg-[#F7FAFF] p-4 rounded-xl border border-[#E7EDF5] space-y-2">
          <h4 className="text-xs font-bold text-[#10264D] uppercase tracking-wider">
            01. Patient-Reported Chronology
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#64748B] font-medium">Type of Concern:</span>{' '}
              <span className="text-[#10264D] font-semibold">
                {type === 'symptom' ? 'Systemic Symptoms' : 'Cutaneous Skin Spot / Lesion'}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] font-medium">Reported Duration:</span>{' '}
              <span className="text-[#10264D] font-semibold tabular-nums">
                {reportedDuration || 'Not stated'}
              </span>
            </div>
          </div>
          {reportedSymptoms.length > 0 && (
            <div className="text-xs pt-1">
              <span className="text-[#64748B] font-medium">Noted Symptoms/Sensations:</span>{' '}
              <span className="text-[#17253B]">{reportedSymptoms.join(', ')}</span>
            </div>
          )}
          {reportedDescription && (
            <div className="text-xs pt-1">
              <span className="text-[#64748B] font-medium">Patient Notes:</span>{' '}
              <span className="text-[#17253B] italic">"{reportedDescription}"</span>
            </div>
          )}
        </div>

        {/* 2. Objective AI Observations & Educational Differentials */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#10264D] uppercase tracking-wider">
            02. Preliminary Differential Topics for Discussion
          </h4>

          {type === 'symptom' && symptomReport && (
            <div className="space-y-2 text-xs">
              <p className="text-[#17253B] leading-relaxed bg-[#EAF2FF]/60 p-3.5 rounded-xl border border-[#2458F5]/25">
                <span className="font-bold text-[#10264D]">Summary: </span>
                {symptomReport.summary}
              </p>
              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-[#10264D]">
                  Possible explanations to consider with physician:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#17253B] pl-1">
                  {symptomReport.possibleCauses.map((cause, idx) => (
                    <li key={idx}>
                      <span className="font-bold text-[#10264D]">{cause.name}:</span>{' '}
                      {cause.description} ({cause.likelihoodNote})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {type === 'skin' && skinReport && (
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3.5 bg-[#F7FAFF] rounded-xl border border-[#E7EDF5]">
                <div>
                  <span className="font-bold text-[#10264D]">Pigment & Color:</span>{' '}
                  <span className="text-[#17253B]">
                    {skinReport.visibleFeatures.colorAndPigmentation}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#10264D]">Border & Contour:</span>{' '}
                  <span className="text-[#17253B]">
                    {skinReport.visibleFeatures.shapeAndBorders}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#10264D]">Surface Texture:</span>{' '}
                  <span className="text-[#17253B]">
                    {skinReport.visibleFeatures.textureAndSurface}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#10264D]">Lesion Arrangement:</span>{' '}
                  <span className="text-[#17253B]">{skinReport.visibleFeatures.distribution}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-[#10264D]">
                  Differential categories to discuss with dermatologist:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#17253B] pl-1">
                  {skinReport.possibleConditions.map((cond, idx) => (
                    <li key={idx}>
                      <span className="font-bold text-[#10264D]">{cond.name}:</span>{' '}
                      {cond.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 3. Recommended Questions to Ask the Doctor */}
        <div className="border border-[#2458F5]/30 bg-[#EAF2FF]/50 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#10264D] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#2458F5]" />
            <span>03. Recommended Questions for Your Doctor</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-[#17253B] pl-1">
            {type === 'symptom' ? (
              <>
                <li>
                  Does my symptom presentation match an acute viral infection, or should bacterial or other causes be investigated?
                </li>
                <li>
                  Are there specific diagnostic swabs (e.g., rapid strep, influenza, COVID-19) or blood tests recommended today?
                </li>
                <li>
                  What signs should prompt me to seek urgent care rather than continuing home rest?
                </li>
                <li>
                  Are any of my current medications or supplements interacting with these symptoms?
                </li>
              </>
            ) : (
              <>
                <li>
                  Would you recommend examining this spot under a polarized dermatoscope?
                </li>
                <li>
                  Does this lesion warrant an excision, shave, or punch biopsy to test for atypical or dysplastic cells?
                </li>
                <li>
                  Should we photograph and measure this spot to monitor for changes over the next 3 to 6 months?
                </li>
                <li>
                  What protective skincare or topical regimen is safe while we assess this area?
                </li>
              </>
            )}
          </ul>
        </div>

        {/* 4. Warning Sign Guard */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
          <AlertTriangle className="w-4 h-4 text-[#C83F49] shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Urgent Warning Notice:</span> If you experience chest pain, severe shortness of breath, sudden facial droop, high fever with stiff neck, or bleeding from a dark spot, seek emergency medical services immediately.
          </p>
        </div>

        {/* Legal Disclaimer Note on Printout */}
        <p className="text-[11px] text-[#64748B] pt-2 border-t border-[#E7EDF5]">
          Note: This document was produced by DermaDetect AI (Developed by Fizza Amin and Muhammad Faizan Ud Din) for patient consultation preparation only. It does not constitute a medical diagnosis or laboratory finding.
        </p>
      </div>
    </div>
  );
};
