import type { Format } from '../types'

export const FORMAT_OVERS: Record<Format, number> = {
  T20: 20,
  ODI: 50,
  TEST: 90,
}

export const MAX_BOWLER_OVERS: Record<Format, number> = {
  T20: 4,
  ODI: 10,
  TEST: 999,
}

export const POWERPLAY_OVERS: Record<Format, number> = {
  T20: 6,
  ODI: 10,
  TEST: 0,
}

