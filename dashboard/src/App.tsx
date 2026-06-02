import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import HeroBanner from './components/HeroBanner'
import KPICard from './components/KPICard'
import BreakdownSection from './components/BreakdownSection'
import AverageTable from './components/AverageTable'
import ClosingRatio from './components/ClosingRatio'
import {
  departments, kpiCards, popupBreakdown, popupAverages,
  hotLeadAverages, closingRatios, type DeptId,
} from './data/mockData'

function LiveBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-[12px] tracking-wider uppercase"
      style={{
        background: 'rgba(0,200,83,0.08)',
        border: '1.5px solid rgba(0,200,83,0.25)',
        color: '#00C853',
        boxShadow: '0 0 16px rgba(0,200,83,0.08)',
      }}
    >
      <span
        className="w-2 h-2 rounded-full block animate-pulse-soft"
        style={{ background: '#00C853', boxShadow: '0 0 6px #00C853' }}
      />
      LIVE
    </div>
  )
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function App() {
  const [activeDept, setActiveDept] = useState<DeptId>('organic')
  const [time, setTime] = useState(formatTime(new Date()))

  // Tick clock every second
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  const dept = departments.find(d => d.id === activeDept)!

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* ── Sidebar ── */}
      <Sidebar active={activeDept} onChange={setActiveDept} />

      {/* ── Main column ── */}
      <div className="flex flex-col flex-1" style={{ marginLeft: 280 }}>
        {/* ── Navbar ── */}
        <Navbar userName="Ali Raza" userDesig="SOD Manager" />

        {/* ── Scrollable content ── */}
        <main
          className="flex-1 overflow-y-auto px-7 pb-10"
          style={{ paddingTop: 72 + 28 }}
        >
          {/* ── Page heading ── */}
          <div className="flex items-start justify-between mb-5 flex-wrap gap-4 animate-fade-in-up">
            <div>
              <h1
                className="font-extrabold text-gray-900 leading-tight"
                style={{ fontSize: '2rem', letterSpacing: '-0.025em' }}
              >
                Start of Day Report
              </h1>
              <p className="text-gray-400 text-[13px] mt-1 font-medium">
                Live Department Intelligence · Auto-refreshes every 30 seconds
              </p>
            </div>
            <LiveBadge />
          </div>

          {/* ── Hero banner ── */}
          <HeroBanner
            icon={dept.icon}
            deptName={dept.label}
            updatedAt={time}
          />

          {/* ── KPI cards row ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-5 stagger">
            {kpiCards.map(card => (
              <KPICard key={card.id} {...card} />
            ))}
          </div>

          {/* ── Breakdown + Closing Ratio ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
            <div className="xl:col-span-2">
              <BreakdownSection
                title="Today Received Pop-Ups Breakdown"
                stats={popupBreakdown}
              />
            </div>
            <div>
              <ClosingRatio items={closingRatios.slice(0, 2)} />
            </div>
          </div>

          {/* ── Averages row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <AverageTable
              title="Pop-Up Averages"
              color="#00C853"
              rows={popupAverages}
            />
            <AverageTable
              title="Hot Lead Averages"
              color="#7C3AED"
              rows={hotLeadAverages}
            />
          </div>

          {/* ── Full closing ratios ── */}
          <ClosingRatio items={closingRatios} />
        </main>
      </div>
    </div>
  )
}
