import { supabase } from './supabase'

export interface StorageFile {
  name: string
  id?: string
  updated_at?: string
  created_at?: string
  metadata?: {
    size?: number
    mimetype?: string
  }
}

const urlCache = new Map<string, string>()

export const getPublicUrl = (bucket: string, path?: string | null) => {
  if (!bucket || !path) return null
  const key = `${bucket}:${path}`
  if (urlCache.has(key)) return urlCache.get(key) ?? null
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  urlCache.set(key, data.publicUrl)
  return data.publicUrl
}

export const uploadImage = async ({
  bucket,
  file,
  prefix,
}: {
  bucket: string
  file: File
  prefix?: string
}) => {
  const fileExt = file.name.split('.').pop()
  const filename = `${crypto.randomUUID()}.${fileExt}`
  const path = prefix ? `${prefix}/${filename}` : filename
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })
  if (error) throw error
  const publicUrl = getPublicUrl(bucket, data.path)
  return { path: data.path, publicUrl }
}

export const deleteImage = async ({ bucket, path }: { bucket: string; path?: string | null }) => {
  if (!bucket || !path) return
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
  urlCache.delete(`${bucket}:${path}`)
}

export const listImages = async ({ bucket, folder }: { bucket: string; folder?: string }) => {
  const { data, error } = await supabase.storage.from(bucket).list(folder ?? '', {
    limit: 100,
    sortBy: { column: 'updated_at', order: 'desc' },
  })
  if (error) throw error
  return (data ?? []) as StorageFile[]
}
