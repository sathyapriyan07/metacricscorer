import { useCallback, useRef, useState } from 'react'

interface ImageUploaderProps {
  label: string
  description?: string
  file: File | null
  imageUrl: string
  onFileChange: (file: File) => void
  onUrlChange: (url: string) => void
  onRemove: () => void
}

const ImageUploader = ({
  label,
  description,
  file,
  imageUrl,
  onFileChange,
  onUrlChange,
  onRemove,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragActive(false)
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        const nextFile = event.dataTransfer.files[0]
        if (nextFile.size > 5 * 1024 * 1024) {
          setError('Max file size is 5MB.')
          return
        }
        setError('')
        onFileChange(nextFile)
      }
    },
    [onFileChange],
  )

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
        {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      </div>

      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center transition ${
          dragActive ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 bg-white/5'
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragActive(false)
        }}
        onDrop={handleDrop}
      >
        <p className="text-xs text-slate-400">Drag & drop image here</p>
        <button
          type="button"
          className="mt-2 rounded-lg bg-white/10 px-3 py-1 text-xs"
          onClick={() => inputRef.current?.click()}
        >
          Browse
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.[0]) {
              const nextFile = event.target.files[0]
              if (nextFile.size > 5 * 1024 * 1024) {
                setError('Max file size is 5MB.')
                return
              }
              setError('')
              onFileChange(nextFile)
            }
          }}
        />
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}

      <div className="grid gap-2">
        <input
          className="w-full rounded-xl bg-field p-2 text-sm"
          placeholder="Paste external image URL"
          value={imageUrl ?? ''}
          onChange={(event) => onUrlChange(event.target.value)}
        />
        {(file || imageUrl) && (
          <button
            type="button"
            className="rounded-xl bg-red-500/70 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white"
            onClick={onRemove}
          >
            Remove Image
          </button>
        )}
      </div>

      {(file || imageUrl) && (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <img
            src={file ? URL.createObjectURL(file) : imageUrl}
            alt="Preview"
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="text-xs text-slate-400">
            <p>Preview</p>
            <p className="text-slate-500">
              {file ? `${file.name} • ${Math.round(file.size / 1024)} KB` : 'External URL'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
