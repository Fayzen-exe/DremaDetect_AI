export interface ConditionDetailedProfile {
  name: string;
  likelihoodNote: string; // Qualitative only (e.g. "Possible Consideration", "Plausible Explanation", "Needs Clinical Evaluation") - no percentages
  whatItIs: string;
  commonCausesAndRiskFactors: string[];
  typicalSymptoms: string[];
  howItRelatesToUser: string;
  alternativeExplanations: string[];
  missingInformation: string[];
  howClinicianEvaluates: string;
  urgencyLevel?: string;
}

export interface MedicationOptionDetail {
  categoryOrName: string;
  generalPurpose: string;
  availabilityStatus: string; // e.g. "Over-the-Counter (OTC) — Consult Pharmacist" or "Prescription-Only (Requires Clinician Evaluation)"
  commonSideEffects: string[];
  contraindicationsAndInteractions: string[];
  consultationNote: string;
}

export interface StructuredMedicationInformation {
  suitabilityBanner: string;
  generalEducationalNote: string;
  options: MedicationOptionDetail[];
  specialPopulationSafeguards: string[];
}

export interface SupportingInformationDetail {
  userReportedSummary: string[];
  visibleInImageSummary?: string[];
  imageVsReportedDistinction?: string;
}

export interface UncertaintyAndAlternativesDetail {
  uncertaintyExplanation: string;
  alternativePossibilities: string[];
  missingClinicalInformation: string[];
  whyInPersonExamIsRequired: string;
}

export interface StructuredSelfCareGuidance {
  supportiveMeasures: string[];
  recoveryExpectations: string;
  signsOfWorsening: string[];
}

export interface PossibleCause {
  name: string;
  description: string;
  likelihoodNote: string;
  matchingSymptoms?: string[];
  keyDifferentiators?: string;
  urgencyLevel?: 'Routine Outpatient' | 'Prompt Care (24-48h)' | 'Urgent Evaluation' | string;
  whatItIs?: string;
  commonCauses?: string[];
  typicalSymptoms?: string[];
  howClinicianEvaluates?: string;
  alternativeExplanations?: string;
}

export interface MedicationSafetyGuidance {
  safeOtcs?: string[];
  precautionsAndAllergies?: string[];
  whatToAvoid?: string[];
}

export interface PatientDemographics {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
}

export interface SymptomReport {
  caseId?: string;
  timestamp?: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  triageLevel?: 'routine' | 'prompt' | 'emergency';
  summary: string;
  assessmentSummary?: string;
  isEmergency: boolean;
  emergencyWarning: string | null;
  possibleCauses: PossibleCause[];
  possibleConditions?: PossibleCause[];
  conditionDescriptions?: ConditionDetailedProfile[];
  supportingInformation?: SupportingInformationDetail;
  uncertaintyAndAlternatives?: UncertaintyAndAlternativesDetail;
  selfCareGuidance?: StructuredSelfCareGuidance;
  medicationInformation?: StructuredMedicationInformation;
  contraindicationsAndWarnings?: string[];
  professionalCareGuidance?: string[];
  emergencyWarnings?: string[];
  followUpGuidance?: string[];
  aiDisclosure?: string;
  missingInformation?: string[];
  recommendedSelfCare: string[];
  medicationSafetyGuidance?: MedicationSafetyGuidance;
  whenToSeeDoctor: string[];
  urgentWarningSigns: string[];
  nextSteps: string[];
  suggestedDoctorQuestions?: string[];
  medicalDisclaimer: string;
}

export interface VisibleSkinFeatures {
  primaryLesionType?: string;
  colorAndPigmentation: string;
  shapeAndBorders: string;
  textureAndSurface: string;
  distribution: string;
  elevation?: string;
}

export interface AbcdeMelanomaAssessment {
  isPigmentedLesion: boolean;
  asymmetryNote: string;
  borderNote: string;
  colorNote: string;
  diameterNote: string;
  evolutionNote: string;
  biopsyGuidance: string;
}

export interface PossibleSkinCondition {
  name: string;
  likelihoodNote?: string;
  description: string;
  generalCharacteristics: string;
  visualMatchingPoints?: string[];
  typicalUrgency?: string;
  whatItIs?: string;
  commonCauses?: string[];
  typicalSymptoms?: string[];
  howClinicianEvaluates?: string;
  alternativeExplanations?: string;
}

export interface SkinReport {
  caseId?: string;
  timestamp?: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  triageLevel?: 'routine' | 'prompt' | 'emergency';
  assessmentSummary: string;
  isUrgentReviewNeeded: boolean;
  visibleFeatures: VisibleSkinFeatures;
  possibleConditions: PossibleSkinCondition[];
  conditionDescriptions?: ConditionDetailedProfile[];
  supportingInformation?: SupportingInformationDetail;
  uncertaintyAndAlternatives?: UncertaintyAndAlternativesDetail;
  selfCareGuidance?: StructuredSelfCareGuidance;
  medicationInformation?: StructuredMedicationInformation;
  contraindicationsAndWarnings?: string[];
  professionalCareGuidance?: string[];
  emergencyWarnings?: string[];
  followUpGuidance?: string[];
  aiDisclosure?: string;
  abcdeMelanomaAssessment?: AbcdeMelanomaAssessment;
  confidenceAndLimitations: string;
  recommendedSpecialty?: string;
  generalCareGuidance: string[];
  thingsToAvoid?: string[];
  whenToSeeDermatologist: string[];
  urgentRedFlags?: string[];
  assessmentLimitations: string[];
  suggestedDoctorQuestions?: string[];
  medicalDisclaimer: string;
}

export interface SymptomFormData {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  mainComplaint?: string;
  symptoms: string[];
  description: string;
  duration: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  progression?: 'sudden' | 'gradual' | 'fluctuating' | 'improving' | string;
  ageGroup: 'infant' | 'child' | 'adolescent' | 'adult' | 'senior' | string;
  biologicalSex?: 'female' | 'male' | 'other' | 'prefer-not-to-say' | string;
  relevantConditions?: string[];
  currentMedications?: string;
  knownAllergies?: string;
  recentHistory?: string;
  followUpAnswers?: Record<string, string>;
  hasEmergencySymptoms: boolean;
}

export interface SkinFormData {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  imageBase64: string;
  mimeType: string;
  notes: string;
  bodyLocation?: string;
  duration: string;
  symptoms: string[];
  changesOverTime?: string;
  priorTreatments?: string;
}

export interface ReportIntakeContext {
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  mainComplaint?: string;
  symptoms?: string[];
  description?: string;
  duration?: string;
  severity?: string;
  ageGroup?: string;
  biologicalSex?: string;
  bodyLocation?: string;
  changesOverTime?: string;
  priorTreatments?: string;
  knownAllergies?: string;
  currentMedications?: string;
  relevantConditions?: string[];
}

export interface DemoCase {
  id: string;
  type: 'skin' | 'symptom';
  title: string;
  subtitle: string;
  badge: string;
  urgency: 'routine' | 'prompt' | 'emergency';
  summary: string;
  image?: string;
  formData: any;
  precomputedReport?: any;
}
