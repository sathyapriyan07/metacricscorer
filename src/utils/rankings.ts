import type { Format } from '../types'

export interface RankingInput {
  format: Format
  matches: number
  runs: number
  wickets: number
  strikeRate: number
  economy: number
  average: number
  catches: number
  stumpings: number
}

export const rankingScore = (input: RankingInput) => {
  const battingWeight = input.format === 'TEST' ? 0.55 : 0.5
  const bowlingWeight = input.format === 'TEST' ? 0.4 : 0.45
  const fieldWeight = 0.05

  const battingScore =
    input.runs * 0.4 +
    input.strikeRate * (input.format === 'TEST' ? 0.1 : 0.25) +
    input.average * 1.5

  const bowlingScore =
    input.wickets * 15 +
    (input.economy === 0 ? 0 : (8 / input.economy) * 20)

  const fieldingScore = (input.catches + input.stumpings) * 4

  return Number(
    (
      battingScore * battingWeight +
      bowlingScore * bowlingWeight +
      fieldingScore * fieldWeight
    ).toFixed(2),
  )
}

