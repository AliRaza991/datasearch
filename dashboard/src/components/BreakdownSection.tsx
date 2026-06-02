import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { BreakdownStat } from '../data/mockData'
import { weeklyTrend } from '../data/mockData'

interface Props {
  title: string
  stats: BreakdownStat[]
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean; payload?: { value: number; color: string; name: string }[]; label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{ background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
    >
      <div className="font-semibold text-gray-700 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full block" style={{ background: p.color }} />
          <span className="text-gray-500 capitalize">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function BreakdownSection({ title, stats }: Props) {
  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{ border: '1px solid #E8EDF5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-gray-400">
          {title}
        </h3>
        <span className="text-[11px] text-gray-400 font-medium">Weekly snapshot</span>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl p-4 hover-lift cursor-default"
            style={{
              background: stat.bgColor,
              border: `1px solid ${stat.color}28`,
              transition: 'transform 0.25s ease',
            }}
          >
            <div
              className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: stat.color }}
            >
              {stat.label}
            </div>
            <div
              className="font-extrabold leading-none"
              style={{
                fontSize: '2rem',
                color: stat.color,
                fontFamily: 'DM Mono, monospace',
                letterSpacing: '-0.02em',
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recharts bar chart */}
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyTrend} barSize={18} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Inter' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Inter' }}
              axisLine={false} tickLine={false} width={32}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Bar dataKey="received"  fill="#00C853" radius={[6, 6, 0, 0]} name="received" />
            <Bar dataKey="qualified" fill="#2962FF" radius={[6, 6, 0, 0]} name="qualified" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart legend */}
      <div className="flex items-center gap-5 mt-3">
        {[{ color: '#00C853', label: 'Received' }, { color: '#2962FF', label: 'Qualified' }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm block" style={{ background: l.color }} />
            <span className="text-[11px] text-gray-500 font-medium">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
