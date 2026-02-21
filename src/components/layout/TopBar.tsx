import { useAuthStore } from '../../store/useAuthStore'
import { useUiStore } from '../../store/useUiStore'

const TopBar = () => {
  const role = useAuthStore((s) => s.role)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <button
        type="button"
        className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200 lg:hidden"
        onClick={toggleSidebar}
      >
        Menu
      </button>
      <div className="hidden lg:block">
        <p className="text-sm text-slate-400">Role</p>
        <p className="font-display text-lg">{role}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="glass-card rounded-full px-4 py-2 text-xs uppercase tracking-widest text-slate-200">
          Live Engine
        </div>
        <div className="h-10 w-10 rounded-full bg-brand-500/70" />
      </div>
    </header>
  )
}

export default TopBar
