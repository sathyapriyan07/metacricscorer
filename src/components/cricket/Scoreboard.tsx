import type { InningsState } from '../../types'
import { toOvers } from '../../utils/formatters'

interface ScoreboardProps {
  innings: InningsState
  teamName: string
}

const Scoreboard = ({ innings, teamName }: ScoreboardProps) => (
  <div className="glass-card rounded-2xl p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Live</p>
        <p className="font-display text-2xl">{teamName}</p>
      </div>
      <div className="text-right">
        <p className="font-display text-3xl">
          {innings.runs}/{innings.wickets}
        </p>
        <p className="text-sm text-slate-400">{toOvers(innings.balls)} ov</p>
      </div>
    </div>
  </div>
)

export default Scoreboard
