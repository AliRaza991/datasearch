import type { AverageRow } from '../data/mockData'

interface Props {
  title: string
  color: string
  rows: AverageRow[]
}

export default function AverageTable({ title, color, rows }: Props) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '1px solid #E8EDF5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{
          background: `${color}0c`,
          borderBottom: '1px solid #EDF2F7',
        }}
      >
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
        <h3
          className="text-[11px] font-bold tracking-[0.12em] uppercase"
          style={{ color }}
        >
          {title}
        </h3>
      </div>

      {/* Column headers */}
      <div
        className="grid grid-cols-3 px-6 py-2.5"
        style={{ background: '#F8FAFC', borderBottom: '1px solid #EDF2F7' }}
      >
        {['Period', 'Received', 'Qualified'].map((h, i) => (
          <span
            key={h}
            className="text-[10px] font-bold uppercase tracking-wider text-gray-400"
            style={{ textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right' }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Data rows */}
      {rows.map((row, i) => (
        <div
          key={row.period}
          className="grid grid-cols-3 px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
          style={{ borderBottom: i < rows.length - 1 ? '1px solid #F7FAFC' : 'none' }}
        >
          <span className="text-[13px] font-medium text-gray-600">{row.period}</span>
          <span
            className="text-[13px] font-bold text-center"
            style={{ color, fontFamily: 'DM Mono, monospace' }}
          >
            {row.received}
          </span>
          <span
            className="text-[13px] font-bold text-right"
            style={{ color: '#2962FF', fontFamily: 'DM Mono, monospace' }}
          >
            {row.qualified}
          </span>
        </div>
      ))}
    </div>
  )
}
