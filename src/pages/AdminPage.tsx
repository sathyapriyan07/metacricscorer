import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import GlassCard from '../components/layout/GlassCard'
import Tabs from '../components/layout/Tabs'
import {
  createFixture,
  createLeague,
  createPlayer,
  createSeries,
  createTeam,
  createTournament,
  createVenue,
  deleteFixture,
  deleteLeague,
  deletePlayer,
  deleteSeries,
  deleteTeam,
  deleteTournament,
  deleteVenue,
  fetchFixtures,
  fetchLeagues,
  fetchPlayers,
  fetchSeries,
  fetchTeams,
  fetchTournaments,
  fetchVenues,
  updateLeague,
  updatePlayer,
  updateSeries,
  updateTeam,
  updateTournament,
  updateVenue,
} from '../services/api'
import { supabase } from '../services/supabase'
import LogoUploader from '../components/ui/LogoUploader'
import { deleteImage, listImages, uploadImage } from '../services/storageService'
import type { StorageFile } from '../services/storageService'
import { getImageUrl } from '../utils/imageHelper'
import type { Fixture, Format, League, Player, Series, Team, Tournament, Venue } from '../types'
import AdminTable from '../components/ui/AdminTable'

const adminTabs = ['Players', 'Teams', 'Venues', 'Tournaments', 'Leagues', 'Series', 'Fixtures', 'Images']

const AdminPage = () => {
  const [active, setActive] = useState(adminTabs[0])
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [series, setSeries] = useState<Series[]>([])
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [error, setError] = useState<string>()
  const [authError, setAuthError] = useState<string>()
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  const [sessionRole, setSessionRole] = useState<string | null>(null)

  const formats: Format[] = ['T20', 'ODI', 'TEST']

  const refreshAll = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const [
        playersData,
        teamsData,
        venuesData,
        tournamentsData,
        leaguesData,
        seriesData,
        fixturesData,
      ] = await Promise.all([
        fetchPlayers(),
        fetchTeams(),
        fetchVenues(),
        fetchTournaments(),
        fetchLeagues(),
        fetchSeries(),
        fetchFixtures(),
      ])
      setPlayers(playersData)
      setTeams(teamsData)
      setVenues(venuesData)
      setTournaments(tournamentsData)
      setLeagues(leaguesData)
      setSeries(seriesData)
      setFixtures(fixturesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAll()
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null)
      const role =
        data.session?.user.app_metadata?.role ??
        data.session?.user.user_metadata?.role ??
        null
      setSessionRole(role)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null)
      const role = session?.user.app_metadata?.role ?? session?.user.user_metadata?.role ?? null
      setSessionRole(role)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    setAuthError(undefined)
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    })
    if (error) setAuthError(error.message)
  }

  const signUp = async () => {
    setAuthError(undefined)
    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    })
    if (error) setAuthError(error.message)
  }

  const signOut = async () => {
    setAuthError(undefined)
    const { error } = await supabase.auth.signOut()
    if (error) setAuthError(error.message)
  }

  const teamOptions = useMemo(
    () => teams.map((team) => ({ value: team.id, label: team.name })),
    [teams],
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Admin CMS" subtitle="Create, edit, and manage cricket ecosystem." />
      <GlassCard>
        <p className="text-xs uppercase tracking-widest text-slate-400">Admin Auth</p>
        <div className="mt-3 flex flex-wrap items-end gap-3 text-sm">
          <input
            className="rounded-xl bg-field p-2"
            placeholder="Email"
            value={authEmail}
            onChange={(event) => setAuthEmail(event.target.value)}
          />
          <input
            className="rounded-xl bg-field p-2"
            placeholder="Password"
            type="password"
            value={authPassword}
            onChange={(event) => setAuthPassword(event.target.value)}
          />
          <button
            type="button"
            className="rounded-xl bg-brand-500 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={signIn}
          >
            Sign In
          </button>
          <button
            type="button"
            className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-200"
            onClick={signUp}
          >
            Sign Up
          </button>
          <button
            type="button"
            className="rounded-xl bg-red-500/70 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={signOut}
          >
            Sign Out
          </button>
          <div className="text-xs text-slate-400">Session: {sessionEmail ?? 'none'}</div>
          <div className="text-xs text-slate-400">Role: {sessionRole ?? 'none'}</div>
        </div>
        {authError ? <p className="mt-2 text-xs text-red-400">{authError}</p> : null}
      </GlassCard>
      <Tabs tabs={adminTabs} active={active} onChange={setActive} />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-400">Loading...</p> : null}

      {active === 'Players' ? (
        <PlayersAdmin
          players={players}
          teams={teams}
          onCreate={async (payload) => {
            await createPlayer(payload)
            await refreshAll()
          }}
          onUpdate={async (id, payload) => {
            await updatePlayer(id, payload)
            await refreshAll()
          }}
          onDelete={async (id) => {
            await deletePlayer(id)
            await refreshAll()
          }}
        />
      ) : null}

      {active === 'Teams' ? (
        <TeamsAdmin
          teams={teams}
          onCreate={async (payload) => {
            await createTeam(payload)
            await refreshAll()
          }}
          onUpdate={async (id, payload) => {
            await updateTeam(id, payload)
            await refreshAll()
          }}
          onDelete={async (id) => {
            await deleteTeam(id)
            await refreshAll()
          }}
        />
      ) : null}

      {active === 'Venues' ? (
        <VenuesAdmin
          venues={venues}
          onCreate={async (payload) => {
            await createVenue(payload)
            await refreshAll()
          }}
          onUpdate={async (id, payload) => {
            await updateVenue(id, payload)
            await refreshAll()
          }}
          onDelete={async (id) => {
            await deleteVenue(id)
            await refreshAll()
          }}
        />
      ) : null}

      {active === 'Tournaments' ? (
        <TournamentsAdmin
          tournaments={tournaments}
          formats={formats}
          onCreate={async (payload) => {
            await createTournament(payload)
            await refreshAll()
          }}
          onUpdate={async (id, payload) => {
            await updateTournament(id, payload)
            await refreshAll()
          }}
          onDelete={async (id) => {
            await deleteTournament(id)
            await refreshAll()
          }}
        />
      ) : null}

      {active === 'Leagues' ? (
        <LeaguesAdmin
          leagues={leagues}
          formats={formats}
          onCreate={async (payload) => {
            await createLeague(payload)
            await refreshAll()
          }}
          onUpdate={async (id, payload) => {
            await updateLeague(id, payload)
            await refreshAll()
          }}
          onDelete={async (id) => {
            await deleteLeague(id)
            await refreshAll()
          }}
        />
      ) : null}

      {active === 'Series' ? (
        <SeriesAdmin
          series={series}
          formats={formats}
          onCreate={async (payload) => {
            await createSeries(payload)
            await refreshAll()
          }}
          onUpdate={async (id, payload) => {
            await updateSeries(id, payload)
            await refreshAll()
          }}
          onDelete={async (id) => {
            await deleteSeries(id)
            await refreshAll()
          }}
        />
      ) : null}

      {active === 'Fixtures' ? (
        <FixturesAdmin
          fixtures={fixtures}
          teamOptions={teamOptions}
          venues={venues}
          tournaments={tournaments}
          series={series}
          onCreate={async (payload) => {
            await createFixture(payload)
            await refreshAll()
          }}
          onDelete={async (id) => {
            await deleteFixture(id)
            await refreshAll()
          }}
        />
      ) : null}

      {active === 'Images' ? <ImagesAdmin /> : null}
    </div>
  )
}

const PlayersAdmin = ({
  players,
  teams,
  onCreate,
  onUpdate,
  onDelete,
}: {
  players: Player[]
  teams: Team[]
  onCreate: (payload: Partial<Player>) => Promise<void>
  onUpdate: (id: string, payload: Partial<Player>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) => {
  const [form, setForm] = useState<Partial<Player>>({
    role: 'BAT',
    skill_batting: 60,
    skill_bowling: 40,
    skill_fielding: 60,
  })
  const [edit, setEdit] = useState<Record<string, Partial<Player>>>({})
  const [localError, setLocalError] = useState<string>()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [editingImageId, setEditingImageId] = useState<string | null>(null)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImageUrl, setEditImageUrl] = useState('')

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GlassCard className="lg:col-span-1">
        <p className="text-xs uppercase tracking-widest text-slate-400">Create Player</p>
        <div className="mt-4 space-y-3 text-sm">
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Full name"
            value={form.full_name ?? ''}
            onChange={(event) => setForm({ ...form, full_name: event.target.value })}
          />
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Short name"
            value={form.short_name ?? ''}
            onChange={(event) => setForm({ ...form, short_name: event.target.value })}
          />
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.role ?? 'BAT'}
            onChange={(event) => setForm({ ...form, role: event.target.value as Player['role'] })}
          >
            <option value="BAT">BAT</option>
            <option value="BOWL">BOWL</option>
            <option value="AR">AR</option>
            <option value="WK">WK</option>
          </select>
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.team_id ?? ''}
            onChange={(event) => setForm({ ...form, team_id: event.target.value })}
          >
            <option value="">Unassigned</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Country"
            value={form.country ?? ''}
            onChange={(event) => setForm({ ...form, country: event.target.value })}
          />
          <LogoUploader
            label="Player Image"
            file={imageFile}
            imageUrl={imageUrl}
            onFileChange={setImageFile}
            onUrlChange={setImageUrl}
            onRemove={() => {
              setImageFile(null)
              setImageUrl('')
            }}
          />
          <button
            type="button"
            className="w-full rounded-xl bg-accent-500 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={async () => {
              setLocalError(undefined)
              if (!form.full_name || !form.short_name || !form.role) {
                setLocalError('Full name, short name, and role are required.')
                return
              }
              const payload = { ...form }
              if (imageFile) {
                const upload = await uploadImage({
                  bucket: 'player-images',
                  file: imageFile,
                  prefix: 'players',
                })
                payload.image_path = upload.path
                payload.image_url = null
              } else if (imageUrl) {
                payload.image_url = imageUrl
                payload.image_path = null
              }
              await onCreate(payload)
              setImageFile(null)
              setImageUrl('')
            }}
          >
            Create
          </button>
          {localError ? <p className="text-xs text-red-400">{localError}</p> : null}
        </div>
      </GlassCard>
      <GlassCard className="lg:col-span-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Players</p>
        {editingImageId ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Replace Image</p>
            <div className="mt-3">
              <LogoUploader
                label="New Player Image"
                file={editImageFile}
                imageUrl={editImageUrl}
                onFileChange={setEditImageFile}
                onUrlChange={setEditImageUrl}
                onRemove={() => {
                  setEditImageFile(null)
                  setEditImageUrl('')
                }}
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-brand-500 px-3 py-1 text-xs"
                  onClick={async () => {
                    const player = players.find((p) => p.id === editingImageId)
                    if (!player) return
                    const payload: Partial<Player> = {}
                    if (editImageFile) {
                      const upload = await uploadImage({
                        bucket: 'player-images',
                        file: editImageFile,
                        prefix: 'players',
                      })
                      payload.image_path = upload.path
                      payload.image_url = null
                      if (player.image_path) {
                        await deleteImage({ bucket: 'player-images', path: player.image_path })
                      }
                    } else if (editImageUrl) {
                      payload.image_url = editImageUrl
                      payload.image_path = null
                      if (player.image_path) {
                        await deleteImage({ bucket: 'player-images', path: player.image_path })
                      }
                    }
                    await onUpdate(player.id, payload)
                    setEditingImageId(null)
                    setEditImageFile(null)
                    setEditImageUrl('')
                  }}
                >
                  Save Image
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                  onClick={() => {
                    setEditingImageId(null)
                    setEditImageFile(null)
                    setEditImageUrl('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-4">
          <AdminTable
            title="Players"
            rows={players}
            searchKeys={['full_name', 'short_name', 'country']}
            columns={[
              {
                key: 'player',
                label: 'Player',
                sortValue: (row) => row.full_name,
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl({ entity: row, bucket: 'player-images' })}
                      alt={row.full_name}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                    <input
                      className="rounded-lg bg-field px-2 py-1 text-sm"
                      value={edit[row.id]?.full_name ?? row.full_name}
                      onChange={(event) =>
                        setEdit((prev) => ({
                          ...prev,
                          [row.id]: { ...prev[row.id], full_name: event.target.value },
                        }))
                      }
                    />
                  </div>
                ),
              },
              {
                key: 'role',
                label: 'Role',
                render: (row) => (
                  <select
                    className="rounded-lg bg-field px-2 py-1 text-xs"
                    value={edit[row.id]?.role ?? row.role}
                    onChange={(event) =>
                      setEdit((prev) => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], role: event.target.value as Player['role'] },
                      }))
                    }
                  >
                    <option value="BAT">BAT</option>
                    <option value="BOWL">BOWL</option>
                    <option value="AR">AR</option>
                    <option value="WK">WK</option>
                  </select>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={() => onUpdate(row.id, edit[row.id] ?? {})}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-brand-500/60 px-3 py-1 text-xs"
                      onClick={() => setEditingImageId(row.id)}
                    >
                      Replace Image
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={async () => {
                        if (row.image_path) {
                          await deleteImage({ bucket: 'player-images', path: row.image_path })
                        }
                        await onUpdate(row.id, { image_path: null, image_url: null })
                      }}
                    >
                      Remove Image
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-red-500/70 px-3 py-1 text-xs"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </GlassCard>
    </div>
  )
}

const TeamsAdmin = ({
  teams,
  onCreate,
  onUpdate,
  onDelete,
}: {
  teams: Team[]
  onCreate: (payload: Partial<Team>) => Promise<void>
  onUpdate: (id: string, payload: Partial<Team>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) => {
  const [form, setForm] = useState<Partial<Team>>({})
  const [edit, setEdit] = useState<Record<string, Partial<Team>>>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null)
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null)
  const [editLogoUrl, setEditLogoUrl] = useState('')
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GlassCard>
        <p className="text-xs uppercase tracking-widest text-slate-400">Create Team</p>
        <div className="mt-4 space-y-3 text-sm">
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Name"
            value={form.name ?? ''}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Short name"
            value={form.short_name ?? ''}
            onChange={(event) => setForm({ ...form, short_name: event.target.value })}
          />
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Country"
            value={form.country ?? ''}
            onChange={(event) => setForm({ ...form, country: event.target.value })}
          />
          <LogoUploader
            label="Team Logo"
            file={logoFile}
            imageUrl={logoUrl}
            onFileChange={setLogoFile}
            onUrlChange={setLogoUrl}
            onRemove={() => {
              setLogoFile(null)
              setLogoUrl('')
            }}
          />
          <button
            type="button"
            className="w-full rounded-xl bg-accent-500 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={async () => {
              const payload = { ...form }
              if (logoFile) {
                const upload = await uploadImage({
                  bucket: 'team-logos',
                  file: logoFile,
                  prefix: 'teams',
                })
                payload.logo_path = upload.path
                payload.logo_url = null
              } else if (logoUrl) {
                payload.logo_url = logoUrl
                payload.logo_path = null
              }
              await onCreate(payload)
              setLogoFile(null)
              setLogoUrl('')
            }}
          >
            Create
          </button>
        </div>
      </GlassCard>
      <GlassCard className="lg:col-span-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Teams</p>
        {editingLogoId ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Replace Logo</p>
            <div className="mt-3">
              <LogoUploader
                label="New Team Logo"
                file={editLogoFile}
                imageUrl={editLogoUrl}
                onFileChange={setEditLogoFile}
                onUrlChange={setEditLogoUrl}
                onRemove={() => {
                  setEditLogoFile(null)
                  setEditLogoUrl('')
                }}
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-brand-500 px-3 py-1 text-xs"
                  onClick={async () => {
                    const team = teams.find((t) => t.id === editingLogoId)
                    if (!team) return
                    const payload: Partial<Team> = {}
                    if (editLogoFile) {
                      const upload = await uploadImage({
                        bucket: 'team-logos',
                        file: editLogoFile,
                        prefix: 'teams',
                      })
                      payload.logo_path = upload.path
                      payload.logo_url = null
                      if (team.logo_path) {
                        await deleteImage({ bucket: 'team-logos', path: team.logo_path })
                      }
                    } else if (editLogoUrl) {
                      payload.logo_url = editLogoUrl
                      payload.logo_path = null
                      if (team.logo_path) {
                        await deleteImage({ bucket: 'team-logos', path: team.logo_path })
                      }
                    }
                    await onUpdate(team.id, payload)
                    setEditingLogoId(null)
                    setEditLogoFile(null)
                    setEditLogoUrl('')
                  }}
                >
                  Save Logo
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                  onClick={() => {
                    setEditingLogoId(null)
                    setEditLogoFile(null)
                    setEditLogoUrl('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-4">
          <AdminTable
            title="Teams"
            rows={teams}
            searchKeys={['name', 'short_name', 'country']}
            columns={[
              {
                key: 'team',
                label: 'Team',
                sortValue: (row) => row.name,
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl({ entity: row, bucket: 'team-logos' })}
                      alt={row.name}
                      className="h-10 w-10 rounded-xl object-cover"
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                    <input
                      className="rounded-lg bg-field px-2 py-1 text-sm"
                      value={edit[row.id]?.name ?? row.name}
                      onChange={(event) =>
                        setEdit((prev) => ({ ...prev, [row.id]: { ...prev[row.id], name: event.target.value } }))
                      }
                    />
                  </div>
                ),
              },
              {
                key: 'short',
                label: 'Short',
                render: (row) => (
                  <input
                    className="rounded-lg bg-field px-2 py-1 text-xs"
                    value={edit[row.id]?.short_name ?? row.short_name}
                    onChange={(event) =>
                      setEdit((prev) => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], short_name: event.target.value },
                      }))
                    }
                  />
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={() => onUpdate(row.id, edit[row.id] ?? {})}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-brand-500/60 px-3 py-1 text-xs"
                      onClick={() => setEditingLogoId(row.id)}
                    >
                      Replace Logo
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={async () => {
                        if (row.logo_path) {
                          await deleteImage({ bucket: 'team-logos', path: row.logo_path })
                        }
                        await onUpdate(row.id, { logo_path: null, logo_url: null })
                      }}
                    >
                      Remove Logo
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-red-500/70 px-3 py-1 text-xs"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </GlassCard>
    </div>
  )
}

const VenuesAdmin = ({
  venues,
  onCreate,
  onUpdate,
  onDelete,
}: {
  venues: Venue[]
  onCreate: (payload: Partial<Venue>) => Promise<void>
  onUpdate: (id: string, payload: Partial<Venue>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) => {
  const [form, setForm] = useState<Partial<Venue>>({ pitch_type: 'FLAT' })
  const [edit, setEdit] = useState<Record<string, Partial<Venue>>>({})
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GlassCard>
        <p className="text-xs uppercase tracking-widest text-slate-400">Create Venue</p>
        <div className="mt-4 space-y-3 text-sm">
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Name"
            value={form.name ?? ''}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="City"
            value={form.city ?? ''}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
          />
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Country"
            value={form.country ?? ''}
            onChange={(event) => setForm({ ...form, country: event.target.value })}
          />
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.pitch_type ?? 'FLAT'}
            onChange={(event) => setForm({ ...form, pitch_type: event.target.value as Venue['pitch_type'] })}
          >
            <option value="FLAT">FLAT</option>
            <option value="GREEN">GREEN</option>
            <option value="DUSTY">DUSTY</option>
            <option value="SLOW">SLOW</option>
            <option value="BOUNCY">BOUNCY</option>
          </select>
          <button
            type="button"
            className="w-full rounded-xl bg-accent-500 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={() => onCreate(form)}
          >
            Create
          </button>
        </div>
      </GlassCard>
      <GlassCard className="lg:col-span-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Venues</p>
        <div className="mt-4">
          <AdminTable
            title="Venues"
            rows={venues}
            searchKeys={['name', 'city', 'country']}
            columns={[
              {
                key: 'name',
                label: 'Venue',
                sortValue: (row) => row.name,
                render: (row) => (
                  <input
                    className="rounded-lg bg-field px-2 py-1 text-sm"
                    value={edit[row.id]?.name ?? row.name}
                    onChange={(event) =>
                      setEdit((prev) => ({ ...prev, [row.id]: { ...prev[row.id], name: event.target.value } }))
                    }
                  />
                ),
              },
              {
                key: 'pitch',
                label: 'Pitch',
                render: (row) => (
                  <select
                    className="rounded-lg bg-field px-2 py-1 text-xs"
                    value={edit[row.id]?.pitch_type ?? row.pitch_type}
                    onChange={(event) =>
                      setEdit((prev) => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], pitch_type: event.target.value as Venue['pitch_type'] },
                      }))
                    }
                  >
                    <option value="FLAT">FLAT</option>
                    <option value="GREEN">GREEN</option>
                    <option value="DUSTY">DUSTY</option>
                    <option value="SLOW">SLOW</option>
                    <option value="BOUNCY">BOUNCY</option>
                  </select>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={() => onUpdate(row.id, edit[row.id] ?? {})}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-red-500/70 px-3 py-1 text-xs"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </GlassCard>
    </div>
  )
}

const TournamentsAdmin = ({
  tournaments,
  formats,
  onCreate,
  onUpdate,
  onDelete,
}: {
  tournaments: Tournament[]
  formats: Format[]
  onCreate: (payload: Partial<Tournament>) => Promise<void>
  onUpdate: (id: string, payload: Partial<Tournament>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) => {
  const [form, setForm] = useState<Partial<Tournament>>({ format: 'T20', is_league: false })
  const [edit, setEdit] = useState<Record<string, Partial<Tournament>>>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null)
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null)
  const [editLogoUrl, setEditLogoUrl] = useState('')
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GlassCard>
        <p className="text-xs uppercase tracking-widest text-slate-400">Create Tournament/League</p>
        <div className="mt-4 space-y-3 text-sm">
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Name"
            value={form.name ?? ''}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.format ?? 'T20'}
            onChange={(event) => setForm({ ...form, format: event.target.value as Format })}
          >
            {formats.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={form.is_league ?? false}
              onChange={(event) => setForm({ ...form, is_league: event.target.checked })}
            />
            Is League
          </label>
          <LogoUploader
            label="Tournament Logo"
            file={logoFile}
            imageUrl={logoUrl}
            onFileChange={setLogoFile}
            onUrlChange={setLogoUrl}
            onRemove={() => {
              setLogoFile(null)
              setLogoUrl('')
            }}
          />
          <button
            type="button"
            className="w-full rounded-xl bg-accent-500 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={async () => {
              const payload = { ...form }
              if (logoFile) {
                const upload = await uploadImage({
                  bucket: 'tournament-logos',
                  file: logoFile,
                  prefix: 'tournaments',
                })
                payload.logo_path = upload.path
                payload.logo_url = null
              } else if (logoUrl) {
                payload.logo_url = logoUrl
                payload.logo_path = null
              }
              await onCreate(payload)
              setLogoFile(null)
              setLogoUrl('')
            }}
          >
            Create
          </button>
        </div>
      </GlassCard>
      <GlassCard className="lg:col-span-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Tournaments</p>
        {editingLogoId ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Replace Logo</p>
            <div className="mt-3">
              <LogoUploader
                label="New Tournament Logo"
                file={editLogoFile}
                imageUrl={editLogoUrl}
                onFileChange={setEditLogoFile}
                onUrlChange={setEditLogoUrl}
                onRemove={() => {
                  setEditLogoFile(null)
                  setEditLogoUrl('')
                }}
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-brand-500 px-3 py-1 text-xs"
                  onClick={async () => {
                    const tournament = tournaments.find((t) => t.id === editingLogoId)
                    if (!tournament) return
                    const payload: Partial<Tournament> = {}
                    if (editLogoFile) {
                      const upload = await uploadImage({
                        bucket: 'tournament-logos',
                        file: editLogoFile,
                        prefix: 'tournaments',
                      })
                      payload.logo_path = upload.path
                      payload.logo_url = null
                      if (tournament.logo_path) {
                        await deleteImage({ bucket: 'tournament-logos', path: tournament.logo_path })
                      }
                    } else if (editLogoUrl) {
                      payload.logo_url = editLogoUrl
                      payload.logo_path = null
                      if (tournament.logo_path) {
                        await deleteImage({ bucket: 'tournament-logos', path: tournament.logo_path })
                      }
                    }
                    await onUpdate(tournament.id, payload)
                    setEditingLogoId(null)
                    setEditLogoFile(null)
                    setEditLogoUrl('')
                  }}
                >
                  Save Logo
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                  onClick={() => {
                    setEditingLogoId(null)
                    setEditLogoFile(null)
                    setEditLogoUrl('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-4">
          <AdminTable
            title="Tournaments"
            rows={tournaments}
            searchKeys={['name']}
            columns={[
              {
                key: 'name',
                label: 'Tournament',
                sortValue: (row) => row.name,
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl({ entity: row, bucket: 'tournament-logos' })}
                      alt={row.name}
                      className="h-10 w-10 rounded-xl object-cover"
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                    <input
                      className="rounded-lg bg-field px-2 py-1 text-sm"
                      value={edit[row.id]?.name ?? row.name}
                      onChange={(event) =>
                        setEdit((prev) => ({ ...prev, [row.id]: { ...prev[row.id], name: event.target.value } }))
                      }
                    />
                  </div>
                ),
              },
              {
                key: 'format',
                label: 'Format',
                render: (row) => (
                  <select
                    className="rounded-lg bg-field px-2 py-1 text-xs"
                    value={edit[row.id]?.format ?? row.format}
                    onChange={(event) =>
                      setEdit((prev) => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], format: event.target.value as Format },
                      }))
                    }
                  >
                    {formats.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={() => onUpdate(row.id, edit[row.id] ?? {})}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-brand-500/60 px-3 py-1 text-xs"
                      onClick={() => setEditingLogoId(row.id)}
                    >
                      Replace Logo
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={async () => {
                        if (row.logo_path) {
                          await deleteImage({ bucket: 'tournament-logos', path: row.logo_path })
                        }
                        await onUpdate(row.id, { logo_path: null, logo_url: null })
                      }}
                    >
                      Remove Logo
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-red-500/70 px-3 py-1 text-xs"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </GlassCard>
    </div>
  )
}

const LeaguesAdmin = ({
  leagues,
  formats,
  onCreate,
  onUpdate,
  onDelete,
}: {
  leagues: League[]
  formats: Format[]
  onCreate: (payload: Partial<League>) => Promise<void>
  onUpdate: (id: string, payload: Partial<League>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) => {
  const [form, setForm] = useState<Partial<League>>({ format: 'T20' })
  const [edit, setEdit] = useState<Record<string, Partial<League>>>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null)
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null)
  const [editLogoUrl, setEditLogoUrl] = useState('')
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GlassCard>
        <p className="text-xs uppercase tracking-widest text-slate-400">Create League</p>
        <div className="mt-4 space-y-3 text-sm">
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Name"
            value={form.name ?? ''}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.format ?? 'T20'}
            onChange={(event) => setForm({ ...form, format: event.target.value as Format })}
          >
            {formats.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))}
          </select>
          <LogoUploader
            label="League Logo"
            file={logoFile}
            imageUrl={logoUrl}
            onFileChange={setLogoFile}
            onUrlChange={setLogoUrl}
            onRemove={() => {
              setLogoFile(null)
              setLogoUrl('')
            }}
          />
          <button
            type="button"
            className="w-full rounded-xl bg-accent-500 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={async () => {
              const payload = { ...form }
              if (logoFile) {
                const upload = await uploadImage({
                  bucket: 'league-logos',
                  file: logoFile,
                  prefix: 'leagues',
                })
                payload.logo_path = upload.path
                payload.logo_url = null
              } else if (logoUrl) {
                payload.logo_url = logoUrl
                payload.logo_path = null
              }
              await onCreate(payload)
              setLogoFile(null)
              setLogoUrl('')
            }}
          >
            Create
          </button>
        </div>
      </GlassCard>
      <GlassCard className="lg:col-span-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Leagues</p>
        {editingLogoId ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Replace Logo</p>
            <div className="mt-3">
              <LogoUploader
                label="New League Logo"
                file={editLogoFile}
                imageUrl={editLogoUrl}
                onFileChange={setEditLogoFile}
                onUrlChange={setEditLogoUrl}
                onRemove={() => {
                  setEditLogoFile(null)
                  setEditLogoUrl('')
                }}
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-brand-500 px-3 py-1 text-xs"
                  onClick={async () => {
                    const league = leagues.find((l) => l.id === editingLogoId)
                    if (!league) return
                    const payload: Partial<League> = {}
                    if (editLogoFile) {
                      const upload = await uploadImage({
                        bucket: 'league-logos',
                        file: editLogoFile,
                        prefix: 'leagues',
                      })
                      payload.logo_path = upload.path
                      payload.logo_url = null
                      if (league.logo_path) {
                        await deleteImage({ bucket: 'league-logos', path: league.logo_path })
                      }
                    } else if (editLogoUrl) {
                      payload.logo_url = editLogoUrl
                      payload.logo_path = null
                      if (league.logo_path) {
                        await deleteImage({ bucket: 'league-logos', path: league.logo_path })
                      }
                    }
                    await onUpdate(league.id, payload)
                    setEditingLogoId(null)
                    setEditLogoFile(null)
                    setEditLogoUrl('')
                  }}
                >
                  Save Logo
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                  onClick={() => {
                    setEditingLogoId(null)
                    setEditLogoFile(null)
                    setEditLogoUrl('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-4">
          <AdminTable
            title="Leagues"
            rows={leagues}
            searchKeys={['name']}
            columns={[
              {
                key: 'league',
                label: 'League',
                sortValue: (row) => row.name,
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl({ entity: row, bucket: 'league-logos' })}
                      alt={row.name}
                      className="h-10 w-10 rounded-xl object-cover"
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                    <input
                      className="rounded-lg bg-field px-2 py-1 text-sm"
                      value={edit[row.id]?.name ?? row.name}
                      onChange={(event) =>
                        setEdit((prev) => ({ ...prev, [row.id]: { ...prev[row.id], name: event.target.value } }))
                      }
                    />
                  </div>
                ),
              },
              {
                key: 'format',
                label: 'Format',
                render: (row) => (
                  <select
                    className="rounded-lg bg-field px-2 py-1 text-xs"
                    value={edit[row.id]?.format ?? row.format}
                    onChange={(event) =>
                      setEdit((prev) => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], format: event.target.value as Format },
                      }))
                    }
                  >
                    {formats.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={() => onUpdate(row.id, edit[row.id] ?? {})}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-brand-500/60 px-3 py-1 text-xs"
                      onClick={() => setEditingLogoId(row.id)}
                    >
                      Replace Logo
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={async () => {
                        if (row.logo_path) {
                          await deleteImage({ bucket: 'league-logos', path: row.logo_path })
                        }
                        await onUpdate(row.id, { logo_path: null, logo_url: null })
                      }}
                    >
                      Remove Logo
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-red-500/70 px-3 py-1 text-xs"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </GlassCard>
    </div>
  )
}

const SeriesAdmin = ({
  series,
  formats,
  onCreate,
  onUpdate,
  onDelete,
}: {
  series: Series[]
  formats: Format[]
  onCreate: (payload: Partial<Series>) => Promise<void>
  onUpdate: (id: string, payload: Partial<Series>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) => {
  const [form, setForm] = useState<Partial<Series>>({ format: 'ODI' })
  const [edit, setEdit] = useState<Record<string, Partial<Series>>>({})
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GlassCard>
        <p className="text-xs uppercase tracking-widest text-slate-400">Create Series</p>
        <div className="mt-4 space-y-3 text-sm">
          <input
            className="w-full rounded-xl bg-field p-2"
            placeholder="Name"
            value={form.name ?? ''}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.format ?? 'ODI'}
            onChange={(event) => setForm({ ...form, format: event.target.value as Format })}
          >
            {formats.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="w-full rounded-xl bg-accent-500 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={() => onCreate(form)}
          >
            Create
          </button>
        </div>
      </GlassCard>
      <GlassCard className="lg:col-span-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Series</p>
        <div className="mt-4">
          <AdminTable
            title="Series"
            rows={series}
            searchKeys={['name']}
            columns={[
              {
                key: 'series',
                label: 'Series',
                sortValue: (row) => row.name,
                render: (row) => (
                  <input
                    className="rounded-lg bg-field px-2 py-1 text-sm"
                    value={edit[row.id]?.name ?? row.name}
                    onChange={(event) =>
                      setEdit((prev) => ({ ...prev, [row.id]: { ...prev[row.id], name: event.target.value } }))
                    }
                  />
                ),
              },
              {
                key: 'format',
                label: 'Format',
                render: (row) => (
                  <select
                    className="rounded-lg bg-field px-2 py-1 text-xs"
                    value={edit[row.id]?.format ?? row.format}
                    onChange={(event) =>
                      setEdit((prev) => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], format: event.target.value as Format },
                      }))
                    }
                  >
                    {formats.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-white/10 px-3 py-1 text-xs"
                      onClick={() => onUpdate(row.id, edit[row.id] ?? {})}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-red-500/70 px-3 py-1 text-xs"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </GlassCard>
    </div>
  )
}

const FixturesAdmin = ({
  fixtures,
  teamOptions,
  venues,
  tournaments,
  series,
  onCreate,
  onDelete,
}: {
  fixtures: Fixture[]
  teamOptions: { value: string; label: string }[]
  venues: Venue[]
  tournaments: Tournament[]
  series: Series[]
  onCreate: (payload: Partial<Fixture>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) => {
  const [form, setForm] = useState<Partial<Fixture>>({
    status: 'SCHEDULED',
    scheduled_at: new Date().toISOString(),
  })

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GlassCard>
        <p className="text-xs uppercase tracking-widest text-slate-400">Create Fixture</p>
        <div className="mt-4 space-y-3 text-sm">
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.tournament_id ?? ''}
            onChange={(event) => setForm({ ...form, tournament_id: event.target.value })}
          >
            <option value="">Tournament (optional)</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.series_id ?? ''}
            onChange={(event) => setForm({ ...form, series_id: event.target.value })}
          >
            <option value="">Series (optional)</option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.home_team_id ?? ''}
            onChange={(event) => setForm({ ...form, home_team_id: event.target.value })}
          >
            <option value="">Home Team</option>
            {teamOptions.map((team) => (
              <option key={team.value} value={team.value}>
                {team.label}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.away_team_id ?? ''}
            onChange={(event) => setForm({ ...form, away_team_id: event.target.value })}
          >
            <option value="">Away Team</option>
            {teamOptions.map((team) => (
              <option key={team.value} value={team.value}>
                {team.label}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-xl bg-field p-2"
            value={form.venue_id ?? ''}
            onChange={(event) => setForm({ ...form, venue_id: event.target.value })}
          >
            <option value="">Venue</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded-xl bg-field p-2"
            type="datetime-local"
            value={(form.scheduled_at ?? '').slice(0, 16)}
            onChange={(event) =>
              setForm({ ...form, scheduled_at: new Date(event.target.value).toISOString() })
            }
          />
          <button
            type="button"
            className="w-full rounded-xl bg-accent-500 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={() => onCreate(form)}
          >
            Create
          </button>
        </div>
      </GlassCard>
      <GlassCard className="lg:col-span-2">
        <p className="text-xs uppercase tracking-widest text-slate-400">Fixtures</p>
        <div className="mt-4">
          <AdminTable
            title="Fixtures"
            rows={fixtures}
            searchKeys={['status']}
            columns={[
              {
                key: 'status',
                label: 'Status',
                sortValue: (row) => row.status,
                render: (row) => (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-slate-200">
                    {row.status}
                  </span>
                ),
              },
              {
                key: 'date',
                label: 'Schedule',
                sortValue: (row) => row.scheduled_at,
                render: (row) => <span className="text-xs text-slate-400">{row.scheduled_at}</span>,
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <button
                    type="button"
                    className="rounded-lg bg-red-500/70 px-3 py-1 text-xs"
                    onClick={() => onDelete(row.id)}
                  >
                    Delete
                  </button>
                ),
              },
            ]}
          />
        </div>
      </GlassCard>
    </div>
  )
}

const ImagesAdmin = () => {
  const [bucket, setBucket] = useState<'player-images' | 'team-logos' | 'tournament-logos' | 'league-logos'>(
    'player-images',
  )
  const [files, setFiles] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const folderMap: Record<typeof bucket, string> = {
    'player-images': 'players',
    'team-logos': 'teams',
    'tournament-logos': 'tournaments',
    'league-logos': 'leagues',
  }

  const load = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const folder = folderMap[bucket]
      const data = await listImages({ bucket, folder })
      setFiles(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list images')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [bucket])

  return (
    <GlassCard>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Image Manager</p>
          <p className="text-xs text-slate-500">View and delete uploaded assets.</p>
        </div>
        <select
          className="rounded-xl bg-field p-2 text-sm"
          value={bucket}
          onChange={(event) =>
            setBucket(event.target.value as 'player-images' | 'team-logos' | 'tournament-logos' | 'league-logos')
          }
        >
          <option value="player-images">Players</option>
          <option value="team-logos">Teams</option>
          <option value="tournament-logos">Tournaments</option>
          <option value="league-logos">Leagues</option>
        </select>
      </div>
      {loading ? <p className="mt-3 text-sm text-slate-400">Loading...</p> : null}
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      <div className="mt-4">
        <AdminTable
          title="Images"
          rows={files}
          searchKeys={['name']}
          columns={[
            {
              key: 'file',
              label: 'File',
              sortValue: (row) => row.name,
              render: (row) => {
                const folder = folderMap[bucket]
                const path = folder ? `${folder}/${row.name}` : row.name
                return (
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl({ entity: { logo_path: path }, bucket })}
                      alt={row.name}
                      className="h-10 w-10 rounded-lg object-cover"
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                    <span className="text-sm">{row.name}</span>
                  </div>
                )
              },
            },
            {
              key: 'meta',
              label: 'Meta',
              render: (row) => (
                <span className="text-xs text-slate-500">
                  {Math.round((row.metadata?.size ?? 0) / 1024)} KB •{' '}
                  {row.updated_at ?? row.created_at}
                </span>
              ),
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <button
                  type="button"
                  className="rounded-lg bg-red-500/70 px-3 py-1 text-xs"
                  onClick={async () => {
                    const folder = folderMap[bucket]
                    const path = folder ? `${folder}/${row.name}` : row.name
                    await deleteImage({ bucket, path })
                    await load()
                  }}
                >
                  Delete
                </button>
              ),
            },
          ]}
        />
      </div>
    </GlassCard>
  )
}

export default AdminPage

