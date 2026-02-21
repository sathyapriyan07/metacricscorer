const StatPill = ({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'live' | 'positive' | 'danger' }) => {
  const toneClass =
    tone === 'live'
      ? 'bg-live-500/20 text-live-400'
      : tone === 'positive'
        ? 'bg-emerald-500/20 text-emerald-400'
        : tone === 'danger'
          ? 'bg-red-500/20 text-red-400'
          : 'bg-white/10 text-slate-200'
  return (
    <div className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest ${toneClass}`}>
      {label}: <span className="font-semibold">{value}</span>
    </div>
  )
}

export default StatPill
