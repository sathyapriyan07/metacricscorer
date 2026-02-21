import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'
import { useCatalogStore } from '../../store/useCatalogStore'
import Header from '../../layout/Header'
import Sidebar from '../../layout/Sidebar'
import Container from '../../layout/Container'
import BottomNav from '../../layout/BottomNav'

interface AppShellProps {
  children: ReactNode
}

const AppShell = ({ children }: AppShellProps) => (
  <ShellBody>{children}</ShellBody>
)

const ShellBody = ({ children }: AppShellProps) => {
  useSupabaseAuth()
  const hydrate = useCatalogStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])
  return (
    <div className="min-h-screen bg-hero-grid pb-16">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl gap-0 lg:gap-6">
        <Sidebar />
        <Container>
          <main className="flex flex-col gap-8 pt-6">{children}</main>
        </Container>
      </div>
      <BottomNav />
    </div>
  )
}

export default AppShell
