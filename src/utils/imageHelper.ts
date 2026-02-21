import { getPublicUrl } from '../services/storageService'

interface ImageEntity {
  image_path?: string | null
  logo_path?: string | null
  image_url?: string | null
  logo_url?: string | null
}

export const getImageUrl = ({
  entity,
  bucket,
  fallback = '/placeholder.svg',
}: {
  entity?: ImageEntity | null
  bucket: string
  fallback?: string
}): string => {
  if (!entity) return fallback
  if (entity.image_path) return getPublicUrl(bucket, entity.image_path) ?? fallback
  if (entity.logo_path) return getPublicUrl(bucket, entity.logo_path) ?? fallback
  if (entity.image_url) return entity.image_url
  if (entity.logo_url) return entity.logo_url
  return fallback
}
