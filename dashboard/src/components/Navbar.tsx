import { useState, useRef, useEffect } from 'react'
import { ChevronDown, LogOut, User } from 'lucide-react'

interface NavbarProps {
  userName?: string
  userDesig?: string
}

const navBtns = [
  { label: '⚡ DataSearch', key: 'ds', href: '/index.html',
    style: { background: 'linear-gradient(135deg,#1a56db,#06b6d4)', color: '#fff', boxShadow: '0 4px 14px rgba(6,182,212,0.3)' } },
  { label: '☀️ SOD',        key: 'sod', href: '/sod.html',
    style: { background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#1a1a1a', boxShadow: '0 4px 14px rgba(245,158,11,0.35)' } },
  { label: '🌙 EOD',        key: 'eod', href: '/eod.html',
    style: { background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' } },
]

export default function Navbar({ userName = 'Admin User', userDesig = 'Manager' }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header
      className="fixed top-0 right-0 z-40 flex items-center justify-between px-8"
      style={{
        left: 280,
        height: 72,
        background: '#fff',
        borderBottom: '1px solid #EDF2F7',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Left: nav buttons ── */}
      <div
        className="flex items-center gap-1 p-1.5 rounded-2xl"
        style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}
      >
        {navBtns.map(btn => (
          <a
            key={btn.key}
            href={btn.href}
            className="px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 no-underline whitespace-nowrap"
            style={btn.key === 'sod' ? btn.style : { color: '#64748B' }}
            onMouseEnter={e => {
              if (btn.key !== 'sod')
                (e.currentTarget as HTMLElement).style.background = '#E2E8F0'
            }}
            onMouseLeave={e => {
              if (btn.key !== 'sod')
                (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            {btn.label}
          </a>
        ))}
      </div>

      {/* ── Right: page title (center) ── */}
      <div className="text-center hidden md:block">
        <div className="text-[15px] font-bold text-gray-800">Start of Day Report</div>
        <div className="text-[11px] text-gray-400 mt-0.5">Live Department Intelligence</div>
      </div>

      {/* ── Right: user pill ── */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="flex items-center gap-3 px-3.5 py-2 rounded-full transition-all duration-200 hover:bg-gray-50"
          style={{ border: '1px solid #E2E8F0' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,#6C3EF4,#3B82F6)',
              boxShadow: '0 0 12px rgba(108,62,244,0.35)',
            }}
          >
            {initials}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[13px] font-semibold text-gray-800 leading-tight">{userName}</div>
            <div className="text-[11px] text-gray-400">{userDesig}</div>
          </div>
          <ChevronDown
            size={13}
            className="text-gray-400 transition-transform duration-200"
            style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            className="absolute right-0 top-[calc(100%+10px)] rounded-2xl overflow-hidden z-50 min-w-[200px] animate-fade-in-up"
            style={{
              background: '#fff',
              border: '1px solid #E2E8F0',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #EDF2F7' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#6C3EF4,#3B82F6)' }}
                >
                  {initials}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-gray-800">{userName}</div>
                  <div className="text-[11px] text-gray-400">{userDesig}</div>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
                <User size={14} className="text-gray-400" />
                My Profile
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
