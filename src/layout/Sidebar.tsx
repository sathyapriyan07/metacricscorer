import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '../store/useAuthStore'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Quick Match', path: '/quick-match' },
  { label: 'Series', path: '/series' },
  { label: 'Tournaments', path: '/tournaments' },
  { label: 'Leagues', path: '/leagues' },
  { label: 'Rankings', path: '/rankings' },
  { label: 'Teams', path: '/teams' },
  { label: 'Players', path: '/players' },
]

const Sidebar = () => {
  const role = useAuthStore((s) => s.role)
  return (
    <aside className="hidden w-64 flex-col gap-6 border-r border-white/5 bg-navy-900/60 px-5 py-8 lg:flex">
      <div>
        <p className="font-display text-2xl text-white">CricScorer</p>
        <p className="text-xs text-slate-400">Live Simulation Hub</p>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'rounded-xl px-3 py-2 text-sm font-semibold tracking-wide transition',
                isActive
                  ? 'bg-electric-500/20 text-electric-400'
                  : 'text-slate-300 hover:bg-white/5',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
        {role === 'ADMIN' ? (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              clsx(
                'rounded-xl px-3 py-2 text-sm font-semibold tracking-wide transition',
                isActive ? 'bg-live-500/20 text-live-400' : 'text-slate-300 hover:bg-white/5',
              )
            }
          >
            Admin
          </NavLink>
        ) : null}
      </nav>
    </aside>
  )
}

export default Sidebar
