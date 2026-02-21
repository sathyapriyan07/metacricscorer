import type { Player, Team, Venue } from '../types'

export const sampleTeams: Team[] = [
  { id: 'ind', name: 'India', short_name: 'IND', country: 'India' },
  { id: 'aus', name: 'Australia', short_name: 'AUS', country: 'Australia' },
  { id: 'eng', name: 'England', short_name: 'ENG', country: 'England' },
  { id: 'sa', name: 'South Africa', short_name: 'SA', country: 'South Africa' },
]

export const samplePlayers: Player[] = [
  {
    id: 'p1',
    full_name: 'Virat Kohli',
    short_name: 'Kohli',
    role: 'BAT',
    batting_style: 'RHB',
    bowling_style: 'RA',
    country: 'India',
    skill_batting: 92,
    skill_bowling: 48,
    skill_fielding: 84,
    team_id: 'ind',
  },
  {
    id: 'p2',
    full_name: 'Jasprit Bumrah',
    short_name: 'Bumrah',
    role: 'BOWL',
    batting_style: 'RHB',
    bowling_style: 'RF',
    country: 'India',
    skill_batting: 35,
    skill_bowling: 95,
    skill_fielding: 80,
    team_id: 'ind',
  },
  {
    id: 'p3',
    full_name: 'Steve Smith',
    short_name: 'Smith',
    role: 'BAT',
    batting_style: 'RHB',
    bowling_style: 'RA',
    country: 'Australia',
    skill_batting: 88,
    skill_bowling: 55,
    skill_fielding: 82,
    team_id: 'aus',
  },
  {
    id: 'p4',
    full_name: 'Pat Cummins',
    short_name: 'Cummins',
    role: 'BOWL',
    batting_style: 'RHB',
    bowling_style: 'RF',
    country: 'Australia',
    skill_batting: 45,
    skill_bowling: 93,
    skill_fielding: 86,
    team_id: 'aus',
  },
]

export const sampleVenues: Venue[] = [
  {
    id: 'v1',
    name: 'Wankhede Stadium',
    city: 'Mumbai',
    country: 'India',
    pitch_type: 'FLAT',
  },
  {
    id: 'v2',
    name: 'MCG',
    city: 'Melbourne',
    country: 'Australia',
    pitch_type: 'BOUNCY',
  },
]

