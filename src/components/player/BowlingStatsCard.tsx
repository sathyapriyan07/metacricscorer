import { calcEconomy } from '../../utils/statsHelpers'
import type { PlayerStats } from '../../types'

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between border-b border-white/5 py-2 text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-semibold text-slate-100">{value}</span>
  </div>
)

const BowlingStatsCard = ({ stats }: { stats: PlayerStats }) => {
  const econ = calcEconomy(stats.runs_conceded, stats.overs)
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl">Bowling</h3>
        <span className="rounded-full bg-accent-500/20 px-3 py-1 text-xs uppercase tracking-widest text-accent-200">
          Bowl
        </span>
      </div>
      <div className="grid gap-2">
        <StatItem label="Matches" value={stats.matches} />
        <StatItem label="Innings Bowled" value={stats.innings} />
        <StatItem label="Overs" value={stats.overs} />
        <StatItem label="Runs Conceded" value={stats.runs_conceded} />
        <StatItem label="Wickets" value={stats.wickets} />
        <StatItem label="Economy" value={econ ?? '–'} />
        <StatItem label="4fers" value={stats.four_fers} />
        <StatItem label="5fers" value={stats.five_fers} />
        <StatItem label="Best Figures" value={stats.best_figures ?? '–'} />
      </div>
    </div>
  )
}

export default BowlingStatsCard
