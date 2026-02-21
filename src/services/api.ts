import { supabase } from './supabase'
import type { Fixture, League, Player, Series, Team, Tournament, Venue } from '../types'

export const fetchPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase.from('players').select('*')
  if (error) throw error
  return data as Player[]
}

export const fetchTeams = async (): Promise<Team[]> => {
  const { data, error } = await supabase.from('teams').select('*')
  if (error) throw error
  return data as Team[]
}

export const fetchVenues = async (): Promise<Venue[]> => {
  const { data, error } = await supabase.from('venues').select('*')
  if (error) throw error
  return data as Venue[]
}

export const createPlayer = async (payload: Partial<Player>) => {
  const { data, error } = await supabase.from('players').insert(payload).select().single()
  if (error) throw error
  return data as Player
}

export const updatePlayer = async (id: string, payload: Partial<Player>) => {
  const { data, error } = await supabase.from('players').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as Player
}

export const deletePlayer = async (id: string) => {
  const { error } = await supabase.from('players').delete().eq('id', id)
  if (error) throw error
}

export const createTeam = async (payload: Partial<Team>) => {
  const { data, error } = await supabase.from('teams').insert(payload).select().single()
  if (error) throw error
  return data as Team
}

export const updateTeam = async (id: string, payload: Partial<Team>) => {
  const { data, error } = await supabase.from('teams').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as Team
}

export const deleteTeam = async (id: string) => {
  const { error } = await supabase.from('teams').delete().eq('id', id)
  if (error) throw error
}

export const createVenue = async (payload: Partial<Venue>) => {
  const { data, error } = await supabase.from('venues').insert(payload).select().single()
  if (error) throw error
  return data as Venue
}

export const updateVenue = async (id: string, payload: Partial<Venue>) => {
  const { data, error } = await supabase.from('venues').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as Venue
}

export const deleteVenue = async (id: string) => {
  const { error } = await supabase.from('venues').delete().eq('id', id)
  if (error) throw error
}

export const fetchTournaments = async (): Promise<Tournament[]> => {
  const { data, error } = await supabase.from('tournaments').select('*')
  if (error) throw error
  return data as Tournament[]
}

export const createTournament = async (payload: Partial<Tournament>) => {
  const { data, error } = await supabase.from('tournaments').insert(payload).select().single()
  if (error) throw error
  return data as Tournament
}

export const updateTournament = async (id: string, payload: Partial<Tournament>) => {
  const { data, error } = await supabase.from('tournaments').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as Tournament
}

export const deleteTournament = async (id: string) => {
  const { error } = await supabase.from('tournaments').delete().eq('id', id)
  if (error) throw error
}

export const fetchSeries = async (): Promise<Series[]> => {
  const { data, error } = await supabase.from('series').select('*')
  if (error) throw error
  return data as Series[]
}

export const createSeries = async (payload: Partial<Series>) => {
  const { data, error } = await supabase.from('series').insert(payload).select().single()
  if (error) throw error
  return data as Series
}

export const updateSeries = async (id: string, payload: Partial<Series>) => {
  const { data, error } = await supabase.from('series').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as Series
}

export const deleteSeries = async (id: string) => {
  const { error } = await supabase.from('series').delete().eq('id', id)
  if (error) throw error
}

export const fetchFixtures = async (): Promise<Fixture[]> => {
  const { data, error } = await supabase.from('fixtures').select('*')
  if (error) throw error
  return data as Fixture[]
}

export const createFixture = async (payload: Partial<Fixture>) => {
  const { data, error } = await supabase.from('fixtures').insert(payload).select().single()
  if (error) throw error
  return data as Fixture
}

export const updateFixture = async (id: string, payload: Partial<Fixture>) => {
  const { data, error } = await supabase.from('fixtures').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as Fixture
}

export const deleteFixture = async (id: string) => {
  const { error } = await supabase.from('fixtures').delete().eq('id', id)
  if (error) throw error
}

export const fetchLeagues = async (): Promise<League[]> => {
  const { data, error } = await supabase.from('leagues').select('*')
  if (error) throw error
  return data as League[]
}

export const createLeague = async (payload: Partial<League>) => {
  const { data, error } = await supabase.from('leagues').insert(payload).select().single()
  if (error) throw error
  return data as League
}

export const updateLeague = async (id: string, payload: Partial<League>) => {
  const { data, error } = await supabase.from('leagues').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data as League
}

export const deleteLeague = async (id: string) => {
  const { error } = await supabase.from('leagues').delete().eq('id', id)
  if (error) throw error
}
