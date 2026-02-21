insert into teams (id, name, short_name, country)
values
  ('11111111-1111-1111-1111-111111111111', 'India', 'IND', 'India'),
  ('22222222-2222-2222-2222-222222222222', 'Australia', 'AUS', 'Australia');

insert into players (id, full_name, short_name, role, batting_style, bowling_style, country, skill_batting, skill_bowling, skill_fielding)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Virat Kohli', 'Kohli', 'BAT', 'RHB', 'RA', 'India', 92, 48, 84),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jasprit Bumrah', 'Bumrah', 'BOWL', 'RHB', 'RF', 'India', 35, 95, 80),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Steve Smith', 'Smith', 'BAT', 'RHB', 'RA', 'Australia', 88, 55, 82),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Pat Cummins', 'Cummins', 'BOWL', 'RHB', 'RF', 'Australia', 45, 93, 86);

insert into team_players (team_id, player_id)
values
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd');

insert into venues (id, name, city, country, pitch_type)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Wankhede Stadium', 'Mumbai', 'India', 'FLAT'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'MCG', 'Melbourne', 'Australia', 'BOUNCY');
