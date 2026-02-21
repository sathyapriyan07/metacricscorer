import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import GlassCard from '../components/layout/GlassCard'
import { useCatalogStore } from '../store/useCatalogStore'
import type { Role } from '../types'
import { getImageUrl } from '../utils/imageHelper'

const PlayersPage = () => {
  const { players, teams } = useCatalogStore()
  const [role, setRole] = useState<Role | 'ALL'>('ALL')
  const [teamId, setTeamId] = useState<string>('ALL')

  const filtered = useMemo(
    () =>
      players.filter((player) => {
        if (role !== 'ALL' && player.role !== role) return false
        if (teamId !== 'ALL' && player.team_id !== teamId) return false
        return true
      }),
    [players, role, teamId],
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Players" subtitle="Browse talent across formats and teams." />
      <GlassCard className="flex flex-wrap gap-3">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as Role | 'ALL')}
          className="rounded-xl bg-field p-3 text-sm text-slate-100"
        >
          <option value="ALL">All Roles</option>
          <option value="BAT">Batsmen</option>
          <option value="BOWL">Bowlers</option>
          <option value="AR">Allrounders</option>
          <option value="WK">Wicket Keepers</option>
        </select>
        <select
          value={teamId}
          onChange={(event) => setTeamId(event.target.value)}
          className="rounded-xl bg-field p-3 text-sm text-slate-100"
        >
          <option value="ALL">All Teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </GlassCard>
      <div className="grid gap-4 lg:grid-cols-3">
        {filtered.map((player) => (
          <Link key={player.id} to={`/players/${player.id}`} className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <img
                src={getImageUrl({ entity: player, bucket: 'player-images' })}
                alt={player.full_name}
                className="h-16 w-16 rounded-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                width={64}
                height={64}
              />
              <div>
                <p className="font-display text-xl">{player.full_name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <span className="rounded-full bg-brand-500/30 px-2 py-1 text-brand-200">
                    {player.role}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-slate-300">
                    {teams.find((team) => team.id === player.team_id)?.short_name ?? 'Free'}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs uppercase tracking-widest text-slate-500">Skill Index</p>
            <p className="text-lg text-brand-400">{player.skill_batting + player.skill_bowling}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PlayersPage

