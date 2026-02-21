import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Scoreboard from '../components/cricket/Scoreboard'
import RecentBalls from '../components/cricket/RecentBalls'
import PlayerBadge from '../components/cricket/PlayerBadge'
import { useMatchStore } from '../store/useMatchStore'
import { useCatalogStore } from '../store/useCatalogStore'
import { toOvers } from '../utils/formatters'
import { Link } from 'react-router-dom'
import LiveBadge from '../components/ui/LiveBadge'

const MatchSimulationPage = () => {
  const { config, state, events, simulate } = useMatchStore()
  const { players, teams } = useCatalogStore()

  if (!config || !state) {
    return (
      <Card>
        <p className="text-sm text-slate-300">
          Configure a match first from Quick Match to start simulation.
        </p>
      </Card>
    )
  }

  const currentInnings = state.innings[0]
  const teamName = teams.find((t) => t.id === currentInnings.battingTeamId)?.name ?? 'Team'
  const striker = players.find((p) => p.id === currentInnings.strikerId)
  const nonStriker = players.find((p) => p.id === currentInnings.nonStrikerId)
  const bowler = players.find((p) => p.id === currentInnings.bowlerId)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Live Simulation"
        subtitle={`${config.homeTeam.name} vs ${config.awayTeam.name} · ${config.format}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-2xl bg-gradient-to-r from-live-500 to-danger-500 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 ease-out hover:scale-[1.02]"
              onClick={simulate}
            >
              Simulate Innings
            </button>
            <Link
              to="/match/scorecard"
              className="rounded-2xl bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-200"
            >
              Scorecard
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.6fr_1fr]">
        <div className="space-y-4">
          <Card className="bg-navy-900/70">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg">{teamName}</h3>
              <LiveBadge label="Live" />
            </div>
            <div className="mt-4">
              <Scoreboard innings={currentInnings} teamName={teamName} />
            </div>
            <div className="mt-4 text-sm text-slate-400">
              Overs: {toOvers(currentInnings.balls)} • RR 8.45
            </div>
          </Card>

          <Card>
            <p className="text-xs uppercase tracking-widest text-slate-400">Striker</p>
            {striker ? <PlayerBadge player={striker} roleLabel="45 (32)" highlight /> : null}
            <div className="mt-3">
              {nonStriker ? <PlayerBadge player={nonStriker} roleLabel="12 (10)" /> : null}
            </div>
          </Card>
        </div>

        <Card className="h-[540px] overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-slate-400">Commentary</p>
            <span className="text-xs text-slate-500">Live feed</span>
          </div>
          <div className="mt-4 h-[470px] space-y-3 overflow-y-auto pr-2 text-sm text-slate-300 scrollbar-thin">
            {events.slice(-18).map((event) => (
              <div key={event.id} className="flex items-start justify-between gap-4">
                <span>
                  {event.over}.{event.ball} {event.commentary}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{event.outcome}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="text-xs uppercase tracking-widest text-slate-400">Bowler</p>
            {bowler ? <PlayerBadge player={bowler} roleLabel="3-0-24-1" /> : null}
            <div className="mt-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Recent Balls</p>
              <div className="mt-3">
                <RecentBalls balls={currentInnings.recentBalls} />
              </div>
            </div>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-widest text-slate-400">Required RR</p>
            <p className="mt-3 font-display text-2xl">8.45</p>
            <p className="text-xs text-slate-500">Need 48 off 34</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MatchSimulationPage
