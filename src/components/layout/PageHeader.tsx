import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="font-display text-3xl text-glow">{title}</h1>
      {subtitle ? <p className="text-slate-400">{subtitle}</p> : null}
    </div>
    {actions ? <div>{actions}</div> : null}
  </div>
)

export default PageHeader
