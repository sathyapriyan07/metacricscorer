import type { Format, Player, Venue } from '../types'

export interface ProbabilityContext {
  batter: Player
  bowler: Player
  venue: Venue
  format: Format
  over: number
  balls: number
  target?: number
  currentRuns: number
}

export interface OutcomeWeights {
  dot: number
  one: number
  two: number
  three: number
  four: number
  six: number
  wicket: number
}

const pitchModifiers: Record<Venue['pitch_type'], Partial<OutcomeWeights>> = {
  FLAT: { four: 1.1, six: 1.1, wicket: 0.9 },
  GREEN: { dot: 1.1, wicket: 1.2 },
  DUSTY: { dot: 1.05, two: 1.1, wicket: 1.1 },
  SLOW: { dot: 1.1, one: 1.05, four: 0.9, six: 0.85 },
  BOUNCY: { wicket: 1.15, four: 1.05 },
}

const formatModifiers: Record<Format, Partial<OutcomeWeights>> = {
  T20: { four: 1.15, six: 1.2, wicket: 1.1, dot: 0.9 },
  ODI: { four: 1.05, six: 1.05, wicket: 1.0 },
  TEST: { dot: 1.2, one: 0.95, four: 0.9, six: 0.75, wicket: 0.9 },
}

export const buildOutcomeWeights = (context: ProbabilityContext): OutcomeWeights => {
  const skillDiff = (context.batter.skill_batting - context.bowler.skill_bowling) / 100
  const base: OutcomeWeights = {
    dot: 0.28,
    one: 0.32,
    two: 0.12,
    three: 0.02,
    four: 0.14,
    six: 0.06,
    wicket: 0.06,
  }

  base.four += skillDiff * 0.05
  base.six += skillDiff * 0.03
  base.dot -= skillDiff * 0.02
  base.wicket -= skillDiff * 0.02

  const powerplay = context.format !== 'TEST' && context.over < (context.format === 'T20' ? 6 : 10)
  const deathOver = context.format !== 'TEST' && context.over >= (context.format === 'T20' ? 16 : 40)

  if (powerplay) {
    base.four *= 1.1
    base.six *= 1.05
    base.wicket *= 1.05
  }

  if (deathOver) {
    base.four *= 1.2
    base.six *= 1.25
    base.wicket *= 1.15
    base.dot *= 0.85
  }

  if (context.target) {
    const oversPlayed = Math.max(context.balls / 6, 0.1)
    const requiredRate = (context.target - context.currentRuns) / oversPlayed
    if (requiredRate > 9) {
      base.four *= 1.15
      base.six *= 1.2
      base.wicket *= 1.2
      base.dot *= 0.9
    }
  }

  const pitchMod = pitchModifiers[context.venue.pitch_type]
  const formatMod = formatModifiers[context.format]

  const applyMods = (mod?: Partial<OutcomeWeights>) => {
    if (!mod) return
    Object.entries(mod).forEach(([key, value]) => {
      base[key as keyof OutcomeWeights] *= value ?? 1
    })
  }

  applyMods(pitchMod)
  applyMods(formatMod)

  return normalizeWeights(base)
}

export const normalizeWeights = (weights: OutcomeWeights): OutcomeWeights => {
  const total =
    weights.dot +
    weights.one +
    weights.two +
    weights.three +
    weights.four +
    weights.six +
    weights.wicket
  return {
    dot: weights.dot / total,
    one: weights.one / total,
    two: weights.two / total,
    three: weights.three / total,
    four: weights.four / total,
    six: weights.six / total,
    wicket: weights.wicket / total,
  }
}

export const pickOutcome = (weights: OutcomeWeights) => {
  const roll = Math.random()
  let cursor = weights.dot
  if (roll < cursor) return '0'
  cursor += weights.one
  if (roll < cursor) return '1'
  cursor += weights.two
  if (roll < cursor) return '2'
  cursor += weights.three
  if (roll < cursor) return '3'
  cursor += weights.four
  if (roll < cursor) return '4'
  cursor += weights.six
  if (roll < cursor) return '6'
  return 'W'
}

