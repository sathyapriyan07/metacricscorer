import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '../../store/useAuthStore'

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
    <aside className="glass-card hidden w-64 flex-col gap-6 rounded-3xl p-6 lg:flex">
      <div>
        <p className="font-display text-2xl text-glow">CricScorer</p>
        <p className="text-xs text-slate-400">Simulation Command Center</p>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'rounded-xl px-3 py-2 text-sm font-semibold tracking-wide transition',
                isActive ? 'bg-brand-500 text-white' : 'text-slate-300 hover:bg-white/10',
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
                isActive ? 'bg-accent-500 text-white' : 'text-slate-300 hover:bg-white/10',
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
