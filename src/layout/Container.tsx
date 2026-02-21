import type { ReactNode } from 'react'

const Container = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-4 pb-10">{children}</div>
)

export default Container
