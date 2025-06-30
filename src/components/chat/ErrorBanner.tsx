"use client"

interface ErrorBannerProps {
  error: string | null
  onDismiss: () => void
}

export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  if (!error) return null

  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 text-sm">
      <span>{error}</span>
      <button onClick={onDismiss} className="ml-2 text-red-300 hover:text-red-200">
        ×
      </button>
    </div>
  )
}
