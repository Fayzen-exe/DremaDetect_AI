import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  Stethoscope,
  BookOpen,
  HelpCircle,
  Eye,
  HeartHandshake,
  HeartPulse,
  Pill,
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ShieldCheck,
  Printer,
  RotateCcw,
  Info,
  Compass,
  Copy,
  Check,
  X,
  FileText,
  UserCheck,
  Layers,
  Sparkles,
  PhoneCall,
  Download,
  FileCode,
  FileJson,
  FileDown,
  User,
  Edit3,
} from 'lucide-react';
import { SymptomReport, SkinReport, ReportIntakeContext } from '../types/health';
import {
  normalizeAndValidateSymptomReport,
  normalizeAndValidateSkinReport,
  MANDATORY_AI_DISCLOSURE,
  MANDATORY_MEDICATION_SAFEGUARD,
} from '../services/clinicalEngine';
import { DoctorDiscussionSummary } from './DoctorDiscussionSummary';
import { AIDoctorConsultation } from './AIDoctorConsultation';
import { BRAND_LOGO_URL } from './Header';
import {
  downloadClinicalReportPdf,
  triggerIframeSafePrint,
} from '../utils/pdfReportGenerator';

interface ProfessionalMedicalReportProps {
  type: 'symptom' | 'skin';
  symptomReport?: SymptomReport;
  skinReport?: SkinReport;
  previewImageUrl?: string | null;
  intakeContext?: ReportIntakeContext;
  onStartNew: () => void;
}

export const ProfessionalMedicalReport: React.FC<ProfessionalMedicalReportProps> = ({
  type,
  symptomReport,
  skinReport,
  previewImageUrl,
  intakeContext,
  onStartNew,
}) => {
  const [showHowGeneratedModal, setShowHowGeneratedModal] = useState(false);
  const [showSeekGuidanceModal, setShowSeekGuidanceModal] = useState(false);
  const [showDoctorVisitSummary, setShowDoctorVisitSummary] = useState(false);
  const [showDrFizza, setShowDrFizza] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  // Export status states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [exportSuccessBadge, setExportSuccessBadge] = useState<string | null>(null);

  // Editable Patient Demographics state (initialized from intakeContext or report)
  const initialPatientName =
    intakeContext?.patientName ||
    symptomReport?.patientName ||
    skinReport?.patientName ||
    '';
  const initialPatientAge =
    intakeContext?.patientAge ||
    symptomReport?.patientAge ||
    skinReport?.patientAge ||
    intakeContext?.ageGroup ||
    'Adult';
  const initialPatientGender =
    intakeContext?.patientGender ||
    symptomReport?.patientGender ||
    skinReport?.patientGender ||
    (intakeContext?.biologicalSex && intakeContext.biologicalSex !== 'prefer-not-to-say'
      ? intakeContext.biologicalSex
      : 'Not Specified');

  const [patientName, setPatientName] = useState<string>(initialPatientName);
  const [patientAge, setPatientAge] = useState<string>(initialPatientAge);
  const [patientGender, setPatientGender] = useState<string>(initialPatientGender);
  const [isEditingPatient, setIsEditingPatient] = useState<boolean>(false);

  useEffect(() => {
    setPatientName(
      intakeContext?.patientName ||
        symptomReport?.patientName ||
        skinReport?.patientName ||
        ''
    );
    setPatientAge(
      intakeContext?.patientAge ||
        symptomReport?.patientAge ||
        skinReport?.patientAge ||
        intakeContext?.ageGroup ||
        'Adult'
    );
    setPatientGender(
      intakeContext?.patientGender ||
        symptomReport?.patientGender ||
        skinReport?.patientGender ||
        (intakeContext?.biologicalSex && intakeContext.biologicalSex !== 'prefer-not-to-say'
          ? intakeContext.biologicalSex
          : 'Not Specified')
    );
  }, [intakeContext, symptomReport, skinReport]);

  const resolvedPatientName = patientName.trim() || 'Anonymous Patient';
  const resolvedPatientAge = patientAge.trim() || 'Adult';
  const resolvedPatientGender = patientGender.trim() || 'Not Specified';

  const triggerExportFeedback = (label: string) => {
    setExportSuccessBadge(label);
    setTimeout(() => setExportSuccessBadge(null), 3200);
  };

  // Always normalize so every report (live Gemini, fallback, or precomputed demo) has all 12 sections
  const normalizedSymptom = useMemo(() => {
    if (type !== 'symptom' || !symptomReport) return null;
    return normalizeAndValidateSymptomReport(symptomReport, {
      ...intakeContext,
      patientName: resolvedPatientName,
      patientAge: resolvedPatientAge,
      patientGender: resolvedPatientGender,
    });
  }, [type, symptomReport, intakeContext, resolvedPatientName, resolvedPatientAge, resolvedPatientGender]);

  const normalizedSkin = useMemo(() => {
    if (type !== 'skin' || !skinReport) return null;
    return normalizeAndValidateSkinReport(skinReport, {
      patientName: resolvedPatientName,
      patientAge: resolvedPatientAge,
      patientGender: resolvedPatientGender,
      notes: intakeContext?.description,
      bodyLocation: intakeContext?.bodyLocation,
      duration: intakeContext?.duration,
      symptoms: intakeContext?.symptoms,
      changesOverTime: intakeContext?.changesOverTime,
      priorTreatments: intakeContext?.priorTreatments,
    });
  }, [type, skinReport, intakeContext, resolvedPatientName, resolvedPatientAge, resolvedPatientGender]);

  const activeReport = type === 'symptom' ? normalizedSymptom : normalizedSkin;
  if (!activeReport) return null;

  const caseId = activeReport.caseId || (type === 'skin' ? 'HIS-84920-DERM' : 'HIS-74912-MED');
  const assessmentDate = new Date(activeReport.timestamp || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const triageLevel =
    activeReport.triageLevel ||
    (type === 'skin' && normalizedSkin?.isUrgentReviewNeeded
      ? 'prompt'
      : type === 'symptom' && normalizedSymptom?.isEmergency
      ? 'emergency'
      : 'routine');

  const summaryText =
    type === 'symptom'
      ? normalizedSymptom?.assessmentSummary || normalizedSymptom?.summary || ''
      : normalizedSkin?.assessmentSummary || '';

  const conditionDescriptions = activeReport.conditionDescriptions || [];
  const supportingInfo = activeReport.supportingInformation;
  const uncertaintyInfo = activeReport.uncertaintyAndAlternatives;
  const selfCare = activeReport.selfCareGuidance;
  const medicationInfo = activeReport.medicationInformation;
  const whatToAvoidList =
    activeReport.contraindicationsAndWarnings ||
    (type === 'skin'
      ? normalizedSkin?.thingsToAvoid
      : normalizedSymptom?.medicationSafetyGuidance?.whatToAvoid) ||
    [];
  const whenToSeeDoctorList =
    activeReport.professionalCareGuidance ||
    (type === 'skin' ? normalizedSkin?.whenToSeeDermatologist : normalizedSymptom?.whenToSeeDoctor) ||
    [];
  const emergencyWarningsList =
    activeReport.emergencyWarnings ||
    (type === 'skin' ? normalizedSkin?.urgentRedFlags : normalizedSymptom?.urgentWarningSigns) ||
    [];
  const followUpSteps =
    activeReport.followUpGuidance ||
    (type === 'symptom' ? normalizedSymptom?.nextSteps : []) ||
    [];
  const doctorQuestions = activeReport.suggestedDoctorQuestions || [];
  const aiDisclosureText = activeReport.aiDisclosure || MANDATORY_AI_DISCLOSURE;

  const buildPlainTextReport = () => {
    return `====================================================================
DERMADETECT AI — 12-SECTION CLINICAL HEALTH ASSESSMENT REPORT
====================================================================
Report ID: ${caseId}
Assessment Date: ${assessmentDate}
Patient Name: ${resolvedPatientName}
Patient Age: ${resolvedPatientAge}
Patient Gender: ${resolvedPatientGender}
Assessment Type: ${type === 'skin' ? 'Dermatological & Skin Analysis' : 'Symptom & Clinical Triage'}
Status: AI-Generated Assessment (Non-Diagnostic Clinical Decision Support)
Developers: Fizza Amin and Muhammad Faizan Ud Din
====================================================================

01. ASSESSMENT SUMMARY
${summaryText}

02. POSSIBLE CONDITION OR CONDITIONS (FOR PHYSICIAN DISCUSSION)
${conditionDescriptions
  .map(
    (c, i) =>
      `${i + 1}. ${c.name} [${c.likelihoodNote}]\n   Overview: ${c.whatItIs}\n   Recommended Timeline: ${c.urgencyLevel || 'Routine Outpatient'}`
  )
  .join('\n\n')}

03. WHAT IS THIS CONDITION & HOW CLINICIANS EVALUATE IT
${conditionDescriptions
  .map(
    (c) =>
      `- ${c.name}:\n  * How It Relates: ${c.howItRelatesToUser}\n  * Clinician Evaluation: ${c.howClinicianEvaluates}`
  )
  .join('\n\n')}

04. COMMON CAUSES AND RISK FACTORS
${conditionDescriptions
  .map((c) => `- ${c.name}: ${c.commonCausesAndRiskFactors.join('; ')}`)
  .join('\n')}

05. SYMPTOMS, OBSERVABLE FEATURES & CLINICAL UNCERTAINTY
User-Reported Information:
${(supportingInfo?.userReportedSummary || []).map((u) => `- ${u}`).join('\n')}
${
  type === 'skin' && supportingInfo?.visibleInImageSummary
    ? `\nFeatures Visible in Uploaded Image (2D Optics Only):\n${supportingInfo.visibleInImageSummary
        .map((v) => `- ${v}`)
        .join('\n')}`
    : ''
}
Uncertainty & Missing Clinical Information:
${(uncertaintyInfo?.missingClinicalInformation || []).map((m) => `- ${m}`).join('\n')}

06. RECOMMENDED RECOVERY AND SELF-CARE
${(selfCare?.supportiveMeasures || []).map((m) => `- ${m}`).join('\n')}
Recovery Note: ${selfCare?.recoveryExpectations || ''}

07. MEDICATION INFORMATION (EDUCATIONAL ONLY)
Safeguard: ${medicationInfo?.suitabilityBanner || MANDATORY_MEDICATION_SAFEGUARD}
${(medicationInfo?.options || [])
  .map(
    (o) =>
      `- ${o.categoryOrName} [${o.availabilityStatus}]\n  Purpose: ${o.generalPurpose}\n  Contraindications: ${o.contraindicationsAndInteractions.join('; ')}`
  )
  .join('\n\n')}

08. WHAT TO AVOID
${whatToAvoidList.map((w) => `- ${w}`).join('\n')}

09. WHEN TO SEE A DOCTOR
${whenToSeeDoctorList.map((d) => `- ${d}`).join('\n')}

10. EMERGENCY WARNING SIGNS
${emergencyWarningsList.map((e) => `! ${e}`).join('\n')}

11. FOLLOW-UP GUIDANCE & QUESTIONS FOR YOUR DOCTOR
Follow-Up Steps:
${followUpSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
Questions for Your Doctor:
${doctorQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

12. AI MEDICAL DISCLAIMER
${aiDisclosureText}
====================================================================`;
  };

  const buildStandaloneHtmlDocument = () => {
    const absoluteLogoUrl = new URL(BRAND_LOGO_URL, window.location.origin).href;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>DermaDetect AI Clinical Report — ${caseId}</title>
  <link rel="icon" href="${absoluteLogoUrl}" />
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #253746; background: #F7FAFC; margin: 0; padding: 28px; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; background: #FFFFFF; border: 1px solid #DCE6ED; border-radius: 20px; overflow: hidden; }
    .header { background: #153B50; color: #FFFFFF; padding: 26px 32px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand img { width: 50px; height: 50px; border-radius: 12px; object-fit: contain; padding: 2px; background: #FFFFFF; border: 2px solid rgba(255,255,255,0.25); }
    .brand h1 { margin: 0; font-size: 20px; font-weight: 800; }
    .brand p { margin: 4px 0 0; font-size: 12px; color: #E9F7F5; }
    .patient-bar { background: #F7FAFC; border-bottom: 1px solid #DCE6ED; padding: 16px 32px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; font-size: 13px; }
    .patient-bar div span { display: block; font-size: 11px; color: #687986; text-transform: uppercase; font-weight: 700; }
    .patient-bar div strong { color: #153B50; font-size: 14px; }
    .content { padding: 32px; }
    .sec { margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px solid #E3EDF2; }
    .sec h2 { color: #153B50; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px; }
    .card { background: #F7FAFC; border: 1px solid #DCE6ED; border-radius: 12px; padding: 14px 18px; margin-bottom: 10px; }
    .badge { display: inline-block; background: #E9F7F5; color: #153B50; font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 6px; margin-left: 6px; }
    .warn { background: #FFF8EB; border: 1px solid #F3D088; color: #5C3B09; border-radius: 12px; padding: 14px 18px; margin-bottom: 12px; font-weight: 600; font-size: 13px; }
    .emerg { background: #FFF1F2; border: 2px solid #C83F49; color: #7F1D1D; border-radius: 12px; padding: 16px; }
    .footer { background: #153B50; color: #E9F7F5; padding: 18px 32px; font-size: 12px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
    ul { margin: 6px 0; padding-left: 20px; }
    li { margin-bottom: 5px; font-size: 13.5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <img src="${absoluteLogoUrl}" alt="DermaDetect AI Logo" />
        <div>
          <h1>DermaDetect AI — Clinical Health Assessment Report</h1>
          <p>Report ID: ${caseId} • Date: ${assessmentDate} • AI-Generated Assessment (Non-Diagnostic)</p>
        </div>
      </div>
    </div>
    <div class="patient-bar">
      <div><span>Patient Name</span><strong>${resolvedPatientName}</strong></div>
      <div><span>Age</span><strong>${resolvedPatientAge}</strong></div>
      <div><span>Gender</span><strong>${resolvedPatientGender}</strong></div>
      <div><span>Assessment Type</span><strong>${type === 'skin' ? 'Skin Analysis' : 'Symptom Triage'}</strong></div>
    </div>
    <div class="content">
      <div class="sec">
        <h2>01. Assessment Summary</h2>
        <div class="card">${summaryText}</div>
      </div>
      <div class="sec">
        <h2>02. Possible Condition or Conditions (Not Confirmed Diagnoses)</h2>
        ${conditionDescriptions
          .map(
            (c, i) => `<div class="card">
          <strong>${i + 1}. ${c.name}</strong> <span class="badge">${c.likelihoodNote}</span>
          <p style="margin:8px 0 4px;font-size:13.5px;">${c.whatItIs}</p>
          <p style="margin:4px 0;font-size:12.5px;color:#687986;"><strong>How It Relates:</strong> ${c.howItRelatesToUser}</p>
          <p style="margin:4px 0;font-size:12.5px;color:#249A96;"><strong>How Clinicians Evaluate:</strong> ${c.howClinicianEvaluates}</p>
        </div>`
          )
          .join('')}
      </div>
      <div class="sec">
        <h2>04. Common Causes and Risk Factors</h2>
        <ul>
          ${conditionDescriptions
            .map((c) => `<li><strong>${c.name}:</strong> ${c.commonCausesAndRiskFactors.join('; ')}</li>`)
            .join('')}
        </ul>
      </div>
      <div class="sec">
        <h2>05. Symptoms, Observable Features & Clinical Uncertainty</h2>
        <div class="card">
          <strong>Information Reported by Patient:</strong>
          <ul>${(supportingInfo?.userReportedSummary || []).map((u) => `<li>${u}</li>`).join('')}</ul>
          ${
            type === 'skin' && supportingInfo?.visibleInImageSummary
              ? `<strong>Features Visible in Uploaded Image (2D Optics Only):</strong><ul>${supportingInfo.visibleInImageSummary
                  .map((v) => `<li>${v}</li>`)
                  .join('')}</ul>`
              : ''
          }
        </div>
      </div>
      <div class="sec">
        <h2>06. Recommended Recovery and Self-Care</h2>
        <ul>${(selfCare?.supportiveMeasures || []).map((m) => `<li>${m}</li>`).join('')}</ul>
      </div>
      <div class="sec">
        <h2>07. Medication Information (Educational Only)</h2>
        <div class="warn">${medicationInfo?.suitabilityBanner || MANDATORY_MEDICATION_SAFEGUARD}</div>
        ${(medicationInfo?.options || [])
          .map(
            (o) => `<div class="card">
          <strong>${o.categoryOrName}</strong> <span class="badge">${o.availabilityStatus}</span>
          <p style="margin:6px 0;font-size:13px;">${o.generalPurpose}</p>
          <p style="margin:4px 0;font-size:12px;color:#7F1D1D;"><strong>Who Should Avoid:</strong> ${o.contraindicationsAndInteractions.join('; ')}</p>
        </div>`
          )
          .join('')}
      </div>
      <div class="sec">
        <h2>08. What to Avoid</h2>
        <ul>${whatToAvoidList.map((w) => `<li>${w}</li>`).join('')}</ul>
      </div>
      <div class="sec">
        <h2>09. When to See a Doctor</h2>
        <ul>${whenToSeeDoctorList.map((d) => `<li>${d}</li>`).join('')}</ul>
      </div>
      <div class="sec">
        <h2>10. Emergency Warning Signs</h2>
        <div class="emerg">
          <ul>${emergencyWarningsList.map((e) => `<li>${e}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="sec">
        <h2>11. Follow-up Guidance & Questions for Your Doctor</h2>
        <ul>${doctorQuestions.map((q) => `<li>${q}</li>`).join('')}</ul>
      </div>
      <div class="sec" style="border-bottom:none;margin-bottom:0;">
        <h2>12. AI Medical Disclaimer</h2>
        <div class="card"><strong>${aiDisclosureText}</strong></div>
      </div>
    </div>
    <div class="footer">
      <span>© ${new Date().getFullYear()} DermaDetect AI • Educational Clinical Decision Support</span>
      <span>Developed by <strong>Fizza Amin</strong> and <strong>Muhammad Faizan Ud Din</strong></span>
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadClinicalReportPdf({
        type,
        caseId,
        assessmentDate,
        triageLevel:
          triageLevel === 'emergency' || triageLevel === 'prompt' ? triageLevel : 'routine',
        patientName: resolvedPatientName,
        patientAge: resolvedPatientAge,
        patientGender: resolvedPatientGender,
        summaryText,
        previewImageUrl,
        symptomReport: normalizedSymptom,
        skinReport: normalizedSkin,
      });
      triggerExportFeedback('PDF Report Downloaded (.pdf)');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    triggerIframeSafePrint(buildStandaloneHtmlDocument());
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(buildPlainTextReport());
    setCopiedReport(true);
    triggerExportFeedback('Report Copied to Clipboard');
    setTimeout(() => setCopiedReport(false), 3000);
  };

  const handleExportTxt = () => {
    const content = buildPlainTextReport();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DermaDetect-Report-${caseId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerExportFeedback('Text Report Downloaded (.txt)');
  };

  const handleExportJson = () => {
    const absoluteLogoUrl = new URL(BRAND_LOGO_URL, window.location.origin).href;
    const payload = {
      platform: 'DermaDetect AI',
      developers: ['Fizza Amin', 'Muhammad Faizan Ud Din'],
      logoUrl: absoluteLogoUrl,
      reportId: caseId,
      assessmentDate,
      reportType: type,
      patient: {
        name: resolvedPatientName,
        age: resolvedPatientAge,
        gender: resolvedPatientGender,
      },
      intakeContext,
      report: activeReport,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DermaDetect-Report-${caseId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerExportFeedback('Structured JSON Downloaded (.json)');
  };

  const handleExportHtml = () => {
    const htmlDocument = buildStandaloneHtmlDocument();
    const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DermaDetect-Clinical-Report-${caseId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerExportFeedback('HTML Report Downloaded (.html)');
  };

  return (
    <div className="space-y-6">
      {/* Main Report Container */}
      <div className="bg-white border border-[#DCE6ED] rounded-3xl shadow-xs overflow-hidden print:border-none print:shadow-none">
        {/* Print-Only Official Header with Logo & Patient Details */}
        <div className="hidden print:block border-b-2 border-[#153B50] pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={BRAND_LOGO_URL}
                alt="DermaDetect AI Logo"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-contain p-0.5 border border-[#DCE6ED]"
              />
              <div>
                <h1 className="text-xl font-bold text-[#153B50]">
                  DermaDetect AI — Educational Health Assessment Report
                </h1>
                <p className="text-xs text-[#687986] tabular-nums">
                  Report ID: {caseId} · Date: {assessmentDate} · Patient: {resolvedPatientName} ({resolvedPatientAge}, {resolvedPatientGender})
                </p>
                <p className="text-[11px] text-[#153B50] font-semibold">
                  Developed by Fizza Amin and Muhammad Faizan Ud Din
                </p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-[#253746] bg-[#F7FAFC] p-2 rounded border border-[#DCE6ED]">
            <strong>AI Medical Disclaimer:</strong> {aiDisclosureText}
          </p>
        </div>

        {/* Screen Institutional Report Header with Official Logo & AI-Generated Badge */}
        <div className="bg-[#153B50] text-white p-6 sm:p-8 border-b border-white/10 print:hidden">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src={BRAND_LOGO_URL}
                alt="DermaDetect AI Logo"
                referrerPolicy="no-referrer"
                className="w-13 h-13 rounded-2xl object-contain p-0.5 border-2 border-white/25 bg-white shadow-xs shrink-0 mt-0.5"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#E9F7F5] mb-2">
                  {/* Professional AI-Generated Assessment Badge */}
                  <span className="inline-flex items-center gap-1.5 bg-[#249A96]/30 text-[#E9F7F5] px-2.5 py-1 rounded-lg border border-[#249A96]/60 font-bold tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-[#E9F7F5]" />
                    <span>AI-Generated Assessment</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">ID: {caseId}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Date: {assessmentDate}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
                  {type === 'skin'
                    ? 'Structured Dermatological & Skin Health Report'
                    : 'Structured Symptom & Clinical Health Report'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Organized into 12 patient-friendly clinical sections to help you understand possibilities and prepare for a doctor visit.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap ${
                  triageLevel === 'emergency'
                    ? 'bg-[#C83F49] text-white'
                    : triageLevel === 'prompt'
                    ? 'bg-[#E7A23B] text-slate-950'
                    : 'bg-[#249A96] text-white'
                }`}
              >
                {triageLevel === 'emergency' ? (
                  <ShieldAlert className="w-3.5 h-3.5" />
                ) : triageLevel === 'prompt' ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>
                  {triageLevel === 'emergency'
                    ? 'Immediate Emergency Care'
                    : triageLevel === 'prompt'
                    ? 'Prompt Clinical Review Advised'
                    : 'Routine Outpatient Guidance'}
                </span>
              </span>

              <button
                type="button"
                onClick={() => setShowHowGeneratedModal(true)}
                className="text-xs text-[#E9F7F5] hover:text-white underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-[#249A96]" />
                <span>How was this report generated?</span>
              </button>
            </div>
          </div>

          {/* Primary Action & Multi-Format Export Toolbar */}
          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2.5 bg-[#249A96] hover:bg-[#1d807c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                title="Download formatted multi-page PDF clinical report"
              >
                <FileDown className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Export PDF (.pdf)'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2.5 bg-white text-[#153B50] hover:bg-[#E9F7F5] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <Printer className="w-3.5 h-3.5 text-[#249A96]" />
                <span>Print Report</span>
              </button>

              <button
                type="button"
                onClick={handleExportHtml}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                title="Download standalone formatted HTML report with official logo"
              >
                <FileCode className="w-3.5 h-3.5 text-[#E9F7F5]" />
                <span>Export (.html)</span>
              </button>

              <button
                type="button"
                onClick={handleExportTxt}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                title="Download plain-text clinical report (.txt)"
              >
                <Download className="w-3.5 h-3.5 text-[#E9F7F5]" />
                <span>Export (.txt)</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                title="Export structured report JSON"
              >
                <FileJson className="w-3.5 h-3.5 text-[#E9F7F5]" />
                <span>Export (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyReport}
                className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                {copiedReport ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSeekGuidanceModal(true)}
                className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 text-[#E9F7F5]" />
                <span>Care Settings</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onStartNew}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Assessment</span>
            </button>
          </div>

          {/* Export Confirmation Toast Banner */}
          {exportSuccessBadge && (
            <div className="mt-3 px-3.5 py-2 rounded-xl bg-[#249A96] text-white text-xs font-semibold inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{exportSuccessBadge}</span>
            </div>
          )}
        </div>

        {/* PATIENT DEMOGRAPHICS & CLINICAL RECORD BAR */}
        <div className="bg-[#F7FAFC] border-b border-[#DCE6ED] px-6 sm:px-8 py-4 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#687986] uppercase tracking-wider block">
                    Patient Name
                  </span>
                  <strong className="text-xs sm:text-sm font-bold text-[#153B50]">
                    {resolvedPatientName}
                  </strong>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#687986] uppercase tracking-wider block">
                  Patient Age
                </span>
                <strong className="text-xs sm:text-sm font-bold text-[#153B50] tabular-nums">
                  {resolvedPatientAge}
                </strong>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#687986] uppercase tracking-wider block">
                  Gender
                </span>
                <strong className="text-xs sm:text-sm font-bold text-[#153B50] capitalize">
                  {resolvedPatientGender}
                </strong>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#687986] uppercase tracking-wider block">
                  Assessment Modality
                </span>
                <strong className="text-xs sm:text-sm font-bold text-[#249A96]">
                  {type === 'skin' ? 'Dermatology Vision Review' : 'Clinical Symptom Triage'}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingPatient(!isEditingPatient)}
              className="px-3 py-1.5 rounded-lg border border-[#DCE6ED] bg-white hover:border-[#249A96] text-xs font-semibold text-[#153B50] inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#249A96]" />
              <span>{isEditingPatient ? 'Save Patient Info' : 'Edit Patient Details'}</span>
            </button>
          </div>

          {isEditingPatient && (
            <div className="mt-4 pt-4 border-t border-[#DCE6ED] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#153B50] mb-1">
                  Patient Full Name (Shown on Report & PDF)
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient full name..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE6ED] bg-white text-[#253746] focus:outline-none focus:border-[#249A96]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#153B50] mb-1">
                  Patient Age (e.g., 28 years)
                </label>
                <input
                  type="text"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g., 28 years"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE6ED] bg-white text-[#253746] focus:outline-none focus:border-[#249A96]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#153B50] mb-1">
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE6ED] bg-white text-[#253746] focus:outline-none focus:border-[#249A96]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Not Specified">Prefer not to say / Not Specified</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Top AI Safety Banner */}
        <div className="bg-[#E9F7F5] border-b border-[#249A96]/25 px-6 sm:px-8 py-3.5 text-xs text-[#153B50] flex items-start gap-2.5 print:hidden">
          <ShieldCheck className="w-4 h-4 text-[#249A96] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Educational Clinical Guidance: </strong>
            This AI-generated report outlines possible explanations rather than a confirmed diagnosis.{' '}
            {type === 'skin' &&
              'A photograph alone cannot confirm a skin condition or rule out skin cancer. '}
            Always consult a qualified doctor or pharmacist for personal medical advice.
          </div>
        </div>

        {/* Optional Togglable Doctor Discussion Summary */}
        {showDoctorVisitSummary && (
          <div className="p-6 bg-[#F7FAFC] border-b border-[#DCE6ED] print:hidden">
            <DoctorDiscussionSummary
              type={type}
              symptomReport={normalizedSymptom || undefined}
              skinReport={normalizedSkin || undefined}
              patientName={resolvedPatientName}
              patientAge={resolvedPatientAge}
              patientGender={resolvedPatientGender}
              reportedDuration={intakeContext?.duration}
              reportedSymptoms={intakeContext?.symptoms}
              reportedDescription={intakeContext?.description || intakeContext?.mainComplaint}
              onClose={() => setShowDoctorVisitSummary(false)}
            />
          </div>
        )}

        {/* 12-SECTION REPORT BODY */}
        <div className="p-6 sm:p-8 space-y-10">
          {/* SECTION 01: Assessment Summary */}
          <section aria-labelledby="report-sec-1">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#DCE6ED]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                  01
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h3
                  id="report-sec-1"
                  className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
                >
                  Assessment Summary
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#153B50] bg-[#E9F7F5] px-2.5 py-1 rounded-md border border-[#249A96]/25">
                <Sparkles className="w-3 h-3 text-[#249A96]" />
                <span>AI-Generated Clinical Synthesis</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {type === 'skin' && previewImageUrl && (
                <div className="md:col-span-4 bg-[#F7FAFC] rounded-2xl overflow-hidden border border-[#DCE6ED] p-3 flex flex-col items-center justify-center">
                  <img
                    src={previewImageUrl}
                    alt="Uploaded skin area"
                    className="max-h-52 w-auto object-contain rounded-xl"
                  />
                  <span className="text-[11px] text-[#687986] mt-2">
                    Submitted reference photograph
                  </span>
                </div>
              )}

              <div
                className={
                  type === 'skin' && previewImageUrl
                    ? 'md:col-span-8 space-y-3'
                    : 'md:col-span-12 space-y-3'
                }
              >
                <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#DCE6ED] text-sm sm:text-[15px] text-[#253746] leading-relaxed">
                  {summaryText}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#153B50]">Recommended Clinician Type:</span>
                    <span className="text-[#153B50] font-semibold">
                      {type === 'skin'
                        ? normalizedSkin?.recommendedSpecialty ||
                          'Board-Certified Dermatologist or Primary Care Physician'
                        : 'Primary Care Physician / Family Medicine Clinician'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDoctorVisitSummary(!showDoctorVisitSummary)}
                    className="text-[#249A96] hover:text-[#153B50] underline underline-offset-4 font-bold flex items-center gap-1.5 cursor-pointer print:hidden"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      {showDoctorVisitSummary
                        ? 'Hide Doctor Discussion Sheet'
                        : 'Open Printable Doctor Visit Card'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 02: Possible Condition or Conditions */}
          <section aria-labelledby="report-sec-2">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#DCE6ED]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                  02
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3
                  id="report-sec-2"
                  className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
                >
                  Possible Condition or Conditions
                </h3>
              </div>
              <span className="text-xs text-[#687986] font-medium">
                Possible Explanations Only · Not Confirmed Diagnoses
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#687986] mb-4 leading-relaxed">
              The conditions below are listed as possible explanations to discuss with a qualified healthcare professional. No online tool or photograph can provide a definitive diagnosis or percentage certainty score.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conditionDescriptions.map((cond, idx) => (
                <div
                  key={cond.name}
                  className="p-5 rounded-2xl border border-[#DCE6ED] bg-white space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#249A96]">
                        Possible Explanation · {cond.likelihoodNote}
                      </div>
                      <h4 className="text-base font-bold text-[#153B50] leading-snug mt-0.5 font-display">
                        {cond.name}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#253746] leading-relaxed">
                    {cond.whatItIs}
                  </p>

                  {cond.urgencyLevel && (
                    <div className="pt-2.5 border-t border-[#E3EDF2] flex items-center justify-between text-xs text-[#687986]">
                      <span>Recommended Evaluation Timeline</span>
                      <span className="font-bold text-[#153B50]">{cond.urgencyLevel}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 03: What Is This Condition? */}
          <section aria-labelledby="report-sec-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#DCE6ED]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                  03
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3
                  id="report-sec-3"
                  className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
                >
                  What Is This Condition & How Clinicians Evaluate It
                </h3>
              </div>
              <span className="text-xs text-[#687986] font-medium">
                Plain-Language Disease Overview
              </span>
            </div>

            <div className="space-y-4">
              {conditionDescriptions.map((cond) => (
                <div
                  key={cond.name}
                  className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#DCE6ED] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-[#153B50] font-display">
                      {cond.name}
                    </h4>
                    <span className="text-xs text-[#687986]">
                      Clinical Correlation & Evaluation
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#253746] leading-relaxed">
                    {cond.whatItIs}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-white border border-[#DCE6ED]">
                      <span className="text-xs font-bold text-[#153B50] block mb-1">
                        How It Relates to Your Assessment:
                      </span>
                      <p className="text-xs text-[#253746] leading-relaxed">
                        {cond.howItRelatesToUser}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-[#DCE6ED]">
                      <span className="text-xs font-bold text-[#249A96] block mb-1">
                        How a Qualified Clinician Evaluates It:
                      </span>
                      <p className="text-xs text-[#253746] leading-relaxed">
                        {cond.howClinicianEvaluates}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 04: Common Causes and Risk Factors */}
          <section aria-labelledby="report-sec-4">
            <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#DCE6ED]">
              <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                04
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3
                id="report-sec-4"
                className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
              >
                Common Causes and Risk Factors
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conditionDescriptions.map((cond) => (
                <div
                  key={cond.name}
                  className="p-5 rounded-2xl bg-white border border-[#DCE6ED] space-y-2.5"
                >
                  <h4 className="text-sm font-bold text-[#153B50] font-display">{cond.name}</h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#253746]">
                    {cond.commonCausesAndRiskFactors.map((cause, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2 leading-relaxed">
                        <Activity className="w-3.5 h-3.5 text-[#249A96] mt-1 shrink-0" />
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 05: Symptoms and Observable Features */}
          <section aria-labelledby="report-sec-5" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#DCE6ED]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                  05
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <h3
                  id="report-sec-5"
                  className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
                >
                  Symptoms, Observable Features & Clinical Uncertainty
                </h3>
              </div>
              <span className="text-xs text-[#687986] font-medium">
                Reported Inputs vs. Objective Observations
              </span>
            </div>

            {supportingInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#DCE6ED] space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#153B50] flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#249A96]" />
                    <span>Information Reported by Patient</span>
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#253746]">
                    {supportingInfo.userReportedSummary.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[#249A96] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {type === 'skin' && supportingInfo.visibleInImageSummary ? (
                  <div className="p-5 rounded-2xl bg-[#E9F7F5]/60 border border-[#249A96]/30 space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#153B50] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#249A96]" />
                      <span>Features Visible in Uploaded Image (2D Optics Only)</span>
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#253746]">
                      {supportingInfo.visibleInImageSummary.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <Eye className="w-4 h-4 text-[#249A96] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-white border border-[#DCE6ED] space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#153B50] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#249A96]" />
                      <span>Typical Symptoms Across Possible Conditions</span>
                    </span>
                    <div className="space-y-2">
                      {conditionDescriptions.map((cond) => (
                        <div key={cond.name} className="text-xs text-[#253746]">
                          <strong className="text-[#153B50]">{cond.name}: </strong>
                          {cond.typicalSymptoms.join(', ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {supportingInfo?.imageVsReportedDistinction && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-[#E7A23B] shrink-0 mt-0.5" />
                <div>
                  <strong>Important Distinction: </strong>
                  {supportingInfo.imageVsReportedDistinction}
                </div>
              </div>
            )}

            {type === 'skin' && normalizedSkin?.abcdeMelanomaAssessment && (
              <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#DCE6ED] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#153B50] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#E7A23B]" />
                    ABCDE Pigmented Spot & Melanoma Awareness Guide
                  </h4>
                  <span className="text-[11px] font-medium text-[#687986]">
                    Educational Reference · Does Not Rule Out Skin Cancer
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#DCE6ED]">
                    <strong className="text-[#153B50] block mb-1">A — Asymmetry</strong>
                    <p className="text-[#687986] leading-relaxed">
                      {normalizedSkin.abcdeMelanomaAssessment.asymmetryNote}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#DCE6ED]">
                    <strong className="text-[#153B50] block mb-1">B — Border</strong>
                    <p className="text-[#687986] leading-relaxed">
                      {normalizedSkin.abcdeMelanomaAssessment.borderNote}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#DCE6ED]">
                    <strong className="text-[#153B50] block mb-1">C — Color</strong>
                    <p className="text-[#687986] leading-relaxed">
                      {normalizedSkin.abcdeMelanomaAssessment.colorNote}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#DCE6ED]">
                    <strong className="text-[#153B50] block mb-1">D — Diameter</strong>
                    <p className="text-[#687986] leading-relaxed">
                      {normalizedSkin.abcdeMelanomaAssessment.diameterNote}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#DCE6ED]">
                    <strong className="text-[#153B50] block mb-1">E — Evolving</strong>
                    <p className="text-[#687986] leading-relaxed">
                      {normalizedSkin.abcdeMelanomaAssessment.evolutionNote}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {uncertaintyInfo && (
              <div className="p-5 rounded-2xl bg-white border border-[#DCE6ED] space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-[#153B50] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#249A96]" />
                  Uncertainty, Alternative Explanations & What Information Is Missing
                </h4>
                <p className="text-xs sm:text-sm text-[#253746] leading-relaxed">
                  {uncertaintyInfo.uncertaintyExplanation}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#DCE6ED]">
                    <span className="text-xs font-bold text-[#153B50] block mb-1.5">
                      What Information Is Missing From an Online Check:
                    </span>
                    <ul className="space-y-1 text-xs text-[#253746] list-disc list-inside">
                      {uncertaintyInfo.missingClinicalInformation.map((m, i) => (
                        <li key={i} className="leading-relaxed">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F7FAFC] border border-[#DCE6ED]">
                    <span className="text-xs font-bold text-[#153B50] block mb-1.5">
                      Important Alternative Explanations & Why In-Person Exam Matters:
                    </span>
                    <p className="text-xs text-[#253746] leading-relaxed mb-2">
                      {uncertaintyInfo.whyInPersonExamIsRequired}
                    </p>
                    <div className="text-xs text-[#687986]">
                      {conditionDescriptions
                        .flatMap((c) => c.alternativeExplanations)
                        .slice(0, 3)
                        .join(' · ')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 06: Recommended Recovery and Self-Care */}
          <section aria-labelledby="report-sec-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#DCE6ED]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                  06
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3
                  id="report-sec-6"
                  className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
                >
                  Recommended Recovery and Self-Care
                </h3>
              </div>
              <span className="text-xs text-[#249A96] font-semibold flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Supportive Care Measures</span>
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#E9F7F5]/60 border border-[#249A96]/30 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(selfCare?.supportiveMeasures || []).map((measure, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-[#249A96]/20 flex items-start gap-2.5 text-xs sm:text-sm text-[#253746] leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#249A96] shrink-0 mt-0.5" />
                    <span>{measure}</span>
                  </div>
                ))}
              </div>

              {selfCare?.recoveryExpectations && (
                <div className="p-4 rounded-xl bg-white border border-[#DCE6ED] text-xs sm:text-sm text-[#253746] leading-relaxed">
                  <strong className="text-[#153B50] block mb-1">
                    Expected Recovery Considerations & Monitoring:
                  </strong>
                  {selfCare.recoveryExpectations}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 07: Medication Information (Educational Only + Mandatory Safeguard) */}
          <section aria-labelledby="report-sec-7">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#DCE6ED]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                  07
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <h3
                  id="report-sec-7"
                  className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
                >
                  Medication Information (Educational Only)
                </h3>
              </div>
              <span className="text-xs text-[#687986] font-medium">
                Consult a Clinician or Pharmacist First
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#DCE6ED] space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#E7A23B] shrink-0 mt-0.5" />
                <div className="leading-relaxed font-semibold">
                  {medicationInfo?.suitabilityBanner || MANDATORY_MEDICATION_SAFEGUARD}
                </div>
              </div>

              {medicationInfo?.generalEducationalNote && (
                <p className="text-xs sm:text-sm text-[#687986] leading-relaxed">
                  {medicationInfo.generalEducationalNote}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(medicationInfo?.options || []).map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-[#DCE6ED] space-y-2.5"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#249A96] block">
                        {opt.availabilityStatus}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#153B50] font-display">
                        {opt.categoryOrName}
                      </h4>
                    </div>

                    <p className="text-xs text-[#253746] leading-relaxed">
                      <strong>What it is commonly used for: </strong>
                      {opt.generalPurpose}
                    </p>

                    <div className="text-xs text-[#687986] space-y-1">
                      <strong className="text-[#153B50] block">
                        Common Side Effects & Considerations:
                      </strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        {opt.commonSideEffects.map((se, sIdx) => (
                          <li key={sIdx}>{se}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs text-rose-900 bg-rose-50/60 p-2.5 rounded-lg border border-rose-200/70 space-y-1">
                      <strong className="block">Who Should Avoid / Contraindications:</strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        {opt.contraindicationsAndInteractions.map((ci, cIdx) => (
                          <li key={cIdx}>{ci}</li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-[11px] text-[#249A96] font-medium">
                      {opt.consultationNote}
                    </p>
                  </div>
                ))}
              </div>

              {medicationInfo?.specialPopulationSafeguards &&
                medicationInfo.specialPopulationSafeguards.length > 0 && (
                  <div className="p-4 rounded-xl bg-white border border-[#DCE6ED]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#153B50] mb-2">
                      Important Safeguards (Children, Pregnancy, Allergies & Existing Conditions)
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#253746]">
                      {medicationInfo.specialPopulationSafeguards.map((sg, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#E7A23B] mt-0.5 shrink-0" />
                          <span>{sg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </section>

          {/* SECTION 08: What to Avoid */}
          <section aria-labelledby="report-sec-8">
            <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#DCE6ED]">
              <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                08
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#D97706] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3
                id="report-sec-8"
                className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
              >
                What to Avoid
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-[#253746]">
                {whatToAvoidList.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-amber-200/60 flex items-start gap-2.5 leading-relaxed"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#E7A23B] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECTION 09: When to See a Doctor */}
          <section aria-labelledby="report-sec-9">
            <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#DCE6ED]">
              <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                09
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3
                id="report-sec-9"
                className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
              >
                When to See a Doctor
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#DCE6ED] space-y-2.5">
              <p className="text-xs sm:text-sm text-[#687986]">
                Schedule an appointment with a qualified physician or board-certified dermatologist if any of the following apply:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-[#253746]">
                {whenToSeeDoctorList.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-[#DCE6ED] flex items-start gap-2.5 leading-relaxed"
                  >
                    <Clock className="w-4 h-4 text-[#249A96] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECTION 10: Emergency Warning Signs */}
          <section aria-labelledby="report-sec-10">
            <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-rose-200">
              <span className="w-7 h-7 rounded-lg bg-[#C83F49] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                10
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#C83F49] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3
                id="report-sec-10"
                className="text-sm sm:text-base font-extrabold text-[#C83F49] uppercase tracking-wider font-display"
              >
                Emergency Warning Signs
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/75 border-2 border-[#C83F49]/35 space-y-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C83F49]">
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>
                  Seek immediate emergency medical care (call 911 / 112 / local emergency services) if you notice:
                </span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm text-rose-950">
                {emergencyWarningsList.map((item, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-rose-200 flex items-start gap-2.5 font-medium leading-relaxed"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#C83F49] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECTION 11: Follow-up Guidance & Doctor Questions Checklist */}
          <section aria-labelledby="report-sec-11" className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCE6ED]">
              <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                11
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3
                id="report-sec-11"
                className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
              >
                Follow-up Guidance & Questions for Your Doctor
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {followUpSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#DCE6ED] text-xs sm:text-sm text-[#253746] leading-relaxed"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-[#249A96] block mb-1 tabular-nums">
                    Follow-Up Step 0{idx + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            {doctorQuestions.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-[#DCE6ED] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#153B50] font-display">
                    Interactive Questions Checklist for Your Appointment
                  </h4>
                  <span className="text-[11px] text-[#687986] print:hidden">
                    Click any question to check it off
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {doctorQuestions.map((q, qIdx) => {
                    const checked = !!checkedQuestions[qIdx];
                    return (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() =>
                          setCheckedQuestions((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }))
                        }
                        className={`text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 transition-colors cursor-pointer ${
                          checked
                            ? 'bg-[#E9F7F5] border-[#249A96]/40 text-[#153B50] line-through'
                            : 'bg-[#F7FAFC] border-[#DCE6ED] text-[#253746] hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="mt-1 rounded text-[#249A96] cursor-pointer"
                        />
                        <span className="leading-relaxed">{q}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* SECTION 12: AI Medical Disclaimer */}
          <section aria-labelledby="report-sec-12">
            <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#DCE6ED]">
              <span className="w-7 h-7 rounded-lg bg-[#153B50] text-white text-xs font-bold tabular-nums flex items-center justify-center">
                12
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#E9F7F5] text-[#249A96] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3
                id="report-sec-12"
                className="text-sm sm:text-base font-extrabold text-[#153B50] uppercase tracking-wider font-display"
              >
                AI Medical Disclaimer
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7FAFC] border border-[#DCE6ED] text-xs sm:text-sm text-[#253746] leading-relaxed space-y-2">
              <p className="font-semibold text-[#153B50]">{aiDisclosureText}</p>
              <p className="text-xs text-[#687986] tabular-nums">
                Report ID: {caseId} · Patient: {resolvedPatientName} ({resolvedPatientAge}, {resolvedPatientGender}) · Generated on {assessmentDate} · DermaDetect AI Clinical Decision Support Platform · Developed by Fizza Amin and Muhammad Faizan Ud Din
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Interactive Dr. Fizza Consultation Banner (Hidden when printing) */}
      <div className="bg-[#153B50] text-white p-6 rounded-3xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#249A96] flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white font-display">
              Discuss This Report with Dr. Fizza (AI Clinical Educator)
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
              Ask follow-up questions in plain language with your {type === 'skin' ? 'skin analysis' : 'symptom'} report context automatically attached.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDrFizza(!showDrFizza)}
          className="px-5 py-3 bg-white text-[#153B50] hover:bg-[#E9F7F5] text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          {showDrFizza ? 'Close Dr. Fizza Chat' : 'Ask Dr. Fizza About My Report'}
        </button>
      </div>

      {showDrFizza && (
        <div className="print:hidden">
          <AIDoctorConsultation
            reportContext={activeReport}
            reportType={type}
            initialMessage={`Hello Dr. Fizza, could you walk me through my ${
              type === 'skin' ? 'skin analysis' : 'symptom'
            } report in simple terms and help me prepare for my doctor visit?`}
          />
        </div>
      )}

      {/* MODAL 1: How Was This Report Generated? */}
      {showHowGeneratedModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-[#DCE6ED] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#DCE6ED] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#153B50] font-display">
                    How Was This Report Generated?
                  </h3>
                  <p className="text-xs text-[#687986]">
                    AI-Generated Assessment · Transparency & Clinical Safety Boundaries
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHowGeneratedModal(false)}
                className="p-1.5 rounded-lg text-[#687986] hover:text-[#153B50] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#253746] leading-relaxed">
              <div className="p-4 rounded-xl bg-[#E9F7F5] border border-[#249A96]/30 text-[#153B50] font-medium">
                {MANDATORY_AI_DISCLOSURE}
              </div>

              <div className="p-4 rounded-xl bg-[#F7FAFC] border border-[#DCE6ED]">
                <strong className="text-[#153B50] block mb-1">
                  1. Structured Synthesis of Your Inputs
                </strong>
                This report was generated by combining the patient details, symptoms, timeline, and health context you reported
                {type === 'skin'
                  ? ' alongside 2D visual patterns (color, border contour, and surface texture) observed in your uploaded photograph.'
                  : ' during your guided symptom check.'}
              </div>

              <div className="p-4 rounded-xl bg-[#F7FAFC] border border-[#DCE6ED]">
                <strong className="text-[#153B50] block mb-1">
                  2. Why Percentage Scores Are Never Used
                </strong>
                True diagnostic probability requires physical examination, vital signs, dermoscopy, or laboratory tests. To prevent false reassurance or unnecessary alarm, DermaDetect AI uses qualitative clinical labels (such as <em>Plausible Explanation</em> or <em>Needs Clinical Evaluation</em>) rather than unverified percentage scores.
              </div>

              <div className="p-4 rounded-xl bg-[#F7FAFC] border border-[#DCE6ED]">
                <strong className="text-[#153B50] block mb-1">
                  3. Built-In Medication & Emergency Guardrails
                </strong>
                Every report passes through a clinical validation layer that enforces non-diagnostic language, separates visible image features from reported symptoms, blocks personal prescription dosing, and highlights emergency warning signs.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHowGeneratedModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#153B50] text-white text-xs font-bold cursor-pointer"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Seek Medical Guidance */}
      {showSeekGuidanceModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-[#DCE6ED] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#DCE6ED] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#249A96] text-white flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#153B50] font-display">
                    Seek Professional Medical Guidance
                  </h3>
                  <p className="text-xs text-[#687986]">
                    Choosing the right care setting and preparing for your visit
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSeekGuidanceModal(false)}
                className="p-1.5 rounded-lg text-[#687986] hover:text-[#153B50] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#253746]">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <strong className="text-[#C83F49] block mb-1">
                  Emergency Department / Call 911 or 112 Immediately
                </strong>
                Choose emergency care if you experience breathing difficulty, chest pain or pressure, severe allergic swelling of the lips/tongue, rapidly spreading warm redness with fever, or sudden confusion/weakness.
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <strong className="text-amber-950 block mb-1">
                  Prompt Care / Urgent Care Clinic (Within 24–48 Hours)
                </strong>
                Appropriate for moderate symptoms that are worsening, persistent fever, painful or rapidly spreading rashes, or suspected local infections that need a timely physical exam or swab.
              </div>

              <div className="p-4 rounded-xl bg-[#E9F7F5]/70 border border-[#249A96]/30">
                <strong className="text-[#153B50] block mb-1">
                  Primary Care Physician or Board-Certified Dermatologist
                </strong>
                Ideal for non-emergency symptoms, persistent skin patches, or any new, changing, or multi-colored mole that needs in-person dermoscopy.
              </div>

              <div className="p-4 rounded-xl bg-[#F7FAFC] border border-[#DCE6ED]">
                <strong className="text-[#153B50] block mb-1">
                  Licensed Pharmacist Consultation
                </strong>
                Ask a local pharmacist before starting any over-the-counter medication or topical cream to verify safety with your allergies, age, and current medications.
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSeekGuidanceModal(false);
                  setShowDoctorVisitSummary(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#249A96] hover:bg-[#1d807c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Open Printable Doctor Visit Summary</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSeekGuidanceModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#153B50] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
