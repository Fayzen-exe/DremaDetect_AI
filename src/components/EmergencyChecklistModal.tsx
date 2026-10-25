import React from 'react';
import { X, PhoneCall, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyChecklistModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const redFlags = [
    {
      category: 'Cardiac & Circulation',
      signs: [
        'Crushing chest pressure, tightness, or pain spreading to jaw, neck, back, or left arm',
        'Sudden cold sweat combined with severe dizziness or sudden fainting (syncope)',
        'Irregular, pounding, or racing heartbeat accompanied by extreme anxiety or breathlessness',
      ],
    },
    {
      category: 'Respiratory',
      signs: [
        'Severe shortness of breath where speaking full sentences is impossible',
        'Stridor, acute wheezing, or feeling like your airway or throat is swelling shut',
        'Bluish or grey tint around lips, face, fingernails, or tongue (cyanosis)',
      ],
    },
    {
      category: 'Neurological & Consciousness',
      signs: [
        'Sudden facial droop, arm weakness, slurred speech, or difficulty comprehending speech (FAST criteria)',
        'New sudden acute confusion, disorientation, lethargy, or inability to awaken',
        'Severe sudden "thunderclap" headache unlike any previously experienced',
      ],
    },
    {
      category: 'Dermatological Emergencies',
      signs: [
        'Rapidly spreading skin redness, severe heat, and excruciating pain out of proportion to exam',
        'Widespread blistering or peeling of skin resembling a severe scald (suspected SJS/TEN)',
        'Fever accompanying purpuric or petechial dark purple spots that do not blanch under pressure',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E7EDF5] overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#881337] text-white p-6 flex items-start justify-between z-10 border-b border-rose-900/40">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xs">
              <ShieldAlert className="w-6 h-6 text-rose-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                Emergency Warning Signs & Action Guide
              </h3>
              <p className="text-xs text-rose-200 mt-0.5">
                Life-threatening indicators requiring immediate emergency intervention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Urgent Dispatch Action Card */}
          <div className="bg-red-50/90 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-950">
                  Are you experiencing any signs listed below?
                </p>
                <p className="text-xs text-red-800 mt-0.5">
                  Do not complete online questionnaires. Call emergency responders immediately.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:911"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call 911 (US)
              </a>
              <a
                href="tel:112"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#10264D] hover:bg-[#0c1e3d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Call 112 (Global)
              </a>
            </div>
          </div>

          {/* Categorized Red Flag Signs */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#10264D] uppercase tracking-wider">
              Critical Warning Symptoms Breakdown
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redFlags.map((group, idx) => (
                <div key={idx} className="bg-[#F7FAFF] border border-[#E7EDF5] rounded-2xl p-4 sm:p-5 space-y-2.5">
                  <span className="text-xs font-bold text-[#10264D] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {group.category}
                  </span>
                  <ul className="space-y-2 text-xs text-[#64748B]">
                    {group.signs.map((sign, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Steps While Awaiting Help */}
          <div className="bg-[#F7FAFF] border border-[#E7EDF5] p-5 rounded-2xl space-y-2.5 text-xs text-[#17253B]">
            <h5 className="font-bold text-[#10264D] text-xs uppercase tracking-wider">
              Immediate Safety Protocol While Help Arrives:
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[#64748B]">
              <li>Stay still in a safe, supported resting posture; avoid physical exertion.</li>
              <li>Unlock your entrance door so paramedics can enter quickly without delay.</li>
              <li>Alert anyone in your vicinity or building to remain beside you.</li>
              <li>Keep all current medications and known allergies readily available for the medical team.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#E7EDF5] px-6 py-4 bg-[#F7FAFF] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-[#10264D] bg-white border border-[#E7EDF5] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
};
