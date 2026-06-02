export const departments = [
  { id: 'organic',    label: 'Organic & Pop-Up',     icon: '📥', color: '#00C853' },
  { id: 'marketing',  label: 'Marketing',             icon: '📢', color: '#F59E0B' },
  { id: 'qualifier',  label: 'Qualifier & 4th Floor', icon: '🏢', color: '#3B82F6' },
  { id: 'revived',    label: 'Revived Leads',         icon: '🔄', color: '#A78BFA' },
  { id: 'closed',     label: 'Closed Leads',          icon: '✅', color: '#FB923C' },
] as const

export type DeptId = typeof departments[number]['id']

// ── KPI Cards ──────────────────────────────────────────────────
export interface KPIItem {
  id: string
  label: string
  value: number
  color: string
  bgColor: string
  trend: number   // % vs yesterday
}

export const kpiCards: KPIItem[] = [
  { id: 'pu-recv',  label: 'Pop-Up Received Today',       value: 247, color: '#00C853', bgColor: '#E8F5E9', trend:  8 },
  { id: 'pu-qual',  label: 'Pop-Up Qualified Today',      value:  89, color: '#2962FF', bgColor: '#E3F2FD', trend:  3 },
  { id: 'pu-cls',   label: 'Pop-Up Closed Today',         value:  34, color: '#FF9800', bgColor: '#FFF3E0', trend: -2 },
  { id: 'hl-recv',  label: 'Hot Leads Received Today',    value: 156, color: '#7C3AED', bgColor: '#EDE9FE', trend:  5 },
  { id: 'hl-qual',  label: 'Hot Leads Qualified Today',   value:  67, color: '#FF1744', bgColor: '#FFEBEE', trend:  1 },
  { id: 'hl-cls',   label: 'Hot Leads Closed Today',      value:  28, color: '#1565C0', bgColor: '#E8EAF6', trend: -4 },
]

// ── Breakdown ──────────────────────────────────────────────────
export interface BreakdownStat {
  label: string
  value: number
  color: string
  bgColor: string
}

export const popupBreakdown: BreakdownStat[] = [
  { label: 'Total Received',    value: 247, color: '#00C853', bgColor: '#E8F5E9' },
  { label: 'Valid Pop-Ups',     value: 198, color: '#2962FF', bgColor: '#EFF6FF' },
  { label: 'Repeated',          value:  32, color: '#FF9800', bgColor: '#FFFBEB' },
  { label: 'Invalid IP & Data', value:  17, color: '#FF1744', bgColor: '#FFF1F2' },
]

// ── Averages ───────────────────────────────────────────────────
export interface AverageRow {
  period: string
  received: number
  qualified: number
}

export const popupAverages: AverageRow[] = [
  { period: 'Overall',  received: 312, qualified: 118 },
  { period: 'Monthly',  received: 287, qualified: 104 },
  { period: 'Today',    received: 247, qualified:  89 },
]

export const hotLeadAverages: AverageRow[] = [
  { period: 'Overall',  received: 189, qualified:  78 },
  { period: 'Monthly',  received: 167, qualified:  71 },
  { period: 'Today',    received: 156, qualified:  67 },
]

// ── Closing Ratios ─────────────────────────────────────────────
export interface RatioItem {
  label: string
  sublabel: string
  value: number
  color: string
}

export const closingRatios: RatioItem[] = [
  { label: 'Total Closed',    sublabel: 'All time',       value: 62, color: '#00C853' },
  { label: 'Last 3 Months',   sublabel: 'Mar – May',      value: 48, color: '#2962FF' },
  { label: 'Current Month',   sublabel: 'June 2026',      value: 55, color: '#FF9800' },
  { label: 'Today Closed',    sublabel: 'June 3, 2026',   value: 38, color: '#FF1744' },
]

// ── Recharts trend data ────────────────────────────────────────
export const weeklyTrend = [
  { day: 'Mon', received: 220, qualified: 82 },
  { day: 'Tue', received: 195, qualified: 74 },
  { day: 'Wed', received: 268, qualified: 101 },
  { day: 'Thu', received: 241, qualified:  92 },
  { day: 'Fri', received: 310, qualified: 118 },
  { day: 'Sat', received: 178, qualified:  65 },
  { day: 'Sun', received: 247, qualified:  89 },
]
