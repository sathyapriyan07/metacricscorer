export type Format = 'T20' | 'ODI' | 'TEST'
export type PitchType = 'FLAT' | 'GREEN' | 'DUSTY' | 'SLOW' | 'BOUNCY'

export interface PlayerInput {
  id: string
  short_name: string
  role: string
  skill_batting: number
  skill_bowling: number
}

export interface VenueInput {
  id: string
  pitch_type: PitchType
}

export interface MatchConfig {
  format: Format
  venue: VenueInput
  playingXIHome: PlayerInput[]
  playingXIAway: PlayerInput[]
  battingOrderHome: string[]
  battingOrderAway: string[]
  bowlingOrderHome: string[]
  bowlingOrderAway: string[]
  overs: number
}

export interface BallEvent {
  over: number
  ball: number
  batter_id: string
  non_striker_id: string
  bowler_id: string
  outcome: string
  dismissal_type?: string
}
