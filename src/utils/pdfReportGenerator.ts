import { jsPDF } from 'jspdf';
import { SymptomReport, SkinReport } from '../types/health';
import { BRAND_LOGO_URL } from '../components/Header';
import {
  MANDATORY_AI_DISCLOSURE,
  MANDATORY_MEDICATION_SAFEGUARD,
} from '../services/clinicalEngine';

export interface PdfExportOptions {
  type: 'symptom' | 'skin';
  caseId: string;
  assessmentDate: string;
  triageLevel: 'routine' | 'prompt' | 'emergency';
  patientName: string;
  patientAge: string;
  patientGender: string;
  summaryText: string;
  previewImageUrl?: string | null;
  symptomReport?: SymptomReport | null;
  skinReport?: SkinReport | null;
}

/**
 * Safely converts an image URL or base64 string into a PNG/JPEG Data URL for jsPDF.
 * Resolves to null on error or timeout so PDF generation never hangs.
 */
async function loadImageAsDataUrl(src?: string | null, format: 'PNG' | 'JPEG' = 'PNG'): Promise<string | null> {
  if (!src) return null;
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 2500);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let w = img.naturalWidth || img.width || 200;
          let h = img.naturalHeight || img.height || 200;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          if (format === 'JPEG') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL(format === 'JPEG' ? 'image/jpeg' : 'image/png', 0.92));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(null);
      };
      img.src = src.startsWith('data:') ? src : new URL(src, window.location.origin).href;
    } catch {
      clearTimeout(timeout);
      resolve(null);
    }
  });
}

/**
 * Generates and downloads a multi-page hospital-grade 12-Section Clinical PDF Report.
 */
export async function downloadClinicalReportPdf(options: PdfExportOptions): Promise<void> {
  const {
    type,
    caseId,
    assessmentDate,
    triageLevel,
    patientName,
    patientAge,
    patientGender,
    summaryText,
    previewImageUrl,
    symptomReport,
    skinReport,
  } = options;

  const activeReport = type === 'symptom' ? symptomReport : skinReport;
  if (!activeReport) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 18) {
      doc.addPage();
      y = 16;
    }
  };

  // Load brand logo and optional skin image in parallel
  const [logoDataUrl, skinPhotoDataUrl] = await Promise.all([
    loadImageAsDataUrl(BRAND_LOGO_URL, 'PNG'),
    type === 'skin' && previewImageUrl ? loadImageAsDataUrl(previewImageUrl, 'JPEG') : Promise.resolve(null),
  ]);

  // 1. TOP NAVY HEADER BANNER (#153B50)
  doc.setFillColor(21, 59, 80);
  doc.rect(0, 0, pageWidth, 34, 'F');

  let headerTextX = margin;
  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 6, 20, 20, 3, 3, 'F');
    try {
      doc.addImage(logoDataUrl, 'PNG', margin + 1, 7, 18, 18);
      headerTextX = margin + 24;
    } catch {
      headerTextX = margin;
    }
  }

  doc.setTextColor(233, 247, 245);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('AI-GENERATED CLINICAL ASSESSMENT  •  NON-DIAGNOSTIC REPORT', headerTextX, 11);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(
    type === 'skin'
      ? 'DermaDetect AI — Dermatological & Skin Report'
      : 'DermaDetect AI — Symptom & Clinical Triage Report',
    headerTextX,
    18.5
  );

  doc.setTextColor(215, 232, 240);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `Report ID: ${caseId}   |   Date: ${assessmentDate}   |   12-Section Clinical Structure`,
    headerTextX,
    24.5
  );

  // Triage Status Badge on right side of header
  const triageLabel =
    triageLevel === 'emergency'
      ? 'IMMEDIATE EMERGENCY'
      : triageLevel === 'prompt'
      ? 'PROMPT REVIEW ADVISED'
      : 'ROUTINE OUTPATIENT';
  if (triageLevel === 'emergency') {
    doc.setFillColor(200, 63, 73);
  } else if (triageLevel === 'prompt') {
    doc.setFillColor(217, 119, 6);
  } else {
    doc.setFillColor(36, 154, 150);
  }
  const badgeW = 44;
  doc.roundedRect(pageWidth - margin - badgeW, 9, badgeW, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text(triageLabel, pageWidth - margin - badgeW / 2, 14.2, { align: 'center' });

  y = 40;

  // 2. PATIENT DEMOGRAPHICS & RECORD BANNER
  doc.setFillColor(247, 250, 252);
  doc.setDrawColor(220, 230, 237);
  doc.roundedRect(margin, y, contentWidth, 20, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(36, 154, 150);
  doc.text('PATIENT IDENTIFICATION & CLINICAL RECORD', margin + 4, y + 5.5);

  doc.setFontSize(9);
  doc.setTextColor(21, 59, 80);
  const col1X = margin + 4;
  const col2X = margin + contentWidth * 0.36;
  const col3X = margin + contentWidth * 0.64;
  const col4X = margin + contentWidth * 0.82;

  doc.setFont('helvetica', 'bold');
  doc.text('Patient Name:', col1X, y + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(37, 55, 70);
  doc.text(patientName || 'Not Specified', col1X, y + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 59, 80);
  doc.text('Age:', col2X, y + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(37, 55, 70);
  doc.text(patientAge || 'Adult', col2X, y + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 59, 80);
  doc.text('Gender:', col3X, y + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(37, 55, 70);
  doc.text(patientGender || 'Not Specified', col3X, y + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 59, 80);
  doc.text('Modality:', col4X, y + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(37, 55, 70);
  doc.text(type === 'skin' ? 'Skin Analysis' : 'Symptom Triage', col4X, y + 16.5);

  y += 25;

  // Helper to draw a numbered section heading
  const drawSectionHeader = (num: string, title: string, isEmergencySection = false) => {
    ensureSpace(14);
    if (isEmergencySection) {
      doc.setFillColor(200, 63, 73);
    } else {
      doc.setFillColor(21, 59, 80);
    }
    doc.roundedRect(margin, y, 7, 6.5, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(num, margin + 3.5, y + 4.5, { align: 'center' });

    if (isEmergencySection) {
      doc.setTextColor(200, 63, 73);
    } else {
      doc.setTextColor(21, 59, 80);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(title.toUpperCase(), margin + 9.5, y + 4.8);

    doc.setDrawColor(220, 230, 237);
    doc.line(margin, y + 8, pageWidth - margin, y + 8);
    y += 12;
  };

  const drawParagraph = (text: string, fontSize = 9, color: [number, number, number] = [37, 55, 70], bold = false) => {
    if (!text) return;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * 4.5 + 2);
    doc.text(lines, margin, y);
    y += lines.length * 4.4 + 2;
  };

  const drawBullets = (items: string[], bulletColor: [number, number, number] = [36, 154, 150]) => {
    items.forEach((item) => {
      if (!item) return;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      const lines = doc.splitTextToSize(item, contentWidth - 6);
      ensureSpace(lines.length * 4.3 + 2);
      doc.setFillColor(bulletColor[0], bulletColor[1], bulletColor[2]);
      doc.circle(margin + 2, y - 1.2, 0.9, 'F');
      doc.setTextColor(37, 55, 70);
      doc.text(lines, margin + 5.5, y);
      y += lines.length * 4.3 + 1.5;
    });
    y += 1.5;
  };

  // SECTION 01: Assessment Summary
  drawSectionHeader('01', 'Assessment Summary');
  if (skinPhotoDataUrl) {
    ensureSpace(38);
    try {
      doc.setDrawColor(220, 230, 237);
      doc.roundedRect(margin, y - 1, 34, 34, 2, 2, 'D');
      doc.addImage(skinPhotoDataUrl, 'JPEG', margin + 1, y, 32, 32);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(37, 55, 70);
      const summaryLines = doc.splitTextToSize(summaryText, contentWidth - 38);
      doc.text(summaryLines, margin + 38, y + 4);
      const textH = summaryLines.length * 4.5 + 4;
      y += Math.max(36, textH);
    } catch {
      drawParagraph(summaryText);
    }
  } else {
    drawParagraph(summaryText);
  }

  const conditionDescriptions = activeReport.conditionDescriptions || [];
  const supportingInfo = activeReport.supportingInformation;
  const uncertaintyInfo = activeReport.uncertaintyAndAlternatives;
  const selfCare = activeReport.selfCareGuidance;
  const medicationInfo = activeReport.medicationInformation;
  const whatToAvoidList =
    activeReport.contraindicationsAndWarnings ||
    (type === 'skin' ? skinReport?.thingsToAvoid : symptomReport?.medicationSafetyGuidance?.whatToAvoid) ||
    [];
  const whenToSeeDoctorList =
    activeReport.professionalCareGuidance ||
    (type === 'skin' ? skinReport?.whenToSeeDermatologist : symptomReport?.whenToSeeDoctor) ||
    [];
  const emergencyWarningsList =
    activeReport.emergencyWarnings ||
    (type === 'skin' ? skinReport?.urgentRedFlags : symptomReport?.urgentWarningSigns) ||
    [];
  const followUpSteps =
    activeReport.followUpGuidance || (type === 'symptom' ? symptomReport?.nextSteps : []) || [];
  const doctorQuestions = activeReport.suggestedDoctorQuestions || [];
  const aiDisclosureText = activeReport.aiDisclosure || MANDATORY_AI_DISCLOSURE;

  // SECTION 02: Possible Condition or Conditions
  drawSectionHeader('02', 'Possible Condition or Conditions (Not Confirmed Diagnoses)');
  conditionDescriptions.forEach((cond, idx) => {
    const descLines = doc.splitTextToSize(cond.whatItIs, contentWidth - 8);
    ensureSpace(descLines.length * 4.3 + 16);
    doc.setFillColor(247, 250, 252);
    doc.setDrawColor(220, 230, 237);
    doc.roundedRect(margin, y - 2, contentWidth, descLines.length * 4.3 + 12, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(21, 59, 80);
    doc.text(`${idx + 1}. ${cond.name}  [${cond.likelihoodNote}]`, margin + 4, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(37, 55, 70);
    doc.text(descLines, margin + 4, y + 8.5);
    y += descLines.length * 4.3 + 13;
  });

  // SECTION 03: What Is This Condition & How Clinicians Evaluate It
  drawSectionHeader('03', 'What Is This Condition & How Clinicians Evaluate It');
  conditionDescriptions.forEach((cond) => {
    drawParagraph(`${cond.name}:`, 9.2, [21, 59, 80], true);
    drawParagraph(`• How It Relates: ${cond.howItRelatesToUser}`, 8.6, [37, 55, 70]);
    drawParagraph(`• How a Clinician Evaluates: ${cond.howClinicianEvaluates}`, 8.6, [36, 154, 150]);
  });

  // SECTION 04: Common Causes and Risk Factors
  drawSectionHeader('04', 'Common Causes and Risk Factors');
  conditionDescriptions.forEach((cond) => {
    drawParagraph(
      `${cond.name}: ${cond.commonCausesAndRiskFactors.join('; ')}`,
      8.8,
      [37, 55, 70]
    );
  });

  // SECTION 05: Symptoms, Observable Features & Clinical Uncertainty
  drawSectionHeader('05', 'Symptoms, Observable Features & Clinical Uncertainty');
  if (supportingInfo?.userReportedSummary && supportingInfo.userReportedSummary.length > 0) {
    drawParagraph('Information Reported by Patient:', 9, [21, 59, 80], true);
    drawBullets(supportingInfo.userReportedSummary);
  }
  if (type === 'skin' && supportingInfo?.visibleInImageSummary) {
    drawParagraph('Features Visible in Uploaded Image (2D Optics Only):', 9, [21, 59, 80], true);
    drawBullets(supportingInfo.visibleInImageSummary);
  }
  if (uncertaintyInfo?.missingClinicalInformation && uncertaintyInfo.missingClinicalInformation.length > 0) {
    drawParagraph('What Information Is Missing From an Online Check:', 9, [21, 59, 80], true);
    drawBullets(uncertaintyInfo.missingClinicalInformation, [104, 121, 134]);
  }

  // SECTION 06: Recommended Recovery and Self-Care
  drawSectionHeader('06', 'Recommended Recovery and Self-Care');
  drawBullets(selfCare?.supportiveMeasures || []);
  if (selfCare?.recoveryExpectations) {
    drawParagraph(`Recovery & Monitoring Note: ${selfCare.recoveryExpectations}`, 8.6, [104, 121, 134]);
  }

  // SECTION 07: Medication Information (Educational Only)
  drawSectionHeader('07', 'Medication Information (Educational Only)');
  drawParagraph(
    `Safeguard Notice: ${medicationInfo?.suitabilityBanner || MANDATORY_MEDICATION_SAFEGUARD}`,
    8.8,
    [180, 83, 9],
    true
  );
  (medicationInfo?.options || []).forEach((opt) => {
    drawParagraph(`${opt.categoryOrName} (${opt.availabilityStatus})`, 9, [21, 59, 80], true);
    drawParagraph(`Purpose: ${opt.generalPurpose}`, 8.6, [37, 55, 70]);
    drawParagraph(
      `Who Should Avoid / Contraindications: ${opt.contraindicationsAndInteractions.join('; ')}`,
      8.5,
      [153, 27, 27]
    );
  });

  // SECTION 08: What to Avoid
  drawSectionHeader('08', 'What to Avoid');
  drawBullets(whatToAvoidList, [217, 119, 6]);

  // SECTION 09: When to See a Doctor
  drawSectionHeader('09', 'When to See a Doctor');
  drawBullets(whenToSeeDoctorList, [36, 154, 150]);

  // SECTION 10: Emergency Warning Signs
  drawSectionHeader('10', 'Emergency Warning Signs', true);
  drawBullets(emergencyWarningsList, [200, 63, 73]);

  // SECTION 11: Follow-up Guidance & Questions for Your Doctor
  drawSectionHeader('11', 'Follow-up Guidance & Questions for Your Doctor');
  if (followUpSteps.length > 0) {
    drawParagraph('Recommended Follow-up Steps:', 9, [21, 59, 80], true);
    drawBullets(followUpSteps);
  }
  if (doctorQuestions.length > 0) {
    drawParagraph('Questions to Ask Your Physician:', 9, [21, 59, 80], true);
    drawBullets(doctorQuestions);
  }

  // SECTION 12: AI Medical Disclaimer
  drawSectionHeader('12', 'AI Medical Disclaimer');
  drawParagraph(aiDisclosureText, 8.6, [21, 59, 80], true);

  // Add Footer with Page Numbers & Developer Credits on Every Page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(220, 230, 237);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(104, 121, 134);
    doc.text(
      `DermaDetect AI • Report ID: ${caseId} • Developed by Fizza Amin and Muhammad Faizan Ud Din`,
      margin,
      pageHeight - 7.5
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 7.5, { align: 'right' });
  }

  doc.save(`DermaDetect-Clinical-Report-${caseId}.pdf`);
}

/**
 * Generates and downloads a concise 1-page Doctor Visit Discussion Summary PDF.
 */
export async function downloadDoctorSummaryPdf(options: {
  type: 'symptom' | 'skin';
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  reportedDuration?: string;
  reportedSymptoms?: string[];
  reportedDescription?: string;
  symptomReport?: SymptomReport | null;
  skinReport?: SkinReport | null;
}): Promise<void> {
  const {
    type,
    patientName = 'Not Specified',
    patientAge = 'Adult',
    patientGender = 'Not Specified',
    reportedDuration = 'Unspecified',
    reportedSymptoms = [],
    reportedDescription = '',
    symptomReport,
    skinReport,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const logoDataUrl = await loadImageAsDataUrl(BRAND_LOGO_URL, 'PNG');

  // Header
  doc.setFillColor(21, 59, 80);
  doc.rect(0, 0, pageWidth, 28, 'F');
  let textX = margin;
  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 5, 18, 18, 2.5, 2.5, 'F');
    try {
      doc.addImage(logoDataUrl, 'PNG', margin + 1, 6, 16, 16);
      textX = margin + 22;
    } catch {
      textX = margin;
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('DermaDetect AI — Doctor Visit Discussion Summary', textX, 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(233, 247, 245);
  doc.text(`Date: ${currentDate}  •  AI-Generated Patient Preparation Sheet`, textX, 19.5);

  y = 35;

  // Patient Box
  doc.setFillColor(247, 250, 252);
  doc.setDrawColor(220, 230, 237);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(21, 59, 80);
  doc.text(`Patient Name: ${patientName}`, margin + 4, y + 7);
  doc.text(`Age: ${patientAge}`, margin + 75, y + 7);
  doc.text(`Gender: ${patientGender}`, margin + 125, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(37, 55, 70);
  doc.text(`Reported Duration: ${reportedDuration}   |   Modality: ${type === 'skin' ? 'Skin Analysis' : 'Symptom Triage'}`, margin + 4, y + 13.5);
  y += 24;

  // Reported Symptoms
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(21, 59, 80);
  doc.text('1. PATIENT-REPORTED SYMPTOMS & TIMELINE', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(37, 55, 70);
  const symLine = `Noted Symptoms/Sensations: ${reportedSymptoms.join(', ') || 'See notes'}`;
  const symLines = doc.splitTextToSize(symLine, contentWidth);
  doc.text(symLines, margin, y);
  y += symLines.length * 4.5 + 2;

  if (reportedDescription) {
    const noteLines = doc.splitTextToSize(`Patient Notes: "${reportedDescription}"`, contentWidth);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 4.5 + 4;
  }

  // Possible Conditions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(21, 59, 80);
  doc.text('2. PRELIMINARY POSSIBILITIES TO DISCUSS WITH PHYSICIAN', margin, y);
  y += 6;

  if (type === 'symptom' && symptomReport) {
    const sumLines = doc.splitTextToSize(symptomReport.summary, contentWidth);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(sumLines, margin, y);
    y += sumLines.length * 4.5 + 3;

    symptomReport.possibleCauses.forEach((c, idx) => {
      const cLines = doc.splitTextToSize(`${idx + 1}. ${c.name} (${c.likelihoodNote}): ${c.description}`, contentWidth - 4);
      doc.text(cLines, margin + 2, y);
      y += cLines.length * 4.5 + 2;
    });
  } else if (type === 'skin' && skinReport) {
    const sumLines = doc.splitTextToSize(skinReport.assessmentSummary, contentWidth);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(sumLines, margin, y);
    y += sumLines.length * 4.5 + 3;

    skinReport.possibleConditions.forEach((c, idx) => {
      const cLines = doc.splitTextToSize(`${idx + 1}. ${c.name}: ${c.description}`, contentWidth - 4);
      doc.text(cLines, margin + 2, y);
      y += cLines.length * 4.5 + 2;
    });
  }

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(21, 59, 80);
  doc.text('3. KEY QUESTIONS FOR YOUR DOCTOR APPOINTMENT', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const questions =
    type === 'symptom'
      ? symptomReport?.suggestedDoctorQuestions || [
          'Could my symptoms be caused by any of the possibilities listed above?',
          'Are any diagnostic swabs or blood tests recommended today?',
          'What warning signs should prompt me to seek urgent care?',
        ]
      : skinReport?.suggestedDoctorQuestions || [
          'Would you recommend examining this spot under a polarized dermatoscope?',
          'Does this lesion warrant a skin biopsy or scraping?',
          'What gentle skincare regimen is safe while we monitor this area?',
        ];
  questions.forEach((q, i) => {
    const qLines = doc.splitTextToSize(`${i + 1}. ${q}`, contentWidth - 4);
    doc.text(qLines, margin + 2, y);
    y += qLines.length * 4.5 + 2;
  });

  // Footer
  doc.setDrawColor(220, 230, 237);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
  doc.setFontSize(7.5);
  doc.setTextColor(104, 121, 134);
  doc.text(
    'DermaDetect AI • Educational Consultation Preparation Sheet • Developed by Fizza Amin and Muhammad Faizan Ud Din',
    margin,
    pageHeight - 8.5
  );

  doc.save(`DermaDetect-Doctor-Visit-Summary-${Date.now()}.pdf`);
}

/**
 * Triggers printing in an iframe-friendly manner by using a hidden print frame
 * and falling back to window.print().
 */
export function triggerIframeSafePrint(htmlContent: string): void {
  try {
    const existingFrame = document.getElementById('dermadetect-print-frame');
    if (existingFrame && existingFrame.parentNode) {
      existingFrame.parentNode.removeChild(existingFrame);
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'dermadetect-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const frameDoc = iframe.contentWindow?.document;
    if (frameDoc && iframe.contentWindow) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          window.print();
        }
      }, 350);
    } else {
      window.print();
    }
  } catch {
    window.print();
  }
}
