interface HeroBannerProps {
  icon: string
  deptName: string
  updatedAt: string
}

export default function HeroBanner({ icon, deptName, updatedAt }: HeroBannerProps) {
  return (
    <div
      className="flex items-center gap-5 px-7 mb-6 animate-fade-in-up"
      style={{
        height: 80,
        background: 'linear-gradient(90deg,#6C3EF4 0%,#3B82F6 50%,#59E3C6 100%)',
        borderRadius: 20,
        boxShadow: '0 10px 40px rgba(108,62,244,0.28)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glare */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 55%)',
        }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 relative"
        style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 relative">
        <div className="text-white font-bold text-[17px] leading-tight">{deptName}</div>
        <div className="text-white/65 text-[12px] mt-0.5 font-medium">
          Live data · 30s auto-refresh
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-right relative hidden sm:block">
        <div className="text-white/45 text-[10px] uppercase tracking-widest font-semibold">
          Updated
        </div>
        <div
          className="text-white font-semibold text-[13px] mt-0.5"
          style={{ fontFamily: 'DM Mono, monospace' }}
        >
          {updatedAt}
        </div>
      </div>
    </div>
  )
}
