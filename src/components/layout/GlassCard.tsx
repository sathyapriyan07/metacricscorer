import type { ReactNode } from 'react'
import clsx from 'clsx'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

const GlassCard = ({ children, className }: GlassCardProps) => (
  <div className={clsx('glass-card rounded-2xl p-5', className)}>{children}</div>
)

export default GlassCard
