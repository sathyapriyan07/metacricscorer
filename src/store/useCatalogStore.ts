import { create } from 'zustand'
import type { Player, Team, Venue } from '../types'
import { fetchPlayers, fetchTeams, fetchVenues } from '../services/api'
import { samplePlayers, sampleTeams, sampleVenues } from '../utils/sampleData'

interface CatalogState {
  teams: Team[]
  players: Player[]
  venues: Venue[]
  loading: boolean
  error?: string
  hydrate: () => Promise<void>
}

export const useCatalogStore = create<CatalogState>((set) => ({
  teams: sampleTeams,
  players: samplePlayers,
  venues: sampleVenues,
  loading: false,
  hydrate: async () => {
    set({ loading: true, error: undefined })
    try {
      const [teams, players, venues] = await Promise.all([
        fetchTeams(),
        fetchPlayers(),
        fetchVenues(),
      ])
      set({
        teams: teams.length ? teams : sampleTeams,
        players: players.length ? players : samplePlayers,
        venues: venues.length ? venues : sampleVenues,
      })
    } catch (err) {
      set({
        teams: sampleTeams,
        players: samplePlayers,
        venues: sampleVenues,
        error: err instanceof Error ? err.message : 'Failed to load catalog',
      })
    } finally {
      set({ loading: false })
    }
  },
}))

