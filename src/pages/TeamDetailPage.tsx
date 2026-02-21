import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import { useCatalogStore } from '../store/useCatalogStore'
import { getImageUrl } from '../utils/imageHelper'

const TeamDetailPage = () => {
  const { id } = useParams()
  const { teams, players } = useCatalogStore()
  const team = teams.find((t) => t.id === id)
  const squad = players.filter((p) => p.team_id === id)

  if (!team) {
    return (
      <Card>
        <p className="text-sm text-slate-400">Team not found.</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={team.name} subtitle={`Country: ${team.country}`} />
      <Card className="flex items-center gap-4">
        <img
          src={getImageUrl({ entity: team, bucket: 'team-logos' })}
          alt={team.name}
          className="h-20 w-20 rounded-2xl object-cover"
          loading="lazy"
          width={80}
          height={80}
        />
        <div>
          <p className="text-sm text-slate-400">Team Identity</p>
          <p className="font-display text-2xl">{team.short_name}</p>
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-400">Wins</p>
          <p className="mt-3 font-display text-2xl">32</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-400">Losses</p>
          <p className="mt-3 font-display text-2xl">18</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-widest text-slate-400">NRR</p>
          <p className="mt-3 font-display text-2xl">+0.67</p>
        </Card>
      </div>
      <Card>
        <p className="text-xs uppercase tracking-widest text-slate-400">Squad</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {squad.map((player) => (
            <Link key={player.id} to={`/players/${player.id}`} className="glass-card rounded-xl p-3">
              <p className="text-sm font-semibold">{player.full_name}</p>
              <p className="text-xs text-slate-400">{player.role}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default TeamDetailPage
