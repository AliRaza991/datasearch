import type { KPIItem } from '../data/mockData'

type Props = KPIItem

export default function KPICard({ label, value, color, bgColor, trend }: Props) {
  const isUp = trend >= 0

  return (
    <div
      className="bg-white rounded-2xl p-5 hover-lift cursor-default"
      style={{
        border: '1px solid #E8EDF5',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 36px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'
      }}
    >
      {/* Top accent stripe */}
      <div
        className="w-full h-[3px] rounded-full mb-4"
        style={{ background: color }}
      />

      {/* Icon circle */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: bgColor }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: color }} />
      </div>

      {/* Big number */}
      <div
        className="leading-none mb-2 font-extrabold"
        style={{
          fontSize: '2.5rem',
          color,
          fontFamily: 'DM Mono, monospace',
          letterSpacing: '-0.025em',
        }}
      >
        {value.toLocaleString()}
      </div>

      {/* Label */}
      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 leading-snug mb-2">
        {label}
      </div>

      {/* Trend */}
      <div
        className="flex items-center gap-1 text-[11px] font-semibold"
        style={{ color: isUp ? '#00C853' : '#FF1744' }}
      >
        <span style={{ fontSize: '13px' }}>{isUp ? '↑' : '↓'}</span>
        {Math.abs(trend)}% vs yesterday
      </div>
    </div>
  )
}
