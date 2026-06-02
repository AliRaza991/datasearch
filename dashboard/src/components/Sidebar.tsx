import { useState } from 'react'
import {
  Inbox, Megaphone, Building2, RefreshCw, CheckCircle2,
} from 'lucide-react'
import type { DeptId } from '../data/mockData'

const navItems = [
  { id: 'organic'   as DeptId, label: 'Organic & Pop-Up',     icon: Inbox,         accent: '#60A5FA' },
  { id: 'marketing' as DeptId, label: 'Marketing',             icon: Megaphone,     accent: '#FBBF24' },
  { id: 'qualifier' as DeptId, label: 'Qualifier & 4th Floor', icon: Building2,     accent: '#34D399' },
  { id: 'revived'   as DeptId, label: 'Revived Leads',         icon: RefreshCw,     accent: '#A78BFA' },
  { id: 'closed'    as DeptId, label: 'Closed Leads',          icon: CheckCircle2,  accent: '#FB923C' },
]

interface SidebarProps {
  active: DeptId
  onChange: (id: DeptId) => void
}

export default function Sidebar({ active, onChange }: SidebarProps) {
  const [hovered, setHovered] = useState<DeptId | null>(null)

  return (
    <aside
      className="fixed left-0 top-0 h-screen sidebar-scroll overflow-y-auto flex flex-col z-50"
      style={{
        width: 280,
        background: 'linear-gradient(180deg, #03142E 0%, #05224D 50%, #0D2F66 100%)',
      }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-6 pt-7 pb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg,#ffd600,#ff8c00)',
            boxShadow: '0 4px 16px rgba(255,160,0,0.4)',
          }}
        >
          ☀️
        </div>
        <div>
          <div className="text-white font-extrabold text-[15px] tracking-wide leading-tight">
            DataSearch
          </div>
          <div className="text-blue-300/60 text-[11px] font-medium mt-0.5">SOD Dashboard</div>
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="px-6 mb-2">
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/25">
          Departments
        </span>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ id, label, icon: Icon, accent }) => {
          const isActive = active === id
          const isHov = hovered === id && !isActive
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center gap-3 w-full text-left px-3 py-3 rounded-2xl transition-all duration-200 cursor-pointer"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(37,99,235,0.18))'
                  : isHov
                  ? 'rgba(255,255,255,0.055)'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(59,130,246,0.35)'
                  : '1px solid transparent',
                boxShadow: isActive ? '0 4px 20px rgba(59,130,246,0.22)' : 'none',
              }}
            >
              {/* icon box */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: isActive ? `${accent}28` : 'rgba(255,255,255,0.07)',
                }}
              >
                <Icon
                  size={15}
                  color={isActive ? accent : isHov ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.38)'}
                  strokeWidth={2.2}
                />
              </div>

              {/* label */}
              <span
                className="text-[13px] font-medium flex-1 transition-colors duration-200"
                style={{
                  color: isActive ? '#fff' : isHov ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.45)',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {label}
              </span>

              {/* active dot */}
              {isActive && (
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: accent }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Bottom status box ── */}
      <div className="mt-auto px-4 pb-6">
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-2 h-2 rounded-full bg-green-400 block animate-pulse-soft"
            />
            <span className="text-[11px] font-semibold text-green-400">System Live</span>
          </div>
          <p className="text-[11px] text-blue-300/50">Auto-refreshes every 30 seconds</p>
        </div>
      </div>
    </aside>
  )
}
