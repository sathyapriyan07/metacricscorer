import { BallEvent, MatchConfig, PlayerInput } from './types.ts'

const dismissalTypes = [
  'BOWLED',
  'CAUGHT',
  'CAUGHT_BOWLED',
  'RUN_OUT',
  'STUMPED',
  'HIT_WICKET',
]

const pitchMods: Record<string, number> = {
  FLAT: 1.05,
  GREEN: 0.95,
  DUSTY: 0.98,
  SLOW: 0.93,
  BOUNCY: 1.0,
}

const formatBoundaryBoost: Record<string, number> = {
  T20: 1.15,
  ODI: 1.05,
  TEST: 0.9,
}

const weightedOutcome = (bat: PlayerInput, bowl: PlayerInput, format: string, pitch: string) => {
  const skillDiff = (bat.skill_batting - bowl.skill_bowling) / 100
  let four = 0.14 + skillDiff * 0.05
  let six = 0.06 + skillDiff * 0.03
  let wicket = 0.06 - skillDiff * 0.02
  let dot = 0.28 - skillDiff * 0.02
  const one = 0.32
  const two = 0.12
  const three = 0.02

  const pitchMod = pitchMods[pitch] ?? 1
  four *= pitchMod
  six *= pitchMod
  wicket *= 2 - pitchMod

  const fmt = formatBoundaryBoost[format] ?? 1
  four *= fmt
  six *= fmt
  dot *= 2 - fmt

  const total = dot + one + two + three + four + six + wicket
  const roll = Math.random() * total

  let cursor = dot
  if (roll < cursor) return '0'
  cursor += one
  if (roll < cursor) return '1'
  cursor += two
  if (roll < cursor) return '2'
  cursor += three
  if (roll < cursor) return '3'
  cursor += four
  if (roll < cursor) return '4'
  cursor += six
  if (roll < cursor) return '6'
  return 'W'
}

export const simulateInnings = (
  config: MatchConfig,
  battingOrder: PlayerInput[],
  bowlingAttack: PlayerInput[],
) => {
  const events: BallEvent[] = []
  let strikerIndex = 0
  let nonStrikerIndex = 1
  let wickets = 0
  let bowlerIndex = 0

  for (let over = 0; over < config.overs; over += 1) {
    for (let ball = 0; ball < 6; ball += 1) {
      if (wickets >= 10) break
      const striker = battingOrder[strikerIndex]
      const nonStriker = battingOrder[nonStrikerIndex]
      const bowler = bowlingAttack[bowlerIndex]
      const outcome = weightedOutcome(striker, bowler, config.format, config.venue.pitch_type)

      events.push({
        over,
        ball: ball + 1,
        batter_id: striker.id,
        non_striker_id: nonStriker.id,
        bowler_id: bowler.id,
        outcome,
        dismissal_type:
          outcome === 'W'
            ? dismissalTypes[Math.floor(Math.random() * dismissalTypes.length)]
            : undefined,
      })

      if (outcome === 'W') {
        wickets += 1
        strikerIndex = wickets + 1
      } else if (outcome === '1' || outcome === '3') {
        const temp = strikerIndex
        strikerIndex = nonStrikerIndex
        nonStrikerIndex = temp
      }
    }
    const temp = strikerIndex
    strikerIndex = nonStrikerIndex
    nonStrikerIndex = temp

    bowlerIndex = (bowlerIndex + 1) % bowlingAttack.length
  }

  return events
}
