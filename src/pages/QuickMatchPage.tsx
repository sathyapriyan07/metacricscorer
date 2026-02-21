import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import { useCatalogStore } from '../store/useCatalogStore'
import { useMatchStore } from '../store/useMatchStore'
import type { Format, Player, Team, Venue } from '../types'
import { FORMAT_OVERS } from '../utils/constants'
import OrderEditor from '../components/cricket/OrderEditor'
import Card from '../components/ui/Card'
import SectionHeader from '../components/ui/SectionHeader'
import { getImageUrl } from '../utils/imageHelper'

const formats: Format[] = ['T20', 'ODI', 'TEST']

const QuickMatchPage = () => {
  const navigate = useNavigate()
  const { teams, players, venues } = useCatalogStore()
  const setConfig = useMatchStore((s) => s.setConfig)
  const [step, setStep] = useState(1)
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '')
  const [opponentId, setOpponentId] = useState(teams[1]?.id ?? '')
  const [venueId, setVenueId] = useState(venues[0]?.id ?? '')
  const [format, setFormat] = useState<Format>('T20')

  const teamPlayers = useMemo(
    () => players.filter((p) => p.team_id === teamId),
    [players, teamId],
  )
  const opponentPlayers = useMemo(
    () => players.filter((p) => p.team_id === opponentId),
    [players, opponentId],
  )

  const buildOrder = (list: Player[]) => list.map((p) => p.id)
  const defaultXI = (list: Player[]) => list.slice(0, Math.max(2, Math.min(11, list.length)))

  const [playingXIHome, setPlayingXIHome] = useState<Player[]>(defaultXI(teamPlayers))
  const [playingXIAway, setPlayingXIAway] = useState<Player[]>(defaultXI(opponentPlayers))
  const [battingOrderHome, setBattingOrderHome] = useState<string[]>(buildOrder(playingXIHome))
  const [battingOrderAway, setBattingOrderAway] = useState<string[]>(buildOrder(playingXIAway))
  const [bowlingOrderHome, setBowlingOrderHome] = useState<string[]>(
    buildOrder(playingXIHome.filter((p) => p.role !== 'BAT')),
  )
  const [bowlingOrderAway, setBowlingOrderAway] = useState<string[]>(
    buildOrder(playingXIAway.filter((p) => p.role !== 'BAT')),
  )

  const syncSelection = (list: Player[], setXI: (p: Player[]) => void) => {
    const selection = defaultXI(list)
    setXI(selection)
  }

  const togglePlayer = (
    player: Player,
    selected: Player[],
    setSelected: (next: Player[]) => void,
  ) => {
    const exists = selected.find((p) => p.id === player.id)
    if (exists) {
      const next = selected.filter((p) => p.id !== player.id)
      if (next.length < 2) return
      setSelected(next)
    } else {
      const next = [...selected, player].slice(0, 11)
      setSelected(next)
    }
  }

  const updateOrders = (homeList: Player[], awayList: Player[]) => {
    setBattingOrderHome(buildOrder(homeList))
    setBattingOrderAway(buildOrder(awayList))
    setBowlingOrderHome(buildOrder(homeList.filter((p) => p.role !== 'BAT')))
    setBowlingOrderAway(buildOrder(awayList.filter((p) => p.role !== 'BAT')))
  }

  const handleStart = () => {
    const homeTeam = teams.find((t) => t.id === teamId) as Team
    const awayTeam = teams.find((t) => t.id === opponentId) as Team
    const venue = venues.find((v) => v.id === venueId) as Venue

    setConfig({
      format,
      venue,
      homeTeam,
      awayTeam,
      playingXIHome,
      playingXIAway,
      battingOrderHome,
      battingOrderAway,
      bowlingOrderHome,
      bowlingOrderAway,
      overs: FORMAT_OVERS[format],
    })
    navigate('/match')
  }

  const handleNext = () => {
    syncSelection(teamPlayers, setPlayingXIHome)
    syncSelection(opponentPlayers, setPlayingXIAway)
    updateOrders(defaultXI(teamPlayers), defaultXI(opponentPlayers))
    setStep(2)
  }

  useEffect(() => {
    if (step === 1) {
      syncSelection(teamPlayers, setPlayingXIHome)
    }
  }, [teamPlayers, step])

  useEffect(() => {
    if (step === 1) {
      syncSelection(opponentPlayers, setPlayingXIAway)
    }
  }, [opponentPlayers, step])

  useEffect(() => {
    if (teamId === opponentId) {
      const next = teams.find((t) => t.id !== teamId)
      if (next) setOpponentId(next.id)
    }
  }, [teamId, opponentId, teams])

  const handleBack = () => setStep(1)

  const readyToStart = playingXIHome.length >= 2 && playingXIAway.length >= 2

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Quick Match"
        subtitle="Pick teams, venue, and format to start instant simulation."
      />
      <Card className="bg-navy-900/70">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.2fr_1.2fr]">
          <div className="flex items-center gap-4">
            <img
              src={getImageUrl({
                entity: teams.find((t) => t.id === teamId),
                bucket: 'team-logos',
              })}
              alt="Team"
              className="h-14 w-14 rounded-2xl object-cover"
              loading="lazy"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Home</p>
              <p className="font-display text-2xl">
                {teams.find((t) => t.id === teamId)?.name ?? 'Team'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center text-xs uppercase tracking-[0.3em] text-slate-500">
            VS
          </div>
          <div className="flex items-center justify-end gap-4">
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-slate-400">Away</p>
              <p className="font-display text-2xl">
                {teams.find((t) => t.id === opponentId)?.name ?? 'Opponent'}
              </p>
            </div>
            <img
              src={getImageUrl({
                entity: teams.find((t) => t.id === opponentId),
                bucket: 'team-logos',
              })}
              alt="Opponent"
              className="h-14 w-14 rounded-2xl object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-widest text-slate-400">
          <span className="rounded-full bg-white/10 px-3 py-1">{format}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            {venues.find((v) => v.id === venueId)?.name ?? 'Venue'}
          </span>
        </div>
      </Card>
      {step === 1 ? (
        <Card className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Your Team</label>
              <select
                value={teamId}
                onChange={(event) => setTeamId(event.target.value)}
                className="mt-2 w-full rounded-xl bg-field p-3 text-sm text-slate-100"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Opponent</label>
              <select
                value={opponentId}
                onChange={(event) => setOpponentId(event.target.value)}
                className="mt-2 w-full rounded-xl bg-field p-3 text-sm text-slate-100"
              >
                {teams
                  .filter((team) => team.id !== teamId)
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Venue</label>
              <select
                value={venueId}
                onChange={(event) => setVenueId(event.target.value)}
                className="mt-2 w-full rounded-xl bg-field p-3 text-sm text-slate-100"
              >
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Format</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {formats.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFormat(item)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-widest ${
                      item === format
                        ? 'bg-brand-500 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold uppercase tracking-widest text-white"
              onClick={handleNext}
            >
              Continue to XI & Orders
            </button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <SectionHeader title="Playing XI" subtitle="Select Playing XI" />
          <Card className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {teams.find((t) => t.id === teamId)?.name} Playing XI
              </p>
              <div className="mt-3 space-y-2">
                {teamPlayers.map((player) => {
                  const selected = playingXIHome.some((p) => p.id === player.id)
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() =>
                        togglePlayer(player, playingXIHome, (next) => {
                          setPlayingXIHome(next)
                          updateOrders(next, playingXIAway)
                        })
                      }
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${
                        selected
                          ? 'border-brand-500 bg-brand-500/20'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <span>{player.full_name}</span>
                      <span className="text-xs text-slate-400">{player.role}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {teams.find((t) => t.id === opponentId)?.name} Playing XI
              </p>
              <div className="mt-3 space-y-2">
                {opponentPlayers.map((player) => {
                  const selected = playingXIAway.some((p) => p.id === player.id)
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() =>
                        togglePlayer(player, playingXIAway, (next) => {
                          setPlayingXIAway(next)
                          updateOrders(playingXIHome, next)
                        })
                      }
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm ${
                        selected
                          ? 'border-brand-500 bg-brand-500/20'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <span>{player.full_name}</span>
                      <span className="text-xs text-slate-400">{player.role}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          <SectionHeader title="Orders" subtitle="Batting & Bowling Order" />
          <Card className="grid gap-6 lg:grid-cols-2">
            <OrderEditor
              title="Home Batting Order"
              players={playingXIHome}
              order={battingOrderHome}
              onChange={setBattingOrderHome}
            />
            <OrderEditor
              title="Away Batting Order"
              players={playingXIAway}
              order={battingOrderAway}
              onChange={setBattingOrderAway}
            />
          </Card>

          <Card className="grid gap-6 lg:grid-cols-2">
            <OrderEditor
              title="Home Bowling Order"
              players={playingXIHome}
              order={bowlingOrderHome}
              onChange={setBowlingOrderHome}
            />
            <OrderEditor
              title="Away Bowling Order"
              players={playingXIAway}
              order={bowlingOrderAway}
              onChange={setBowlingOrderAway}
            />
          </Card>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-200"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              type="button"
              disabled={!readyToStart}
              className="rounded-2xl bg-gradient-to-r from-live-500 to-danger-500 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 ease-out hover:scale-[1.02] disabled:opacity-50"
              onClick={handleStart}
            >
              Start Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickMatchPage

