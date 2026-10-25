import React, { useRef, useState, useEffect } from 'react';
import {
  Upload,
  X,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Lock,
  Loader2,
} from 'lucide-react';
import { motion } from 'motion/react';
import defaultPosterImg from '../../assets/images/derm_hero_consultation_1791868208694.jpg';

/* ============================================================
   1. PREMIUM BUTTON
   ============================================================ */
export interface MedicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'navy' | 'teal' | 'light-teal' | 'outline' | 'urgent' | 'ghost' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const MedicalButton: React.FC<MedicalButtonProps> = ({
  variant = 'blue',
  size = 'md',
  icon,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2458F5] relative overflow-hidden';

  const variants: Record<string, string> = {
    blue:        'bg-[#2458F5] hover:bg-[#1a3fcc] text-white shadow-[0_4px_16px_rgba(36,88,245,0.3)] hover:shadow-[0_8px_28px_rgba(36,88,245,0.4)] hover:-translate-y-0.5',
    navy:        'bg-[#10264D] hover:bg-[#0c1e3d] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5',
    teal:        'bg-[#2458F5] hover:bg-[#1a3fcc] text-white shadow-[0_4px_16px_rgba(36,88,245,0.3)] hover:-translate-y-0.5',
    'light-teal':'bg-[#EAF2FF] hover:bg-[#DDE8FF] text-[#10264D] hover:-translate-y-0.5',
    outline:     'bg-white hover:bg-[#F7FAFF] text-[#17253B] border-[1.5px] border-[#E7EDF5] hover:border-[#2458F5] hover:text-[#2458F5] shadow-sm hover:-translate-y-0.5',
    urgent:      'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5',
    ghost:       'bg-transparent hover:bg-[#F7FAFF] text-[#64748B] hover:text-[#17253B]',
  };

  const sizes: Record<string, string> = {
    sm: 'min-h-[40px] px-4 py-2 text-xs',
    md: 'min-h-[48px] px-5 py-2.5 text-sm',
    lg: 'min-h-[54px] px-7 py-3.5 text-[0.9375rem]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
};

/* ============================================================
   2. PREMIUM CARD
   ============================================================ */
export interface MedicalCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverEffect?: boolean;
  variant?: 'default' | 'blue' | 'glass';
}

export const MedicalCard: React.FC<MedicalCardProps> = ({
  children,
  className = '',
  padding = 'md',
  onClick,
  hoverEffect = true,
  variant = 'default',
}) => {
  const padMap = { sm: 'p-5', md: 'p-6 sm:p-8', lg: 'p-8 sm:p-10' };

  const variantMap: Record<string, string> = {
    default: 'bg-white border border-[#E7EDF5]',
    blue:    'bg-gradient-to-br from-[#EAF2FF] to-[#DDF7FA] border border-[#DDE8FF]',
    glass:   'bg-white/80 backdrop-blur-md border border-white/60',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`${variantMap[variant]} rounded-2xl shadow-sm transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-md hover:border-[#D4DCE8] hover:-translate-y-0.5' : ''
      } ${padMap[padding]} ${onClick ? 'cursor-pointer hover:border-[#2458F5]/40' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================
   3. PREMIUM INPUT
   ============================================================ */
export interface MedicalInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  helperText?: string;
  error?: string;
  prefix?: React.ReactNode;
}

export const MedicalInput: React.FC<MedicalInputProps> = ({
  label,
  helperText,
  error,
  prefix,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-sm font-semibold text-[#10264D]">{label}</label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
            {prefix}
          </div>
        )}
        <input
          className={`w-full min-h-[48px] ${prefix ? 'pl-10' : 'px-4'} pr-4 py-2.5 text-sm rounded-xl border-[1.5px] ${
            error ? 'border-red-400 focus:ring-red-200' : 'border-[#E7EDF5] focus:border-[#2458F5]'
          } bg-white text-[#17253B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2458F5]/15 transition-all ${className}`}
          {...props}
        />
      </div>
      {helperText && !error && (
        <p className="text-xs text-[#64748B]">{helperText}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

/* ============================================================
   4. PREMIUM TEXTAREA
   ============================================================ */
export interface MedicalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
}

export const MedicalTextarea: React.FC<MedicalTextareaProps> = ({
  label,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-sm font-semibold text-[#10264D]">{label}</label>
      )}
      <textarea
        className={`w-full px-4 py-3 text-sm rounded-xl border-[1.5px] border-[#E7EDF5] bg-white text-[#17253B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2458F5]/15 focus:border-[#2458F5] transition-all ${className}`}
        {...props}
      />
      {helperText && (
        <p className="text-xs text-[#64748B]">{helperText}</p>
      )}
    </div>
  );
};

/* ============================================================
   5. PREMIUM BADGE
   ============================================================ */
export interface MedicalBadgeProps {
  tone?: 'blue' | 'teal' | 'navy' | 'warning' | 'urgent' | 'muted' | 'green';
  children: React.ReactNode;
  dot?: boolean;
}

export const MedicalBadge: React.FC<MedicalBadgeProps> = ({ tone = 'blue', children, dot }) => {
  const toneMap: Record<string, string> = {
    blue:    'bg-[#EAF2FF] text-[#2458F5] border border-[#DDE8FF]',
    teal:    'bg-[#EAF2FF] text-[#2458F5] border border-[#DDE8FF]',
    navy:    'bg-[#F7FAFF] text-[#10264D] border border-[#E7EDF5]',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    urgent:  'bg-red-50 text-red-700 border border-red-200',
    muted:   'bg-[#F7FAFF] text-[#64748B] border border-[#E7EDF5]',
    green:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };

  const dotMap: Record<string, string> = {
    blue: 'bg-[#2458F5]', teal: 'bg-[#2458F5]', navy: 'bg-[#10264D]',
    warning: 'bg-amber-500', urgent: 'bg-red-500', muted: 'bg-[#64748B]', green: 'bg-emerald-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${toneMap[tone]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotMap[tone]}`} />}
      {children}
    </span>
  );
};

/* ============================================================
   6. PREMIUM ALERT
   ============================================================ */
export interface MedicalAlertProps {
  tone?: 'info' | 'warning' | 'urgent' | 'success';
  title?: string;
  children: React.ReactNode;
  centered?: boolean;
}

export const MedicalAlert: React.FC<MedicalAlertProps> = ({
  tone = 'info',
  title,
  children,
  centered = false,
}) => {
  const styles = {
    info: {
      wrapper: 'bg-[#EAF2FF]/80 border border-[#DDE8FF] text-[#17253B]',
      icon: <Info className="w-5 h-5 text-[#2458F5] shrink-0 mt-0.5" />,
    },
    warning: {
      wrapper: 'bg-amber-50 border border-amber-200 text-[#17253B]',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
    },
    urgent: {
      wrapper: 'bg-red-50 border border-red-200 text-[#17253B]',
      icon: <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />,
    },
    success: {
      wrapper: 'bg-emerald-50 border border-emerald-200 text-[#17253B]',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
    },
  };

  const s = styles[tone];
  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl flex ${
        centered ? 'flex-col items-center text-center' : 'items-start'
      } gap-3.5 ${s.wrapper}`}
    >
      {s.icon}
      <div className="space-y-1 text-sm leading-relaxed w-full">
        {title && <div className="font-bold text-[#10264D]">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

/* ============================================================
   7. PREMIUM UPLOAD DROPZONE
   ============================================================ */
export interface MedicalUploadProps {
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  helperText?: string;
}

export const MedicalUploadDropzone: React.FC<MedicalUploadProps> = ({
  previewUrl,
  onFileSelect,
  onClear,
  helperText = 'Hold camera 10–15 cm away in natural daylight. Supports JPG, PNG, WEBP up to 10MB.',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        className="hidden"
      />

      {!previewUrl ? (
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          animate={{
            borderColor: dragActive ? '#2458F5' : '#E7EDF5',
            backgroundColor: dragActive ? 'rgba(36,88,245,0.04)' : '#F7FAFF',
          }}
          transition={{ duration: 0.2 }}
          className="p-10 rounded-2xl border-2 border-dashed text-center cursor-pointer space-y-4 group"
        >
          <motion.div
            animate={{ scale: dragActive ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className="w-14 h-14 rounded-2xl bg-[#EAF2FF] text-[#2458F5] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200"
          >
            <Upload className="w-7 h-7" />
          </motion.div>
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-[#10264D]">
              Drop your skin image here, or{' '}
              <span className="text-[#2458F5] underline underline-offset-2">browse</span>
            </p>
            <p className="text-xs text-[#64748B]">{helperText}</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            className="btn btn-navy btn-sm mx-auto"
          >
            Browse Image
          </button>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2458F5]">
            <Lock className="w-3.5 h-3.5" />
            <span>Processed privately · Never stored</span>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-[#E7EDF5] bg-[#F7FAFF] max-h-72 flex items-center justify-center p-3">
            <img
              src={previewUrl}
              alt="Uploaded skin preview"
              referrerPolicy="no-referrer"
              className="max-h-64 w-auto object-contain rounded-xl"
            />
            {/* scan overlay */}
            <div className="scan-container absolute inset-0 rounded-2xl pointer-events-none" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7FAFF] text-[#17253B] border border-[#E7EDF5] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#2458F5]" />
              Replace Image
            </button>
            <button
              type="button"
              onClick={onClear}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-[#E7EDF5] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   8. PREMIUM REPORT SECTION
   ============================================================ */
export interface MedicalReportSectionProps {
  index?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  centeredHeader?: boolean;
  accentColor?: string;
}

export const MedicalReportSection: React.FC<MedicalReportSectionProps> = ({
  index,
  title,
  subtitle,
  icon,
  children,
  centeredHeader = false,
  accentColor,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E7EDF5] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5"
    >
      <div
        className={`flex flex-col ${
          centeredHeader ? 'items-center text-center' : 'sm:flex-row sm:items-start justify-between'
        } gap-3 border-b border-[#F0F5FF] pb-4`}
      >
        <div className={`space-y-1 ${centeredHeader ? 'flex flex-col items-center' : ''}`}>
          <div className={`flex items-center gap-2 ${centeredHeader ? 'justify-center' : ''}`}>
            {icon && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: accentColor ? `${accentColor}18` : '#EAF2FF', color: accentColor || '#2458F5' }}
              >
                {icon}
              </div>
            )}
            {index && (
              <span className="text-xs font-bold text-[#2458F5] tabular-nums bg-[#EAF2FF] px-2 py-0.5 rounded-lg">
                {index}
              </span>
            )}
            <h3 className="text-lg font-bold text-[#10264D] font-display">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}
        </div>
      </div>
      <div>{children}</div>
    </motion.section>
  );
};

/* ============================================================
   9. PREMIUM MODAL
   ============================================================ */
export interface MedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const MedicalModal: React.FC<MedicalModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10264D]/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#E7EDF5] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7EDF5]">
          <h3 className="text-lg font-bold text-[#10264D] font-display">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#10264D] hover:bg-[#F7FAFF] cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
};

/* ============================================================
   10. PREMIUM VIDEO SHOWCASE
   ============================================================ */
export interface MedicalVideoShowcaseProps {
  src: string;
  poster?: string;
  fallbackImage?: string;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  lazy?: boolean;
  objectPosition?: string;
  aspectRatioClass?: string;
  showOverlayText?: boolean;
  className?: string;
}

export const MedicalVideoShowcase: React.FC<MedicalVideoShowcaseProps> = ({
  src,
  poster = defaultPosterImg,
  fallbackImage = defaultPosterImg,
  badgeText,
  title,
  subtitle,
  objectPosition = 'center center',
  aspectRatioClass = 'aspect-video',
  showOverlayText = true,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    const p = v.play();
    if (p !== undefined) {
      p.catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [src]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl overflow-hidden border border-[#E7EDF5] bg-white shadow-sm ${className}`}
    >
      <div className={`relative ${aspectRatioClass} w-full overflow-hidden bg-[#10264D]`}>
        {hasError ? (
          <img
            src={fallbackImage || poster}
            alt={title || 'Clinical healthcare visual'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            style={{ objectPosition }}
          />
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay loop muted playsInline preload="auto"
            onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
            style={{ objectPosition }}
          />
        )}
      </div>
      {showOverlayText && (badgeText || title || subtitle) && (
        <div className="px-5 py-4 sm:px-6 sm:py-5 bg-white border-t border-[#E7EDF5] text-left space-y-1">
          {badgeText && <div className="text-xs font-semibold text-[#2458F5]">{badgeText}</div>}
          {title && <h3 className="text-base sm:text-lg font-bold text-[#10264D] font-display leading-snug">{title}</h3>}
          {subtitle && <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{subtitle}</p>}
        </div>
      )}
    </motion.div>
  );
};

/* ============================================================
   11. PREMIUM SKELETON / LOADING
   ============================================================ */
export const MedicalAnalysisSkeleton: React.FC<{ title?: string; subtitle?: string }> = ({
  title = 'Reviewing your information...',
  subtitle = 'Preparing possible considerations, supportive care tips, and questions for your doctor.',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="status"
      aria-live="polite"
      className="bg-white border border-[#E7EDF5] rounded-2xl p-8 sm:p-10 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[#F0F5FF] pb-6">
        <div className="relative w-14 h-14 rounded-2xl bg-[#EAF2FF] flex items-center justify-center shrink-0">
          {/* Animated medical spinner */}
          <div className="w-8 h-8 border-3 border-[#DDE8FF] border-t-[#2458F5] rounded-full animate-spin" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-[#2458F5]/10 animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-[#10264D] font-display">{title}</h3>
          <p className="text-sm text-[#64748B]">{subtitle}</p>
        </div>
      </div>

      {/* Skeleton content */}
      <div className="space-y-4 animate-pulse">
        <div className="h-3 skeleton w-2/5 rounded-lg" />
        <div className="h-20 skeleton w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 skeleton rounded-xl" />
          ))}
        </div>
        <div className="h-3 skeleton w-1/3 rounded-lg" />
      </div>

      {/* Scanning line visual */}
      <div className="relative h-1 w-full bg-[#EAF2FF] rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-[#2458F5] to-transparent rounded-full"
          animate={{ x: ['0%', '300%', '0%'] }}
          transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};
