interface StatCardProps {
  label: string
  value: string
  hint?: string
}

const StatCard = ({ label, value, hint }: StatCardProps) => (
  <div className="glass-card rounded-xl px-4 py-3">
    <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
    <p className="mt-2 font-display text-2xl">{value}</p>
    {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
  </div>
)

export default StatCard
