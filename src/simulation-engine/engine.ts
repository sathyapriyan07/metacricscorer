import { v4 as uuid } from 'uuid'
import type { BallEvent, Format, MatchConfig, MatchState, Player } from '../types'
import { buildOutcomeWeights, pickOutcome } from './probabilities'
import { MAX_BOWLER_OVERS } from '../utils/constants'

const dismissalTypes = [
  'BOWLED',
  'CAUGHT',
  'CAUGHT_BOWLED',
  'RUN_OUT',
  'STUMPED',
  'HIT_WICKET',
] as const

export const simulateBall = (
  config: MatchConfig,
  inningsIndex: number,
  striker: Player,
  nonStriker: Player,
  bowler: Player,
  state: MatchState,
): BallEvent => {
  const innings = state.innings[inningsIndex]
  const weights = buildOutcomeWeights({
    batter: striker,
    bowler,
    venue: config.venue,
    format: config.format,
    over: innings.over,
    balls: innings.balls,
    target: state.target,
    currentRuns: innings.runs,
  })

  const outcome = pickOutcome(weights)
  const isWicket = outcome === 'W'
  const dismissal =
    isWicket
      ? {
          type: dismissalTypes[Math.floor(Math.random() * dismissalTypes.length)],
        }
      : undefined

  return {
    id: uuid(),
    match_id: state.id,
    innings: inningsIndex + 1,
    over: innings.over,
    ball: innings.ballInOver + 1,
    batter_id: striker.id,
    non_striker_id: nonStriker.id,
    bowler_id: bowler.id,
    outcome,
    dismissal,
    commentary: `${striker.short_name} ${outcome === 'W' ? 'out!' : `scores ${outcome}`}`,
    timestamp: new Date().toISOString(),
  }
}

export const canBowlerBowl = (format: Format, bowlerId: string, history: string[]) => {
  const maxOvers = MAX_BOWLER_OVERS[format]
  const oversBowled = history.filter((id) => id === bowlerId).length
  if (format === 'TEST') return true
  return oversBowled < maxOvers
}

export const selectNextBowler = (
  bowlers: Player[],
  format: Format,
  bowlerHistory: string[],
) => {
  const lastBowler = bowlerHistory[bowlerHistory.length - 1]
  const eligible = bowlers.filter(
    (b) => b.id !== lastBowler && canBowlerBowl(format, b.id, bowlerHistory),
  )
  if (eligible.length === 0) return bowlers[0]
  return eligible[Math.floor(Math.random() * eligible.length)]
}

export const simulateOver = (
  config: MatchConfig,
  inningsIndex: number,
  state: MatchState,
  events: BallEvent[],
  battingOrder: Player[],
  bowlingAttack: Player[],
  bowlerHistory: string[],
) => {
  let innings = state.innings[inningsIndex]
  for (let ball = 0; ball < 6; ball += 1) {
    if (innings.wickets >= 10) break
    const striker = battingOrder.find((p) => p.id === innings.strikerId)!
    const nonStriker = battingOrder.find((p) => p.id === innings.nonStrikerId)!
    const bowler = bowlingAttack.find((p) => p.id === innings.bowlerId)!

    const event = simulateBall(config, inningsIndex, striker, nonStriker, bowler, state)
    events.push(event)
    innings.balls += 1
    innings.ballInOver += 1
    innings.recentBalls = [...innings.recentBalls.slice(-5), event.outcome]

    if (event.outcome === 'W') {
      innings.wickets += 1
      const nextIndex = innings.wickets + 1
      const nextBatter = battingOrder[nextIndex]
      if (nextBatter) {
        innings.strikerId = nextBatter.id
      }
    } else {
      innings.runs += Number(event.outcome)
      if (['1', '3'].includes(event.outcome)) {
        const temp = innings.strikerId
        innings.strikerId = innings.nonStrikerId
        innings.nonStrikerId = temp
      }
    }

    if (event.outcome === 'W' && innings.wickets >= 10) break
  }

  innings.over += 1
  innings.ballInOver = 0
  const temp = innings.strikerId
  innings.strikerId = innings.nonStrikerId
  innings.nonStrikerId = temp

  const nextBowler = selectNextBowler(bowlingAttack, config.format, bowlerHistory)
  bowlerHistory.push(nextBowler.id)
  innings.bowlerId = nextBowler.id
}

export const simulateInnings = (
  config: MatchConfig,
  inningsIndex: number,
  battingOrder: Player[],
  bowlingAttack: Player[],
  state: MatchState,
) => {
  const events: BallEvent[] = []
  const bowlerHistory: string[] = []

  const initialBowler = bowlingAttack[0]
  state.innings[inningsIndex].bowlerId = initialBowler.id
  bowlerHistory.push(initialBowler.id)

  const maxOvers = config.overs
  for (let over = 0; over < maxOvers; over += 1) {
    const innings = state.innings[inningsIndex]
    if (innings.wickets >= 10) break
    simulateOver(config, inningsIndex, state, events, battingOrder, bowlingAttack, bowlerHistory)
    if (state.target && innings.runs >= state.target) break
  }

  return events
}

export const createMatchState = (config: MatchConfig): MatchState => ({
  id: uuid(),
  format: config.format,
  venue: config.venue,
  innings: [
    {
      battingTeamId: config.homeTeam.id,
      bowlingTeamId: config.awayTeam.id,
      wickets: 0,
      runs: 0,
      balls: 0,
      strikerId: config.battingOrderHome[0],
      nonStrikerId: config.battingOrderHome[1],
      bowlerId: config.bowlingOrderAway[0],
      over: 0,
      ballInOver: 0,
      recentBalls: [],
    },
    {
      battingTeamId: config.awayTeam.id,
      bowlingTeamId: config.homeTeam.id,
      wickets: 0,
      runs: 0,
      balls: 0,
      strikerId: config.battingOrderAway[0],
      nonStrikerId: config.battingOrderAway[1],
      bowlerId: config.bowlingOrderHome[0],
      over: 0,
      ballInOver: 0,
      recentBalls: [],
    },
  ],
  status: 'LIVE',
})

export const simulateMatch = (config: MatchConfig) => {
  const state = createMatchState(config)

  const homeBatting = config.playingXIHome
  const awayBatting = config.playingXIAway
  const homeBowling = config.playingXIHome.filter((p) => p.role !== 'BAT')
  const awayBowling = config.playingXIAway.filter((p) => p.role !== 'BAT')
  const homeAttack = homeBowling.length ? homeBowling : config.playingXIHome
  const awayAttack = awayBowling.length ? awayBowling : config.playingXIAway

  const eventsFirst = simulateInnings(config, 0, homeBatting, awayAttack, state)
  state.target = state.innings[0].runs + 1
  const eventsSecond = simulateInnings(config, 1, awayBatting, homeAttack, state)
  state.status = 'COMPLETE'

  return { state, events: [...eventsFirst, ...eventsSecond] }
}

