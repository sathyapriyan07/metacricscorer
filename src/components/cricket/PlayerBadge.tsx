import type { Player } from '../../types'

interface PlayerBadgeProps {
  player: Player
  roleLabel?: string
  highlight?: boolean
}

const PlayerBadge = ({ player, roleLabel, highlight }: PlayerBadgeProps) => (
  <div
    className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
      highlight ? 'border-brand-500 bg-brand-500/20' : 'border-white/10 bg-white/5'
    }`}
  >
    <div>
      <p className="text-sm font-semibold">{player.full_name}</p>
      <p className="text-xs text-slate-400">{roleLabel ?? player.role}</p>
    </div>
    <p className="text-xs text-slate-300">{player.short_name}</p>
  </div>
)

export default PlayerBadge
