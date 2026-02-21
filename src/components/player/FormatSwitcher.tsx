interface FormatSwitcherProps {
  value: string
  onChange: (value: string) => void
}

const FormatSwitcher = ({ value, onChange }: FormatSwitcherProps) => (
  <div className="sticky top-4 z-10 flex flex-wrap gap-2 rounded-2xl bg-ink-800/70 p-2 backdrop-blur">
    {['ODI', 'T20', 'TEST'].map((fmt) => (
      <button
        key={fmt}
        type="button"
        onClick={() => onChange(fmt)}
        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
          value === fmt ? 'bg-brand-500 text-white shadow-glow' : 'bg-white/5 text-slate-300'
        }`}
      >
        {fmt}
      </button>
    ))}
  </div>
)

export default FormatSwitcher
