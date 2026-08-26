export function Logo({ size = 40, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="aerous-hex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="aerous-hex-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M50 4 L92 27 V73 L50 96 L8 73 V27 Z"
          fill="url(#aerous-hex-gradient)"
          fillOpacity="0.16"
          stroke="url(#aerous-hex-gradient)"
          strokeWidth="3.5"
          strokeLinejoin="round"
          filter="url(#aerous-hex-glow)"
        />
        <path
          d="M50 24 L72 37 V63 L50 76 L28 63 V37 Z"
          fill="url(#aerous-hex-gradient)"
          fillOpacity="0.5"
        />
        <circle cx="50" cy="50" r="7" fill="#F8FAFC" />
      </svg>
      {showWordmark && (
        <span className="text-sm font-medium tracking-[0.15em] lowercase text-slate-50">
          aerous labs
        </span>
      )}
    </div>
  )
}

export function LogoMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`mark-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path
        d="M50 4 L92 27 V73 L50 96 L8 73 V27 Z"
        fill={`url(#mark-grad-${size})`}
        fillOpacity="0.18"
        stroke={`url(#mark-grad-${size})`}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M50 24 L72 37 V63 L50 76 L28 63 V37 Z" fill={`url(#mark-grad-${size})`} fillOpacity="0.55" />
      <circle cx="50" cy="50" r="7" fill="#F8FAFC" />
    </svg>
  )
}
