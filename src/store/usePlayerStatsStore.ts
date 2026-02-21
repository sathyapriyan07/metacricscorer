import { create } from 'zustand'
import type { CompetitionStatRow, Format, PlayerStats, RecentInningsRow } from '../types'
import { supabase } from '../services/supabase'

interface PlayerStatsState {
  loading: boolean
  error?: string
  stats: Record<string, PlayerStats | null>
  tournaments: CompetitionStatRow[]
  leagues: CompetitionStatRow[]
  recent: RecentInningsRow[]
  fetchStats: (playerId: string, format: Format) => Promise<void>
}

const emptyStats: PlayerStats = {
  player_id: '',
  format: 'T20',
  matches: 0,
  innings: 0,
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  fifties: 0,
  hundreds: 0,
  not_outs: 0,
  highest_score: 0,
  wickets: 0,
  overs: 0,
  runs_conceded: 0,
  four_fers: 0,
  five_fers: 0,
  best_figures: null,
  catches: 0,
  stumpings: 0,
}

export const usePlayerStatsStore = create<PlayerStatsState>((set) => ({
  loading: false,
  stats: {},
  tournaments: [],
  leagues: [],
  recent: [],
  fetchStats: async (playerId, format) => {
    set({ loading: true, error: undefined })
    try {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', playerId)
        .eq('format', format)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      const stats = (data ?? { ...emptyStats, player_id: playerId, format }) as PlayerStats

      // Placeholder data for tournaments/leagues/recent; replace with real queries.
      const tournaments: CompetitionStatRow[] = [
        {
          id: 't1',
          name: 'T20 World Cup',
          matches: 6,
          runs: 312,
          wickets: 2,
          average: 52.0,
          strikeRate: 138.2,
        },
      ]
      const leagues: CompetitionStatRow[] = [
        {
          id: 'l1',
          name: 'IPL',
          matches: 14,
          runs: 521,
          wickets: 3,
          average: 43.4,
          strikeRate: 146.8,
        },
      ]
      const recent: RecentInningsRow[] = [
        { id: 'r1', opponent: 'AUS', venue: 'MCG', runs: 72, balls: 48, strikeRate: 150 },
        { id: 'r2', opponent: 'ENG', venue: 'Lords', runs: 34, balls: 29, strikeRate: 117.2 },
        { id: 'r3', opponent: 'SA', venue: 'Joburg', runs: 112, balls: 92, strikeRate: 121.7 },
      ]

      set((state) => ({
        stats: { ...state.stats, [`${playerId}-${format}`]: stats },
        tournaments,
        leagues,
        recent,
        loading: false,
      }))
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load stats',
      })
    }
  },
}))
