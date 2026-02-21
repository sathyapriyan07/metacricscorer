import LiveBadge from '../components/ui/LiveBadge'

const Header = () => (
  <header className="sticky top-0 z-20 border-b border-white/5 bg-navy-900/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3">
        <LiveBadge label="Live Engine" />
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Cricscorer</div>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-slate-200">
          Notifications
        </button>
        <div className="h-10 w-10 rounded-full bg-electric-500/50" />
      </div>
    </div>
  </header>
)

export default Header
