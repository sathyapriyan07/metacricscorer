import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import { useMatchStore } from '../store/useMatchStore'
import { useCatalogStore } from '../store/useCatalogStore'
import { toOvers, strikeRate, economyRate } from '../utils/formatters'

const ScorecardPage = () => {
  const { config, events, state } = useMatchStore()
  const { players, teams } = useCatalogStore()

  if (!config || !state) {
    return (
      <Card>
        <p className="text-sm text-slate-300">No match loaded yet.</p>
      </Card>
    )
  }

  const inningsEvents = events.filter((event) => event.innings === 1)
  const batterStats = new Map<
    string,
    { runs: number; balls: number; fours: number; sixes: number; dismissal?: string }
  >()
  const bowlerStats = new Map<string, { runs: number; balls: number; wickets: number }>()

  inningsEvents.forEach((event) => {
    const batter = batterStats.get(event.batter_id) ?? {
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
    }
    if (event.outcome !== 'W') {
      const runs = Number(event.outcome)
      batter.runs += runs
      batter.fours += event.outcome === '4' ? 1 : 0
      batter.sixes += event.outcome === '6' ? 1 : 0
    } else {
      batter.dismissal = event.dismissal?.type ?? 'OUT'
    }
    batter.balls += 1
    batterStats.set(event.batter_id, batter)

    const bowler = bowlerStats.get(event.bowler_id) ?? { runs: 0, balls: 0, wickets: 0 }
    bowler.balls += 1
    if (event.outcome !== 'W') {
      bowler.runs += Number(event.outcome)
    } else {
      bowler.wickets += 1
    }
    bowlerStats.set(event.bowler_id, bowler)
  })

  const teamName = teams.find((t) => t.id === state.innings[0].battingTeamId)?.name ?? 'Team'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Scorecard" subtitle={`${teamName} Innings`} />
      <Card>
        <p className="text-xs uppercase tracking-widest text-slate-400">Batting</p>
        <div className="mt-4 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-navy-900/80 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="py-2">Name</th>
                <th>R</th>
                <th>B</th>
                <th>4s</th>
                <th>6s</th>
                <th>SR</th>
                <th>Dismissal</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(batterStats.entries()).map(([playerId, stats]) => {
                const player = players.find((p) => p.id === playerId)
                return (
                  <tr key={playerId} className="border-t border-white/10 hover:bg-white/5">
                    <td className="py-2">{player?.full_name ?? playerId}</td>
                    <td>{stats.runs}</td>
                    <td>{stats.balls}</td>
                    <td>{stats.fours}</td>
                    <td>{stats.sixes}</td>
                    <td>{strikeRate(stats.runs, stats.balls)}</td>
                    <td className="text-xs text-slate-400">{stats.dismissal ?? 'Not out'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <p className="text-xs uppercase tracking-widest text-slate-400">Bowling</p>
        <div className="mt-4 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-navy-900/80 text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="py-2">Name</th>
                <th>O</th>
                <th>R</th>
                <th>W</th>
                <th>Econ</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(bowlerStats.entries()).map(([playerId, stats]) => {
                const player = players.find((p) => p.id === playerId)
                return (
                  <tr key={playerId} className="border-t border-white/10 hover:bg-white/5">
                    <td className="py-2">{player?.full_name ?? playerId}</td>
                    <td>{toOvers(stats.balls)}</td>
                    <td>{stats.runs}</td>
                    <td>{stats.wickets}</td>
                    <td>{economyRate(stats.runs, stats.balls)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ScorecardPage
