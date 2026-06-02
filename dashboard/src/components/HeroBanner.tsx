interface HeroBannerProps {
  icon: string
  deptName: string
  updatedAt: string
}

export default function HeroBanner({ icon, deptName, updatedAt }: HeroBannerProps) {
  return (
    <div className="
      flex items-center justify-between mb-6 animate-fade-in-up
      h-[80px] rounded-[20px] px-6 py-5
      bg-[linear-gradient(90deg,#6D3EF7_0%,#4A6CF7_35%,#2DAAF7_70%,#5CE1C6_100%)]
      shadow-[0_10px_25px_rgba(59,130,246,0.15)]
    ">
      {/* ── Left: icon + text ── */}
      <div className="flex items-center gap-4">

        {/* Glassmorphism icon container */}
        <div className="
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
          bg-white/20 backdrop-blur-md
          border border-white/25
          shadow-[0_2px_8px_rgba(0,0,0,0.08)]
        ">
          {icon}
        </div>

        {/* Title + subtitle */}
        <div>
          <h2 className="text-white text-[18px] font-bold leading-[1.2]">
            {deptName}
          </h2>
          <p className="text-[13px] font-medium text-white/85 mt-0.5">
            Live data • 30s auto-refresh
          </p>
        </div>

      </div>

      {/* ── Right: timestamp ── */}
      <div className="text-right">
        <span className="text-[13px] font-semibold text-slate-500">
          Updated:
        </span>
        <span className="text-[13px] font-bold text-blue-600 ml-1 font-mono">
          {updatedAt}
        </span>
      </div>
    </div>
  )
}
