import { create } from 'zustand'
import type { BallEvent, MatchConfig, MatchState } from '../types'
import { simulateMatch } from '../simulation-engine/engine'

interface MatchStore {
  config?: MatchConfig
  state?: MatchState
  events: BallEvent[]
  setConfig: (config: MatchConfig) => void
  simulate: () => void
  reset: () => void
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  events: [],
  setConfig: (config) => set({ config }),
  simulate: () => {
    const config = get().config
    if (!config) return
    const result = simulateMatch(config)
    set({ state: result.state, events: result.events })
  },
  reset: () => set({ config: undefined, state: undefined, events: [] }),
}))

