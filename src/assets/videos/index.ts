import systemicTriageVideo from './Generated_Video_October_20__2026_-_10_07AM__1__7849a93b.mp4';
import clinicalOverviewVideo from './Generated_Video_October_20__2026_-_10_07AM__2__536d74fe.mp4';
import skinAnalysisVideo from './Generated_Video_October_20__2026_-_10_07AM_b9914446.mp4';

export {
  systemicTriageVideo,
  clinicalOverviewVideo,
  skinAnalysisVideo,
};

export const CLINICAL_VIDEOS_LIST = [
  {
    id: 'overview',
    src: clinicalOverviewVideo,
    category: 'Clinical Care & Guidance',
    title: 'Comprehensive Health & Symptom Understanding',
    subtitle:
      'Structured medical information that bridges everyday health questions and informed conversations with your doctor.',
    targetTab: 'about',
    ctaLabel: 'Learn About Our Approach',
  },
  {
    id: 'skin-scan',
    src: skinAnalysisVideo,
    category: 'Dermatology Observation',
    title: 'Detailed Skin Surface & Lesion Review',
    subtitle:
      'Evaluates visible border contours, pigment consistency, surface texture, and ABCDE educational criteria privately.',
    targetTab: 'skin',
    ctaLabel: 'Analyse a Skin Image',
  },
  {
    id: 'symptom-triage',
    src: systemicTriageVideo,
    category: 'Symptom Evaluation',
    title: 'Step-by-Step Symptom & Timeline Assessment',
    subtitle:
      'Reviews symptom onset, progression, and warning signs to help you prepare a clear summary for your physician.',
    targetTab: 'symptoms',
    ctaLabel: 'Check My Symptoms',
  },
];
