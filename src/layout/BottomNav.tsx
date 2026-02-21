import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const items = [
  { label: 'Home', path: '/' },
  { label: 'Matches', path: '/match' },
  { label: 'Rankings', path: '/rankings' },
  { label: 'Teams', path: '/teams' },
  { label: 'Profile', path: '/players' },
]

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/5 bg-navy-900/90 backdrop-blur lg:hidden">
    <div className="mx-auto flex max-w-6xl items-center justify-around px-4 py-3">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            clsx(
              'text-xs uppercase tracking-widest',
              isActive ? 'text-electric-400' : 'text-slate-400',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
)

export default BottomNav
