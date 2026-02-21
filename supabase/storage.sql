-- Storage buckets
select storage.create_bucket('player-images', public => true);
select storage.create_bucket('team-logos', public => true);
select storage.create_bucket('tournament-logos', public => true);
select storage.create_bucket('league-logos', public => true);

-- Public read access
drop policy if exists "public read player images" on storage.objects;
drop policy if exists "public read team logos" on storage.objects;
drop policy if exists "public read tournament logos" on storage.objects;
drop policy if exists "public read league logos" on storage.objects;

create policy "public read player images" on storage.objects
for select using (bucket_id = 'player-images');

create policy "public read team logos" on storage.objects
for select using (bucket_id = 'team-logos');

create policy "public read tournament logos" on storage.objects
for select using (bucket_id = 'tournament-logos');

create policy "public read league logos" on storage.objects
for select using (bucket_id = 'league-logos');

-- Admin write access with size + mime checks
drop policy if exists "admin write player images" on storage.objects;
drop policy if exists "admin write team logos" on storage.objects;
drop policy if exists "admin write tournament logos" on storage.objects;
drop policy if exists "admin write league logos" on storage.objects;

create policy "admin write player images" on storage.objects
for all
using (bucket_id = 'player-images' and is_admin())
with check (
  bucket_id = 'player-images'
  and is_admin()
  and coalesce((metadata->>'size')::int, 0) <= 5242880
  and coalesce(metadata->>'mimetype','') in ('image/jpeg','image/png','image/webp')
);

create policy "admin write team logos" on storage.objects
for all
using (bucket_id = 'team-logos' and is_admin())
with check (
  bucket_id = 'team-logos'
  and is_admin()
  and coalesce((metadata->>'size')::int, 0) <= 5242880
  and coalesce(metadata->>'mimetype','') in ('image/jpeg','image/png','image/webp')
);

create policy "admin write tournament logos" on storage.objects
for all
using (bucket_id = 'tournament-logos' and is_admin())
with check (
  bucket_id = 'tournament-logos'
  and is_admin()
  and coalesce((metadata->>'size')::int, 0) <= 5242880
  and coalesce(metadata->>'mimetype','') in ('image/jpeg','image/png','image/webp')
);

create policy "admin write league logos" on storage.objects
for all
using (bucket_id = 'league-logos' and is_admin())
with check (
  bucket_id = 'league-logos'
  and is_admin()
  and coalesce((metadata->>'size')::int, 0) <= 5242880
  and coalesce(metadata->>'mimetype','') in ('image/jpeg','image/png','image/webp')
);
