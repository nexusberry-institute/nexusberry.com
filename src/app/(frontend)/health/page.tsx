import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function HealthPage() {
  const timestamp = new Date().toISOString()

  return (
    <div style={{
      fontFamily: 'monospace',
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1>Health Check</h1>
      <div style={{ marginTop: '1rem' }}>
        <p><strong>Status:</strong> OK</p>
        <p><strong>Timestamp:</strong> {timestamp}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  )
}
