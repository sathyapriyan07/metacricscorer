import type { CompetitionStatRow } from '../../types'

const TournamentStatsTable = ({ title, rows }: { title: string; rows: CompetitionStatRow[] }) => (
  <div className="glass-card rounded-2xl p-5">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-display text-lg">{title}</h3>
      <span className="text-xs uppercase tracking-widest text-slate-400">{rows.length}</span>
    </div>
    {rows.length === 0 ? (
      <p className="text-sm text-slate-400">No Data Yet</p>
    ) : (
      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="py-2">Name</th>
              <th>Mat</th>
              <th>Runs</th>
              <th>Wkts</th>
              <th>Avg</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="py-2">{row.name}</td>
                <td>{row.matches}</td>
                <td>{row.runs}</td>
                <td>{row.wickets}</td>
                <td>{row.average}</td>
                <td>{row.strikeRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

export default TournamentStatsTable
