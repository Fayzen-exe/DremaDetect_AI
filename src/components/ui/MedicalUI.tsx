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
} from 'lucide-react';
import { motion } from 'motion/react';
import defaultPosterImg from '../../assets/images/derm_hero_consultation_1791868208694.jpg';

/* 1. REUSABLE BUTTON WITH SMOOTH EDITORIAL INTERACTIVE STATES */
export interface MedicalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'navy' | 'teal' | 'light-teal' | 'outline' | 'urgent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const MedicalButton: React.FC<MedicalButtonProps> = ({
  variant = 'navy',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#249A96]';

  const variantStyles: Record<string, string> = {
    navy: 'bg-[#153B50] hover:bg-[#102d3e] text-white shadow-2xs hover:shadow-sm',
    teal: 'bg-[#249A96] hover:bg-[#1d807c] text-white shadow-2xs hover:shadow-sm',
    'light-teal': 'bg-[#E9F7F5] hover:bg-[#d5f0ec] text-[#153B50]',
    outline: 'bg-white hover:bg-[#F7FAFC] text-[#253746] border border-[#DDE5ED] hover:border-[#249A96]',
    urgent: 'bg-[#C83F49] hover:bg-[#ad323b] text-white shadow-2xs hover:shadow-sm',
    ghost: 'bg-transparent hover:bg-[#F7FAFC] text-[#687986] hover:text-[#153B50]',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'min-h-[40px] px-4 py-2 text-xs',
    md: 'min-h-[46px] px-5 py-2.5 text-sm',
    lg: 'min-h-[52px] px-6 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

/* 2. REUSABLE CARD WITH SMOOTH REVEAL & GENTLE ELEVATION */
export interface MedicalCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const MedicalCard: React.FC<MedicalCardProps> = ({
  children,
  className = '',
  padding = 'md',
  onClick,
  hoverEffect = true,
}) => {
  const padMap = {
    sm: 'p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs transition-all duration-300 ${
        hoverEffect ? 'hover:shadow-md hover:border-[#DDE5ED] hover:-translate-y-0.5' : ''
      } ${padMap[padding]} ${
        onClick ? 'cursor-pointer hover:border-[#249A96]/60' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

/* 3. REUSABLE INPUT FIELD */
export interface MedicalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const MedicalInput: React.FC<MedicalInputProps> = ({
  label,
  helperText,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-sm font-semibold text-[#153B50]">
          {label}
        </label>
      )}
      <input
        className={`w-full min-h-[46px] px-4 py-2.5 text-sm rounded-xl border ${
          error ? 'border-[#C83F49]' : 'border-[#DDE5ED]'
        } bg-white text-[#253746] placeholder:text-[#687986]/70 focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-[#687986]">{helperText}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-[#C83F49]">{error}</p>
      )}
    </div>
  );
};

/* 4. REUSABLE TEXTAREA */
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
        <label className="block text-sm font-semibold text-[#153B50]">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 text-sm rounded-xl border border-[#DDE5ED] bg-white text-[#253746] placeholder:text-[#687986]/70 focus:outline-none focus:ring-2 focus:ring-[#249A96] focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {helperText && <p className="text-xs text-[#687986]">{helperText}</p>}
    </div>
  );
};

/* 5. REUSABLE BADGE / STATUS LABEL */
export interface MedicalBadgeProps {
  tone?: 'teal' | 'navy' | 'warning' | 'urgent' | 'muted';
  children: React.ReactNode;
}

export const MedicalBadge: React.FC<MedicalBadgeProps> = ({
  tone = 'teal',
  children,
}) => {
  const toneStyles = {
    teal: 'text-[#249A96] bg-[#E9F7F5]',
    navy: 'text-[#153B50] bg-[#F7FAFC] border border-[#DDE5ED]',
    warning: 'text-[#9A6210] bg-[#E7A23B]/15',
    urgent: 'text-[#C83F49] bg-[#C83F49]/12',
    muted: 'text-[#687986] bg-[#F7FAFC]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold tracking-tight whitespace-nowrap shrink-0 ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
};

/* 6. REUSABLE ALERT */
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
      wrapper: 'bg-[#E9F7F5]/70 border border-[#249A96]/30 text-[#153B50]',
      icon: <Info className="w-5 h-5 text-[#249A96] shrink-0 mt-0.5" />,
    },
    warning: {
      wrapper: 'bg-[#E7A23B]/12 border border-[#E7A23B]/40 text-[#253746]',
      icon: <AlertTriangle className="w-5 h-5 text-[#E7A23B] shrink-0 mt-0.5" />,
    },
    urgent: {
      wrapper: 'bg-[#C83F49]/10 border border-[#C83F49]/40 text-[#253746]',
      icon: <ShieldAlert className="w-5 h-5 text-[#C83F49] shrink-0 mt-0.5" />,
    },
    success: {
      wrapper: 'bg-[#E9F7F5] border border-[#249A96]/40 text-[#153B50]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#249A96] shrink-0 mt-0.5" />,
    },
  };

  const current = styles[tone];

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl flex ${
        centered ? 'flex-col items-center text-center' : 'items-start'
      } gap-3.5 ${current.wrapper}`}
    >
      {current.icon}
      <div className="space-y-1 text-sm leading-relaxed w-full">
        {title && <div className="font-bold text-[#153B50]">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

/* 7. REUSABLE UPLOAD COMPONENT WITH BROWSE, REPLACE & REMOVE ACTIONS */
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
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer space-y-4 ${
            dragActive
              ? 'border-[#249A96] bg-[#E9F7F5]/60'
              : 'border-[#DDE5ED] hover:border-[#249A96] bg-[#F7FAFC]'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#153B50]">
              Drag and drop a skin image here, or browse from your device
            </p>
            <p className="text-xs text-[#687986]">{helperText}</p>
          </div>
          <div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 rounded-xl bg-[#153B50] hover:bg-[#102d3e] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Browse Image
            </button>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#249A96] pt-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Processed privately in memory · Never shared</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-[#DDE5ED] bg-[#F7FAFC] max-h-72 flex items-center justify-center p-2">
            <img
              src={previewUrl}
              alt="Uploaded skin preview"
              referrerPolicy="no-referrer"
              className="max-h-68 w-auto object-contain rounded-xl"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7FAFC] text-[#153B50] border border-[#DDE5ED] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#249A96]" />
              <span>Replace Image</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#C83F49]/10 text-[#C83F49] border border-[#DDE5ED] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* 8. REUSABLE REPORT SECTION */
export interface MedicalReportSectionProps {
  index?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  centeredHeader?: boolean;
}

export const MedicalReportSection: React.FC<MedicalReportSectionProps> = ({
  index,
  title,
  subtitle,
  icon,
  children,
  centeredHeader = false,
}) => {
  return (
    <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5">
      <div
        className={`flex flex-col ${
          centeredHeader ? 'items-center text-center' : 'sm:flex-row sm:items-start justify-between'
        } gap-3 border-b border-[#F1F5F9] pb-4`}
      >
        <div className={`space-y-1 ${centeredHeader ? 'flex flex-col items-center text-center' : ''}`}>
          <div className={`flex items-center gap-2 ${centeredHeader ? 'justify-center' : ''}`}>
            {index && (
              <span className="text-xs font-semibold text-[#249A96] tabular-nums">
                {index}.
              </span>
            )}
            {icon}
            <h3 className="text-lg font-bold text-[#153B50] font-display">
              {title}
            </h3>
          </div>
          {subtitle && <p className="text-xs text-[#687986]">{subtitle}</p>}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
};

/* 9. REUSABLE MODAL */
export interface MedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const MedicalModal: React.FC<MedicalModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#153B50]/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white border border-[#DDE5ED] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-lg font-bold text-[#153B50] font-display">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#687986] hover:text-[#153B50] hover:bg-[#F7FAFC] cursor-pointer"
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

/* 10. SEAMLESS AUTOPLAY AMBIENT VIDEO VISUAL (NO START/PAUSE BUTTONS, CONTINUOUS AUTOMATIC LOOP) */
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

  // Ensure automatic continuous playback whenever src mounts or changes
  useEffect(() => {
    setHasError(false);
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Retry muted playback if browser delayed initial autoplay
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
      className={`rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-sm ${className}`}
    >
      <div className={`relative ${aspectRatioClass} w-full overflow-hidden bg-[#153B50]`}>
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
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={(e) => {
              e.currentTarget.play().catch(() => {});
            }}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
            style={{ objectPosition }}
          />
        )}
      </div>

      {/* Clean Editorial Caption Below Video (No dark sci-fi overlay or player buttons) */}
      {showOverlayText && (badgeText || title || subtitle) && (
        <div className="px-5 py-4 sm:px-6 sm:py-5 bg-white border-t border-[#E2E8F0] text-left space-y-1">
          {badgeText && (
            <div className="text-xs font-semibold text-[#249A96]">
              {badgeText}
            </div>
          )}
          {title && (
            <h3 className="text-base sm:text-lg font-bold text-[#153B50] font-display leading-snug">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#687986] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

/* 11. REUSABLE SKELETON LOADER FOR PROCESSING */
export const MedicalAnalysisSkeleton: React.FC<{ title?: string; subtitle?: string }> = ({
  title = 'Reviewing your information...',
  subtitle = 'Preparing possible considerations, supportive care tips, and questions for your doctor.',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-2xs space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[#F1F5F9] pb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#E9F7F5] text-[#249A96] flex items-center justify-center shrink-0">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-[#153B50] font-display">{title}</h3>
          <p className="text-sm text-[#687986]">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-[#E9F7F5] rounded-lg w-1/3" />
        <div className="h-20 bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="h-28 bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl" />
          <div className="h-28 bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl" />
        </div>
      </div>
    </div>
  );
};
