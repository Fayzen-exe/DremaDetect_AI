import { SymptomFormData, SymptomReport, SkinFormData, SkinReport } from '../types/health';

export async function checkSymptoms(formData: SymptomFormData): Promise<SymptomReport> {
  const response = await fetch('/api/check-symptoms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to analyze symptoms. Please check server connection.');
  }

  return data.data;
}

export async function analyzeSkin(formData: SkinFormData): Promise<SkinReport> {
  const response = await fetch('/api/analyze-skin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to analyze skin image. Please try again.');
  }

  return data.data;
}

export interface DoctorConsultationResponse {
  reply: string;
  sources?: Array<{ title: string; uri: string }>;
}

export async function consultDoctor(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  reportContext?: any,
  reportType?: 'symptom' | 'skin',
  enableSearchGrounding: boolean = true
): Promise<DoctorConsultationResponse> {
  const response = await fetch('/api/consult-doctor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, reportContext, reportType, enableSearchGrounding }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to consult Dr. Fizza. Please try again.');
  }

  return {
    reply: data.reply,
    sources: data.sources || [],
  };
}
