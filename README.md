# DermaDetect AI

**AI-Powered Healthcare Awareness and Preliminary Screening Platform**  
*Submitted for UnivaBio: Artificial Intelligence for Human Health*  
*Powered by Google Gemini 3.8 Flash via Google AI Studio API*

---

## 1. Project Overview & Vision

DermaDetect AI is an educational, intelligent health-awareness and preliminary screening website designed to help individuals understand common systemic symptoms and assess skin concerns through multimodal artificial intelligence.

It provides:
- **AI Symptom Checker**: Multi-step symptom assessment returning differential possibilities, safe self-care, doctor appointment criteria, and urgent emergency red flag alerts.
- **AI Skin Disease Detection**: Multimodal computer vision screening analyzing photograph morphology (pigment, borders, texture, distribution) with strict clinical uncertainty calibration and ABCDE criteria monitoring.
- **Copy Report & Physician Export**: One-click formatted report clipboard copy tool to easily share clinical summaries with doctors or family.
- **AI Doctor Consultation ("Dr. Sarah Lin, MD")**: Conversational bedside clinical educator providing empathetic answers, explaining medical terminology, and coaching users on questions to ask during in-person visits.
- **Interactive Judging Evaluation Lab**: Curated benchmark cases (Atopic Dermatitis, Atypical Melanocytic Lesion, Acute Urticaria, Common Cold, and Emergency Cardiac Triage) for instant demonstration during competition evaluation.
- **Doctor Discussion Summary Sheet**: Formatted, exportable, and printable consultation card ready for patient-physician dialogue.
- **Emergency Safeguard Intercept**: Immediate fast-path guidance for life-threatening symptoms (911 / 112 emergency calling).

---

## 2. Medical Ethics & Safeguards

- **No Confirmed Diagnoses**: Never declares certainty or definitive disease tags; provides educational differential topics.
- **Cancer & Malignancy Protocol**: Does not claim to diagnose or rule out melanoma from photographs. Any lesion meeting ABCDE criteria triggers prompt dermatologist referral.
- **Non-Prescriptive**: Prohibits prescribing prescription pharmaceuticals, antibiotics, or personalized dosages.
- **Zero Image Retention**: Uploaded photographs and symptom inquiries are processed in-memory and discarded. Zero persistent database storage.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, tsx
- **AI Provider**: Google Gemini (`@google/genai` SDK, model `gemini-3.8-flash`)
- **Build Tool**: Vite 8

---

## 4. Architecture & Security

- **Server-Side API Proxy**: `server.ts` handles all `@google/genai` requests on the backend.
- **Zero Browser Key Exposure**: `GEMINI_API_KEY` is never sent to the browser or bundled in frontend client assets.
- **Strict Response Schemas**: All Gemini outputs are constrained via `responseSchema` (Type.OBJECT) to guarantee all triage sections exist.

---

## 5. Development & Deployment

```bash
# Install dependencies
npm install

# Run full-stack dev server on port 3000
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
