import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'

const HomePage = lazy(() => import('./pages/HomePage'))
const QuickMatchPage = lazy(() => import('./pages/QuickMatchPage'))
const MatchSimulationPage = lazy(() => import('./pages/MatchSimulationPage'))
const ScorecardPage = lazy(() => import('./pages/ScorecardPage'))
const SeriesPage = lazy(() => import('./pages/SeriesPage'))
const TournamentsPage = lazy(() => import('./pages/TournamentsPage'))
const LeaguesPage = lazy(() => import('./pages/LeaguesPage'))
const RankingsPage = lazy(() => import('./pages/RankingsPage'))
const TeamsPage = lazy(() => import('./pages/TeamsPage'))
const TeamDetailPage = lazy(() => import('./pages/TeamDetailPage'))
const PlayersPage = lazy(() => import('./pages/PlayersPage'))
const PlayerDetailPage = lazy(() => import('./pages/PlayerDetailPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const App = () => (
  <AppShell>
    <Suspense fallback={<div className="text-sm text-slate-400">Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quick-match" element={<QuickMatchPage />} />
        <Route path="/match" element={<MatchSimulationPage />} />
        <Route path="/match/scorecard" element={<ScorecardPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/leagues" element={<LeaguesPage />} />
        <Route path="/rankings" element={<RankingsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:id" element={<PlayerDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </AppShell>
)

export default App
