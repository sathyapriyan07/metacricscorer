import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import SectionHeader from '../components/ui/SectionHeader'
import LiveBadge from '../components/ui/LiveBadge'
import StatPill from '../components/ui/StatPill'

const homeTabs = [
  { label: 'Quick Match', path: '/quick-match' },
  { label: 'Series', path: '/series' },
  { label: 'Tournaments', path: '/tournaments' },
  { label: 'Leagues', path: '/leagues' },
  { label: 'Rankings', path: '/rankings' },
  { label: 'Teams', path: '/teams' },
  { label: 'Players', path: '/players' },
]

const HomePage = () => {
  const [activeTab, setActiveTab] = useState(homeTabs[0].label)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cricket Simulation Hub"
        subtitle="Live score intelligence meets premium analytics."
      />
      <div className="flex flex-wrap gap-2">
        {homeTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                isActive ? 'bg-electric-500/20 text-electric-400' : 'bg-white/5 text-slate-300'
              }`
            }
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-section-gradient p-6 lg:p-10">
        <div className="absolute inset-0 bg-hero-grid opacity-60" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <LiveBadge label="Live" />
              <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Quick Match</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl">
              India vs Australia • T20 Live Engine
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Set pitch conditions, tweak orders, and simulate full innings with pressure-aware logic.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <StatPill label="Target" value="168" tone="live" />
              <StatPill label="Overs" value="20" />
              <StatPill label="Venue" value="Wankhede" />
            </div>
            <NavLink
              to="/quick-match"
              className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-live-500 to-danger-500 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-all duration-300 ease-out hover:scale-[1.02]"
            >
              Start Quick Match
            </NavLink>
          </div>
          <Card className="bg-navy-900/70">
            <p className="text-xs uppercase tracking-widest text-slate-400">Live Banner</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>IND</span>
                <span className="font-semibold">120/3 (15.2)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AUS</span>
                <span className="text-slate-400">Yet to bat</span>
              </div>
              <div className="rounded-xl bg-white/5 px-3 py-2 text-xs uppercase tracking-widest text-live-400">
                Required RR 8.45
              </div>
            </div>
          </Card>
        </div>
      </div>

      <SectionHeader title="Live Matches" subtitle="Live Matches" />
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {['IND vs AUS', 'ENG vs SA', 'PAK vs NZ'].map((match) => (
          <Card key={match} className="min-w-[240px]">
            <p className="text-xs uppercase tracking-widest text-slate-400">Live</p>
            <p className="mt-3 font-display text-xl">{match}</p>
            <p className="text-sm text-slate-400">120/3 • 15.2 ov</p>
          </Card>
        ))}
      </div>

      <SectionHeader title="Tournaments" subtitle="Tournaments" />
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {['T20 WC', 'ODI WC', 'IPL 2026'].map((item) => (
          <Card key={item} className="min-w-[220px]">
            <p className="text-xs uppercase tracking-widest text-slate-400">Featured</p>
            <p className="mt-3 font-display text-xl">{item}</p>
          </Card>
        ))}
      </div>

      <SectionHeader title="Top Players" subtitle="Top Players" />
      <div className="grid gap-4 lg:grid-cols-3">
        {['Kohli', 'Bumrah', 'Smith'].map((player) => (
          <Card key={player}>
            <p className="text-xs uppercase tracking-widest text-slate-400">Ranked</p>
            <p className="mt-2 font-display text-2xl">{player}</p>
            <p className="text-sm text-slate-400">Form Index 92</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default HomePage
