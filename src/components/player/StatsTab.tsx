import { useEffect, useMemo, useState } from 'react'
import FormatSwitcher from './FormatSwitcher'
import BattingStatsCard from './BattingStatsCard'
import BowlingStatsCard from './BowlingStatsCard'
import TournamentStatsTable from './TournamentStatsTable'
import RecentPerformances from './RecentPerformances'
import { usePlayerStatsStore } from '../../store/usePlayerStatsStore'
import { calcAverage, calcStrikeRate } from '../../utils/statsHelpers'
import type { Player } from '../../types'

const StatsTab = ({ player }: { player: Player }) => {
  const [format, setFormat] = useState('ODI')
  const { stats, tournaments, leagues, recent, loading, error, fetchStats } =
    usePlayerStatsStore()

  useEffect(() => {
    if (player?.id) fetchStats(player.id, format as 'ODI' | 'T20' | 'TEST')
  }, [player?.id, format, fetchStats])

  const current = stats[`${player?.id}-${format}`]

  const careerSummary = useMemo(() => {
    if (!current) return null
    return [
      { label: 'Matches', value: current.matches },
      { label: 'Runs', value: current.runs },
      { label: 'Wickets', value: current.wickets },
      { label: 'Average', value: calcAverage(current.runs, current.innings, current.not_outs) ?? '–' },
      { label: 'Strike Rate', value: calcStrikeRate(current.runs, current.balls) ?? '–' },
    ]
  }, [current])

  return (
    <div className="flex flex-col gap-6">
      <FormatSwitcher value={format} onChange={setFormat} />

      {loading ? <p className="text-sm text-slate-400">Loading stats...</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {!current ? (
        <div className="glass-card rounded-2xl p-5 text-sm text-slate-400">No Data Yet</div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-5">
            {careerSummary?.map((item) => (
              <div key={item.label} className="glass-card rounded-xl px-4 py-3">
                <p className="text-xs uppercase tracking-widest text-slate-400">{item.label}</p>
                <p className="mt-2 font-display text-2xl">{item.value}</p>
              </div>
            ))}
          </div>

          <div
            className={`grid gap-4 ${
              player.role === 'BAT'
                ? 'lg:grid-cols-3'
                : player.role === 'BOWL'
                  ? 'lg:grid-cols-3'
                  : 'lg:grid-cols-2'
            }`}
          >
            <div className={player.role === 'BOWL' ? 'lg:col-span-1 opacity-80' : ''}>
              <BattingStatsCard stats={current} />
            </div>
            <div className={player.role === 'BAT' ? 'lg:col-span-1 opacity-80' : ''}>
              <BowlingStatsCard stats={current} />
            </div>
            {player.role === 'WK' ? (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display text-xl">Keeping</h3>
                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex items-center justify-between border-b border-white/5 py-2">
                    <span className="text-slate-400">Catches</span>
                    <span className="font-semibold">{current.catches ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 py-2">
                    <span className="text-slate-400">Stumpings</span>
                    <span className="font-semibold">{current.stumpings ?? 0}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TournamentStatsTable title="Tournament Stats" rows={tournaments} />
            <TournamentStatsTable title="League Stats" rows={leagues} />
          </div>

          <RecentPerformances
            rows={recent}
            isBowler={player.role === 'BOWL' || player.role === 'AR'}
          />
        </>
      )}
    </div>
  )
}

export default StatsTab
