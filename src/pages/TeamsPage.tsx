import { Link } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import { useCatalogStore } from '../store/useCatalogStore'
import { getImageUrl } from '../utils/imageHelper'

const TeamsPage = () => {
  const { teams } = useCatalogStore()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Teams" subtitle="National and league squads." />
      <div className="grid gap-4 lg:grid-cols-3">
        {teams.map((team) => (
          <Link key={team.id} to={`/teams/${team.id}`}>
            <Card>
              <div className="flex items-center gap-3">
                <img
                  src={getImageUrl({ entity: team, bucket: 'team-logos' })}
                  alt={team.name}
                  className="h-12 w-12 rounded-xl object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  width={48}
                  height={48}
                />
                <div>
                  <p className="font-display text-xl">{team.name}</p>
                  <p className="text-sm text-slate-400">{team.country}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TeamsPage
