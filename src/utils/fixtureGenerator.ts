import type { Team } from '../types'

export interface Fixture {
  id: string
  homeTeamId: string
  awayTeamId: string
  matchDay: number
}

export const generateRoundRobinFixtures = (teams: Team[]) => {
  const fixtures: Fixture[] = []
  const teamIds = teams.map((t) => t.id)
  if (teamIds.length % 2 !== 0) {
    teamIds.push('BYE')
  }

  const rounds = teamIds.length - 1
  const half = teamIds.length / 2
  const rotation = [...teamIds]

  for (let round = 0; round < rounds; round += 1) {
    for (let i = 0; i < half; i += 1) {
      const home = rotation[i]
      const away = rotation[rotation.length - 1 - i]
      if (home !== 'BYE' && away !== 'BYE') {
        fixtures.push({
          id: `${round + 1}-${home}-${away}`,
          homeTeamId: round % 2 === 0 ? home : away,
          awayTeamId: round % 2 === 0 ? away : home,
          matchDay: round + 1,
        })
      }
    }

    rotation.splice(1, 0, rotation.pop()!)
  }

  return fixtures
}

