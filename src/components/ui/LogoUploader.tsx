import ImageUploader from './ImageUploader'

interface LogoUploaderProps {
  label?: string
  file: File | null
  imageUrl: string
  onFileChange: (file: File) => void
  onUrlChange: (url: string) => void
  onRemove: () => void
}

const LogoUploader = ({
  label = 'Logo / Image',
  ...props
}: LogoUploaderProps) => (
  <ImageUploader
    label={label}
    description="Upload JPG, PNG, or WEBP (max 5MB) or paste a URL."
    {...props}
  />
)

export default LogoUploader
