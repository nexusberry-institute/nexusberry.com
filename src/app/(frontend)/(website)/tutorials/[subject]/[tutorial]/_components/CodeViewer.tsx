'use client'

type Props = {
  url: string
}

const EMBEDDABLE_PATTERNS = [
  { pattern: /codesandbox\.io/i, name: 'CodeSandbox' },
  { pattern: /stackblitz\.com/i, name: 'StackBlitz' },
  { pattern: /codepen\.io/i, name: 'CodePen' },
]

function isEmbeddable(url: string) {
  return EMBEDDABLE_PATTERNS.some(({ pattern }) => pattern.test(url))
}

export default function CodeViewer({ url }: Props) {
  if (isEmbeddable(url)) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-border bg-black aspect-video">
        <iframe
          src={url}
          title="Code Editor"
          className="w-full h-full"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
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
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <p className="text-muted-foreground">View the source code for this tutorial</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Open Code
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
