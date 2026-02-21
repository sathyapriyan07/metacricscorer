export type Format = 'T20' | 'ODI' | 'TEST'
export type Role = 'BAT' | 'BOWL' | 'AR' | 'WK'
export type UserRole = 'USER' | 'ADMIN'

export interface Player {
  id: string
  full_name: string
  short_name: string
  role: Role
  batting_style: string
  bowling_style: string
  country: string
  skill_batting: number
  skill_bowling: number
  skill_fielding: number
  team_id?: string
  image_url?: string | null
  image_path?: string | null
}

export interface Team {
  id: string
  name: string
  short_name: string
  country: string
  badge_url?: string
  logo_url?: string | null
  logo_path?: string | null
}

export interface Venue {
  id: string
  name: string
  city: string
  country: string
  pitch_type: 'FLAT' | 'GREEN' | 'DUSTY' | 'SLOW' | 'BOUNCY'
}

export interface Tournament {
  id: string
  name: string
  format: Format
  is_league: boolean
  start_date?: string
  end_date?: string
  logo_url?: string | null
  logo_path?: string | null
}

export interface League {
  id: string
  name: string
  format: Format
  start_date?: string
  end_date?: string
  logo_url?: string | null
  logo_path?: string | null
}

export interface Series {
  id: string
  name: string
  format: Format
  start_date?: string
  end_date?: string
}

export interface Fixture {
  id: string
  tournament_id?: string
  series_id?: string
  home_team_id: string
  away_team_id: string
  venue_id: string
  scheduled_at: string
  status: string
}

export interface MatchConfig {
  format: Format
  venue: Venue
  homeTeam: Team
  awayTeam: Team
  playingXIHome: Player[]
  playingXIAway: Player[]
  battingOrderHome: string[]
  battingOrderAway: string[]
  bowlingOrderHome: string[]
  bowlingOrderAway: string[]
  overs: number
}

export interface BallEvent {
  id: string
  match_id: string
  innings: number
  over: number
  ball: number
  batter_id: string
  non_striker_id: string
  bowler_id: string
  outcome: '0' | '1' | '2' | '3' | '4' | '6' | 'W'
  dismissal?: {
    type:
      | 'BOWLED'
      | 'CAUGHT'
      | 'CAUGHT_BOWLED'
      | 'RUN_OUT'
      | 'STUMPED'
      | 'HIT_WICKET'
    fielder_id?: string
  }
  commentary: string
  timestamp: string
}

export interface InningsState {
  battingTeamId: string
  bowlingTeamId: string
  wickets: number
  runs: number
  balls: number
  strikerId: string
  nonStrikerId: string
  bowlerId: string
  over: number
  ballInOver: number
  recentBalls: string[]
}

export interface MatchState {
  id: string
  format: Format
  venue: Venue
  innings: InningsState[]
  target?: number
  status: 'PENDING' | 'LIVE' | 'COMPLETE'
}

export interface PlayerStats {
  player_id: string
  format: Format
  matches: number
  innings: number
  runs: number
  balls: number
  fours: number
  sixes: number
  fifties: number
  hundreds: number
  not_outs: number
  highest_score: number
  wickets: number
  overs: number
  runs_conceded: number
  four_fers: number
  five_fers: number
  best_figures?: string | null
  catches?: number | null
  stumpings?: number | null
}

export interface CompetitionStatRow {
  id: string
  name: string
  matches: number
  runs: number
  wickets: number
  average: number
  strikeRate: number
}

export interface RecentInningsRow {
  id: string
  opponent: string
  venue: string
  runs: number
  balls: number
  strikeRate: number
  wickets?: number
  overs?: number
  economy?: number
}
