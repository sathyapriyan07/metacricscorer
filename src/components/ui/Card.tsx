import type { ReactNode } from 'react'
import clsx from 'clsx'

const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx('glass-card rounded-2xl p-5 card-hover', className)}>{children}</div>
)

export default Card
