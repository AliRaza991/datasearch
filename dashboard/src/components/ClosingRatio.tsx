import { useEffect, useState } from 'react'
import type { RatioItem } from '../data/mockData'

interface CircleProps {
  value: number
  color: string
  size?: number
  stroke?: number
}

function CircularProgress({ value, color, size = 100, stroke = 7 }: CircleProps) {
  const [animValue, setAnimValue] = useState(0)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (animValue / 100) * circ

  useEffect(() => {
    const id = setTimeout(() => setAnimValue(value), 120)
    return () => clearTimeout(id)
  }, [value])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#F1F5F9" strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      {/* Glow layer */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke + 4}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          transition: 'stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1)',
          opacity: 0.15,
          filter: `blur(3px)`,
        }}
      />
    </svg>
  )
}

interface Props {
  items: RatioItem[]
}

export default function ClosingRatio({ items }: Props) {
  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ border: '1px solid #E8EDF5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-gray-400">
          Closing Ratios
        </h3>
        <span
          className="text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{ background: '#F0FFF4', color: '#00C853', border: '1px solid #C3E6CB' }}
        >
          Live
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(item => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-3 hover-lift cursor-default"
          >
            {/* Ring */}
            <div className="relative">
              <CircularProgress value={item.value} color={item.color} size={104} stroke={7} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="font-extrabold leading-none"
                  style={{
                    fontSize: '1.45rem',
                    color: item.color,
                    fontFamily: 'DM Mono, monospace',
                  }}
                >
                  {item.value}%
                </span>
              </div>
            </div>

            {/* Labels */}
            <div className="text-center">
              <div className="text-[13px] font-semibold text-gray-700 leading-snug">
                {item.label}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">{item.sublabel}</div>
            </div>

            {/* Mini bar */}
            <div className="w-full h-1 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.value}%`,
                  background: item.color,
                  transition: 'width 0.9s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
