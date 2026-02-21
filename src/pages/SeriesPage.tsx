import PageHeader from '../components/layout/PageHeader'
import GlassCard from '../components/layout/GlassCard'

const SeriesPage = () => (
  <div className="flex flex-col gap-6">
    <PageHeader title="Series" subtitle="Multi-match series with auto-simulated results." />
    <GlassCard>
      <p className="text-sm text-slate-300">Series management module ready for fixtures.</p>
    </GlassCard>
  </div>
)

export default SeriesPage
