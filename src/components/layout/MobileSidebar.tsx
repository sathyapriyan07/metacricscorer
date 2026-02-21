import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useUiStore } from '../../store/useUiStore'
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

const MobileSidebar = () => {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const closeSidebar = useUiStore((s) => s.closeSidebar)
  const role = useAuthStore((s) => s.role)

  if (!sidebarOpen) return null

  return (
    <div className="glass-card mb-6 rounded-2xl p-4 lg:hidden">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-lg">Navigate</p>
        <button
          type="button"
          className="text-xs uppercase tracking-widest text-slate-400"
          onClick={closeSidebar}
        >
          Close
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              clsx(
                'rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-widest transition',
                isActive ? 'bg-brand-500 text-white' : 'bg-white/5 text-slate-300',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
        {role === 'ADMIN' ? (
          <NavLink
            to="/admin"
            onClick={closeSidebar}
            className={({ isActive }) =>
              clsx(
                'rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-widest transition',
                isActive ? 'bg-accent-500 text-white' : 'bg-white/5 text-slate-300',
              )
            }
          >
            Admin
          </NavLink>
        ) : null}
      </div>
    </div>
  )
}

export default MobileSidebar
