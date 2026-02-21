import type { Player } from '../../types'

interface OrderEditorProps {
  title: string
  players: Player[]
  order: string[]
  onChange: (order: string[]) => void
}

const OrderEditor = ({ title, players, order, onChange }: OrderEditorProps) => {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return
    const next = [...order]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-slate-400">{title}</p>
      <div className="space-y-2">
        {order.map((playerId, index) => {
          const player = players.find((p) => p.id === playerId)
          return (
            <div
              key={playerId}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold">{player?.full_name ?? playerId}</p>
                <p className="text-xs text-slate-400">{player?.role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  className="rounded-lg bg-white/10 px-2 py-1 text-xs"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  className="rounded-lg bg-white/10 px-2 py-1 text-xs"
                >
                  Down
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderEditor
