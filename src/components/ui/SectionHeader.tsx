interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{title}</p>
      {subtitle ? <h2 className="mt-2 font-display text-2xl">{subtitle}</h2> : null}
    </div>
    {action ? <div>{action}</div> : null}
  </div>
)

export default SectionHeader
