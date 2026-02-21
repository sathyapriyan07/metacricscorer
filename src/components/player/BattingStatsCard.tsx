import { calcAverage, calcStrikeRate } from '../../utils/statsHelpers'
import type { PlayerStats } from '../../types'

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between border-b border-white/5 py-2 text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-semibold text-slate-100">{value}</span>
  </div>
)

const BattingStatsCard = ({ stats }: { stats: PlayerStats }) => {
  const avg = calcAverage(stats.runs, stats.innings, stats.not_outs)
  const sr = calcStrikeRate(stats.runs, stats.balls)

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl">Batting</h3>
        <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs uppercase tracking-widest text-brand-200">
          Bat
        </span>
      </div>
      <div className="grid gap-2">
        <StatItem label="Matches" value={stats.matches} />
        <StatItem label="Innings" value={stats.innings} />
        <StatItem label="Runs" value={stats.runs} />
        <StatItem label="Balls" value={stats.balls} />
        <StatItem label="4s" value={stats.fours} />
        <StatItem label="6s" value={stats.sixes} />
        <StatItem label="50s" value={stats.fifties} />
        <StatItem label="100s" value={stats.hundreds} />
        <StatItem label="Not Outs" value={stats.not_outs} />
        <StatItem label="Highest Score" value={stats.highest_score} />
        <StatItem label="Strike Rate" value={sr ?? '–'} />
        <StatItem label="Average" value={avg ?? '–'} />
      </div>
    </div>
  )
}

export default BattingStatsCard
