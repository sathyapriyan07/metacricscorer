import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlassCard from '../components/layout/GlassCard'
import { useCatalogStore } from '../store/useCatalogStore'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Tabs from '../components/layout/Tabs'
import StatsTab from '../components/player/StatsTab'
import Card from '../components/ui/Card'
import StatPill from '../components/ui/StatPill'
import { getImageUrl } from '../utils/imageHelper'

const PlayerDetailPage = () => {
  const { id } = useParams()
  const { players, teams } = useCatalogStore()
  const player = players.find((p) => p.id === id)
  const team = teams.find((t) => t.id === player?.team_id)

  const performance = useMemo(
    () =>
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
        month,
        runs: (player?.skill_batting ?? 40) + index * 4,
      })),
    [player],
  )

  const [activeTab, setActiveTab] = useState('Overview')

  if (!player) {
    return (
      <GlassCard>
        <p className="text-sm text-slate-400">Player not found.</p>
      </GlassCard>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="relative overflow-hidden bg-section-gradient">
        <div className="absolute inset-0 bg-hero-grid opacity-40" />
        <div className="relative z-10 flex flex-wrap items-center gap-6">
          <img
            src={getImageUrl({ entity: player, bucket: 'player-images' })}
            alt={player.full_name}
            className="h-24 w-24 rounded-full object-cover"
            loading="lazy"
            width={96}
            height={96}
          />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-slate-400">Player Profile</p>
            <h1 className="mt-2 font-display text-3xl">{player.full_name}</h1>
            <p className="text-sm text-slate-400">{team?.name ?? 'Free Agent'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatPill label="Role" value={player.role} />
              <StatPill label="Country" value={player.country ?? '—'} />
            </div>
          </div>
          <div className="grid gap-2 text-right">
            <div className="text-xs uppercase tracking-widest text-slate-400">Career Summary</div>
            <div className="text-sm text-slate-300">Runs 12450 • Wkts 210</div>
          </div>
        </div>
      </Card>
      <Tabs
        tabs={['Overview', 'Stats', 'Performance', 'Career Timeline']}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'Overview' ? (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <p className="text-xs uppercase tracking-widest text-slate-400">Batting Skill</p>
              <p className="mt-3 font-display text-2xl">{player.skill_batting}</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-widest text-slate-400">Bowling Skill</p>
              <p className="mt-3 font-display text-2xl">{player.skill_bowling}</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-widest text-slate-400">Fielding Skill</p>
              <p className="mt-3 font-display text-2xl">{player.skill_fielding}</p>
            </Card>
          </div>
        </>
      ) : null}

      {activeTab === 'Stats' ? <StatsTab player={player} /> : null}

      {activeTab === 'Performance' ? (
        <Card className="h-64">
          <p className="text-xs uppercase tracking-widest text-slate-400">Performance Trend</p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="runs" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : null}

      {activeTab === 'Career Timeline' ? (
        <Card>
          <p className="text-sm text-slate-400">Timeline coming soon.</p>
        </Card>
      ) : null}
    </div>
  )
}

export default PlayerDetailPage
