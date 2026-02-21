import type { RecentInningsRow } from '../../types'

const RecentPerformances = ({ rows, isBowler }: { rows: RecentInningsRow[]; isBowler: boolean }) => (
  <div className="glass-card rounded-2xl p-5">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-display text-lg">Recent Form</h3>
      <span className="text-xs uppercase tracking-widest text-slate-400">{rows.length}</span>
    </div>
    {rows.length === 0 ? (
      <p className="text-sm text-slate-400">No Data Yet</p>
    ) : (
      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="py-2">Opponent</th>
              <th>Venue</th>
              <th>Runs</th>
              <th>Balls</th>
              <th>SR</th>
              {isBowler ? (
                <>
                  <th>Wkts</th>
                  <th>Overs</th>
                  <th>Econ</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="py-2">{row.opponent}</td>
                <td>{row.venue}</td>
                <td className={row.runs >= 100 ? 'text-emerald-400' : ''}>{row.runs}</td>
                <td>{row.balls}</td>
                <td>{row.strikeRate}</td>
                {isBowler ? (
                  <>
                    <td>{row.wickets ?? '-'}</td>
                    <td>{row.overs ?? '-'}</td>
                    <td>{row.economy ?? '-'}</td>
                  </>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

export default RecentPerformances
