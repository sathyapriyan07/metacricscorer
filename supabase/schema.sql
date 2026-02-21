-- Core enums
create type format_type as enum ('T20', 'ODI', 'TEST');
create type user_role as enum ('USER', 'ADMIN');
create type player_role as enum ('BAT', 'BOWL', 'AR', 'WK');
create type pitch_type as enum ('FLAT', 'GREEN', 'DUSTY', 'SLOW', 'BOUNCY');
create type dismissal_type as enum (
  'BOWLED',
  'CAUGHT',
  'CAUGHT_BOWLED',
  'RUN_OUT',
  'STUMPED',
  'HIT_WICKET'
);

-- Helper to check admin
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    auth.jwt() -> 'app_metadata' ->> 'role',
    auth.jwt() -> 'user_metadata' ->> 'role',
    'USER'
  ) = 'ADMIN';
$$;

-- Teams
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  country text not null,
  badge_url text,
  logo_url text,
  logo_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Players
create table players (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  short_name text not null,
  role player_role not null,
  batting_style text,
  bowling_style text,
  country text,
  skill_batting int not null default 50,
  skill_bowling int not null default 50,
  skill_fielding int not null default 50,
  image_url text,
  image_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Team roster
create table team_players (
  team_id uuid references teams(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  joined_at date default now(),
  primary key (team_id, player_id)
);

-- Venues
create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  country text not null,
  pitch_type pitch_type not null default 'FLAT',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tournaments / Leagues
create table tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  format format_type not null,
  is_league boolean not null default false,
  start_date date,
  end_date date,
  logo_url text,
  logo_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  format format_type not null,
  start_date date,
  end_date date,
  logo_url text,
  logo_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table tournament_teams (
  tournament_id uuid references tournaments(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  primary key (tournament_id, team_id)
);

-- Series
create table series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  format format_type not null,
  start_date date,
  end_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Fixtures
create table fixtures (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id) on delete cascade,
  series_id uuid references series(id) on delete cascade,
  home_team_id uuid references teams(id) on delete restrict,
  away_team_id uuid references teams(id) on delete restrict,
  venue_id uuid references venues(id) on delete restrict,
  scheduled_at timestamptz not null,
  status text not null default 'SCHEDULED'
);

-- Matches
create table matches (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid references fixtures(id) on delete set null,
  format format_type not null,
  venue_id uuid references venues(id) on delete restrict,
  home_team_id uuid references teams(id) on delete restrict,
  away_team_id uuid references teams(id) on delete restrict,
  toss_winner_id uuid references teams(id) on delete restrict,
  winner_id uuid references teams(id) on delete set null,
  result_type text,
  status text not null default 'PENDING',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table match_innings (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  innings_no int not null,
  batting_team_id uuid references teams(id) on delete restrict,
  bowling_team_id uuid references teams(id) on delete restrict,
  runs int not null default 0,
  wickets int not null default 0,
  balls int not null default 0,
  extras int not null default 0
);

create table match_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  innings_no int not null,
  over int not null,
  ball int not null,
  batter_id uuid references players(id) on delete restrict,
  non_striker_id uuid references players(id) on delete restrict,
  bowler_id uuid references players(id) on delete restrict,
  outcome text not null,
  dismissal_type dismissal_type,
  fielder_id uuid references players(id) on delete set null,
  commentary text,
  created_at timestamptz default now()
);

-- Stats tables
create table player_stats (
  player_id uuid references players(id) on delete cascade,
  format format_type not null,
  matches int not null default 0,
  innings int not null default 0,
  runs int not null default 0,
  balls int not null default 0,
  fours int not null default 0,
  sixes int not null default 0,
  fifties int not null default 0,
  hundreds int not null default 0,
  not_outs int not null default 0,
  highest_score int not null default 0,
  wickets int not null default 0,
  overs numeric(6,1) not null default 0,
  runs_conceded int not null default 0,
  economy numeric(5,2) not null default 0,
  four_fors int not null default 0,
  five_fors int not null default 0,
  best_bowling text,
  catches int not null default 0,
  stumpings int not null default 0,
  primary key (player_id, format)
);

create table team_stats (
  team_id uuid references teams(id) on delete cascade,
  format format_type not null,
  matches int not null default 0,
  wins int not null default 0,
  losses int not null default 0,
  nrr numeric(6,3) not null default 0,
  primary key (team_id, format)
);

create table venue_stats (
  venue_id uuid references venues(id) on delete cascade,
  format format_type not null,
  matches int not null default 0,
  wins_batting_first int not null default 0,
  wins_chasing int not null default 0,
  highest_score int not null default 0,
  lowest_score int not null default 0,
  primary key (venue_id, format)
);

create table rankings (
  id uuid primary key default gen_random_uuid(),
  format format_type not null,
  category text not null,
  player_id uuid references players(id) on delete cascade,
  score numeric(8,2) not null default 0,
  rank int not null default 0
);

-- Indexes
create index idx_team_players_player on team_players(player_id);
create index idx_team_players_team on team_players(team_id);
create index idx_match_events_player on match_events(batter_id);
create index idx_match_events_bowler on match_events(bowler_id);
create index idx_match_events_match on match_events(match_id);

-- RLS
alter table teams enable row level security;
alter table players enable row level security;
alter table team_players enable row level security;
alter table venues enable row level security;
alter table tournaments enable row level security;
alter table leagues enable row level security;
alter table tournament_teams enable row level security;
alter table series enable row level security;
alter table fixtures enable row level security;
alter table matches enable row level security;
alter table match_innings enable row level security;
alter table match_events enable row level security;
alter table player_stats enable row level security;
alter table team_stats enable row level security;
alter table venue_stats enable row level security;
alter table rankings enable row level security;

-- Public read policies
create policy "public read teams" on teams for select using (true);
create policy "public read players" on players for select using (true);
create policy "public read team_players" on team_players for select using (true);
create policy "public read venues" on venues for select using (true);
create policy "public read tournaments" on tournaments for select using (true);
create policy "public read leagues" on leagues for select using (true);
create policy "public read tournament_teams" on tournament_teams for select using (true);
create policy "public read series" on series for select using (true);
create policy "public read fixtures" on fixtures for select using (true);
create policy "public read matches" on matches for select using (true);
create policy "public read match_innings" on match_innings for select using (true);
create policy "public read match_events" on match_events for select using (true);
create policy "public read player_stats" on player_stats for select using (true);
create policy "public read team_stats" on team_stats for select using (true);
create policy "public read venue_stats" on venue_stats for select using (true);
create policy "public read rankings" on rankings for select using (true);

-- Admin write policies
create policy "admin insert teams" on teams for insert with check (is_admin());
create policy "admin update teams" on teams for update using (is_admin());
create policy "admin delete teams" on teams for delete using (is_admin());

create policy "admin insert players" on players for insert with check (is_admin());
create policy "admin update players" on players for update using (is_admin());
create policy "admin delete players" on players for delete using (is_admin());

create policy "admin insert team_players" on team_players for insert with check (is_admin());
create policy "admin update team_players" on team_players for update using (is_admin());
create policy "admin delete team_players" on team_players for delete using (is_admin());

create policy "admin insert venues" on venues for insert with check (is_admin());
create policy "admin update venues" on venues for update using (is_admin());
create policy "admin delete venues" on venues for delete using (is_admin());

create policy "admin insert tournaments" on tournaments for insert with check (is_admin());
create policy "admin update tournaments" on tournaments for update using (is_admin());
create policy "admin delete tournaments" on tournaments for delete using (is_admin());

create policy "admin insert leagues" on leagues for insert with check (is_admin());
create policy "admin update leagues" on leagues for update using (is_admin());
create policy "admin delete leagues" on leagues for delete using (is_admin());

create policy "admin insert tournament_teams" on tournament_teams for insert with check (is_admin());
create policy "admin update tournament_teams" on tournament_teams for update using (is_admin());
create policy "admin delete tournament_teams" on tournament_teams for delete using (is_admin());

create policy "admin insert series" on series for insert with check (is_admin());
create policy "admin update series" on series for update using (is_admin());
create policy "admin delete series" on series for delete using (is_admin());

create policy "admin insert fixtures" on fixtures for insert with check (is_admin());
create policy "admin update fixtures" on fixtures for update using (is_admin());
create policy "admin delete fixtures" on fixtures for delete using (is_admin());

create policy "admin insert matches" on matches for insert with check (is_admin());
create policy "admin update matches" on matches for update using (is_admin());
create policy "admin delete matches" on matches for delete using (is_admin());

create policy "admin insert match_innings" on match_innings for insert with check (is_admin());
create policy "admin update match_innings" on match_innings for update using (is_admin());
create policy "admin delete match_innings" on match_innings for delete using (is_admin());

create policy "admin insert match_events" on match_events for insert with check (is_admin());
create policy "admin update match_events" on match_events for update using (is_admin());
create policy "admin delete match_events" on match_events for delete using (is_admin());

create policy "admin insert player_stats" on player_stats for insert with check (is_admin());
create policy "admin update player_stats" on player_stats for update using (is_admin());
create policy "admin delete player_stats" on player_stats for delete using (is_admin());

create policy "admin insert team_stats" on team_stats for insert with check (is_admin());
create policy "admin update team_stats" on team_stats for update using (is_admin());
create policy "admin delete team_stats" on team_stats for delete using (is_admin());

create policy "admin insert venue_stats" on venue_stats for insert with check (is_admin());
create policy "admin update venue_stats" on venue_stats for update using (is_admin());
create policy "admin delete venue_stats" on venue_stats for delete using (is_admin());

create policy "admin insert rankings" on rankings for insert with check (is_admin());
create policy "admin update rankings" on rankings for update using (is_admin());
create policy "admin delete rankings" on rankings for delete using (is_admin());

-- Stats update RPC
create or replace function rpc_update_stats(match_uuid uuid)
returns void
language plpgsql
as $$
declare
  fmt format_type;
begin
  select format into fmt from matches where id = match_uuid;

  -- Update player batting stats
  insert into player_stats (player_id, format, matches, innings, runs, balls, fours, sixes, not_outs, highest_score)
  select
    batter_id,
    fmt,
    1,
    1,
    sum(case when outcome = 'W' then 0 else outcome::int end) as runs,
    count(*) as balls,
    sum(case when outcome = '4' then 1 else 0 end) as fours,
    sum(case when outcome = '6' then 1 else 0 end) as sixes,
    sum(case when outcome = 'W' then 0 else 1 end) as not_outs,
    sum(case when outcome = 'W' then 0 else outcome::int end) as highest_score
  from match_events
  where match_id = match_uuid
  group by batter_id
  on conflict (player_id, format)
  do update set
    matches = player_stats.matches + 1,
    innings = player_stats.innings + 1,
    runs = player_stats.runs + excluded.runs,
    balls = player_stats.balls + excluded.balls,
    fours = player_stats.fours + excluded.fours,
    sixes = player_stats.sixes + excluded.sixes,
    not_outs = player_stats.not_outs + excluded.not_outs,
    highest_score = greatest(player_stats.highest_score, excluded.highest_score);

  -- Update bowler stats
  insert into player_stats (player_id, format, matches, innings, wickets, economy)
  select
    bowler_id,
    fmt,
    1,
    1,
    sum(case when outcome = 'W' then 1 else 0 end) as wickets,
    round((sum(case when outcome = 'W' then 0 else outcome::int end)::numeric / count(*) * 6)::numeric, 2) as economy
  from match_events
  where match_id = match_uuid
  group by bowler_id
  on conflict (player_id, format)
  do update set
    matches = player_stats.matches + 1,
    innings = player_stats.innings + 1,
    wickets = player_stats.wickets + excluded.wickets,
    economy = excluded.economy;
end;
$$;

-- Ranking refresh
create or replace function rpc_refresh_rankings(fmt format_type)
returns void
language plpgsql
as $$
begin
  delete from rankings where format = fmt;
  insert into rankings (format, category, player_id, score, rank)
  select
    fmt,
    'Batsman',
    ps.player_id,
    (ps.runs * 0.4 + ps.balls * 0.05) as score,
    row_number() over (order by ps.runs desc)
  from player_stats ps
  where ps.format = fmt
  order by score desc
  limit 10;
end;
$$;
