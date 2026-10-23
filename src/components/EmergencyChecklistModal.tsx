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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-rose-900 text-white p-5 flex items-start justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                Emergency Warning Signs & Action Guide
              </h3>
              <p className="text-xs text-rose-200">
                Life-threatening indicators requiring immediate emergency intervention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-rose-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Urgent Dispatch Action Card */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-rose-950">
                  Are you experiencing any signs listed below?
                </p>
                <p className="text-xs text-rose-800">
                  Do not complete online questionnaires. Call emergency responders immediately.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:911"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call 911 (US)
              </a>
              <a
                href="tel:112"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Call 112 (EU/Global)
              </a>
            </div>
          </div>

          {/* Categorized Red Flag Signs */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Critical Warning Symptoms Breakdown
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redFlags.map((group, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    {group.category}
                  </span>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {group.signs.map((sign, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Steps While Awaiting Help */}
          <div className="bg-slate-100 p-4 rounded-xl space-y-2 text-xs text-slate-700">
            <h5 className="font-bold text-slate-900">
              Immediate Safety Protocol While Help Arrives:
            </h5>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Stay still in a safe, seated position; avoid physical exertion.</li>
              <li>Unlock your entrance door so paramedics can enter quickly.</li>
              <li>Alert anyone in your building or home to remain beside you.</li>
              <li>Keep all medications and allergies readily available for the emergency team.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
};
