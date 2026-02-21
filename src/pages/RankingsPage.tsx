import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Tabs from '../components/layout/Tabs'
import Card from '../components/ui/Card'
import { useCatalogStore } from '../store/useCatalogStore'

const formats = ['ODI', 'T20', 'TEST']

const RankingsPage = () => {
  const [activeFormat, setActiveFormat] = useState(formats[0])
  const players = useCatalogStore((s) => s.players)
  const topPlayers = [...players]
    .sort((a, b) => b.skill_batting + b.skill_bowling - (a.skill_batting + a.skill_bowling))
    .slice(0, 10)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Rankings" subtitle="Top 10 players per format." />
      <Tabs tabs={formats} active={activeFormat} onChange={setActiveFormat} />
      <div className="grid gap-4 lg:grid-cols-3">
        {['Batsman', 'Bowler', 'Allrounder'].map((category) => (
          <Card key={category}>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              {activeFormat} {category}
            </p>
            <div className="mt-4 space-y-2">
              {topPlayers.slice(0, 4).map((player, index) => (
                <div key={player.id} className="flex items-center justify-between text-sm">
                  <span>
                    {index + 1}. {player.full_name}
                  </span>
                  <span className="text-slate-500">{player.skill_batting + player.skill_bowling}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RankingsPage
