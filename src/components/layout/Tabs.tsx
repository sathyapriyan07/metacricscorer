import clsx from 'clsx'

interface TabsProps {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

const Tabs = ({ tabs, active, onChange }: TabsProps) => (
  <div className="flex flex-wrap gap-2">
    {tabs.map((tab) => (
      <button
        key={tab}
        className={clsx(
          'rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition',
          active === tab
            ? 'bg-brand-500 text-white shadow-glow'
            : 'bg-white/5 text-slate-300 hover:bg-white/10',
        )}
        onClick={() => onChange(tab)}
        type="button"
      >
        {tab}
      </button>
    ))}
  </div>
)

export default Tabs
