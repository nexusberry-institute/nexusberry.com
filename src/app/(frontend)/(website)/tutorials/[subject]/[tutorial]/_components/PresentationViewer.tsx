'use client'

type Props = {
  url: string
}

function toEmbedUrl(url: string): string {
  // Google Slides: convert /edit or /pub to /embed
  if (/docs\.google\.com\/presentation/i.test(url)) {
    return url.replace(/\/(edit|pub)(#.*)?(\?.*)?$/, '/embed')
  }
  return url
}

function isIframeEmbeddable(url: string): boolean {
  return /docs\.google\.com\/presentation/i.test(url)
}

export default function PresentationViewer({ url }: Props) {
  if (isIframeEmbeddable(url)) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-border bg-black aspect-video">
        <iframe
          src={toEmbedUrl(url)}
          title="Presentation"
          className="w-full h-full"
          allowFullScreen
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center space-y-4">
      <div className="flex justify-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>
      <p className="text-muted-foreground">View the presentation for this tutorial</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Open Presentation
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  )
}
