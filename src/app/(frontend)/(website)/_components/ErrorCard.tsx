"use client"

export default function ErrorCard({ error }: { error: unknown }) {

  // Determine if it's likely a network error
  const errorMessage = error instanceof Error ? error.message : String(error)
  const isNetworkError = errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('timeout') ||
    errorMessage.toLowerCase().includes('fetch') ||
    errorMessage.toLowerCase().includes('connection');

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="bg-card rounded border-border border p-6 md:p-8 flex flex-col items-center text-center max-w-2xl mx-auto shadow-md">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: isNetworkError ? '#FEF3C7' : '#FEE2E2' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10"
            style={{ color: isNetworkError ? '#D97706' : '#EF4444' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isNetworkError ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            )}
          </svg>
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
          {isNetworkError ? "Connection Issue" : "Something went wrong"}
        </h2>

        <p className="text-muted-foreground text-justify mb-6">
          {isNetworkError
            ? "We're having trouble connecting to our servers. This might be due to a slow internet connection or network issue."
            : "We encountered an error while loading the content of this page. Please try again later."}
        </p>

        <div className={`p-4 rounded-lg border w-full mb-6 ${isNetworkError ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`font-medium text-sm md:text-base ${isNetworkError ? 'text-amber-600' : 'text-red-500'}`}>
            {errorMessage}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 p-3 rounded-xl text-card font-medium w-40 hover:border-r-2 hover:border-b-2 transition-all"
          >
            Try Again
          </button>

          {isNetworkError && (
            <button
              onClick={() => {
                // Cache the current URL to localStorage
                if (typeof window !== 'undefined') {
                  localStorage.setItem('lastVisitedPage', window.location.href);
                }
                // Redirect to offline page or show offline content
                window.location.href = '/offline';
              }}
              className="border border-primary-500 p-3 rounded-xl text-primary-500 font-medium w-40 hover:bg-primary-50 transition-all"
            >
              Offline Mode
            </button>
          )}
        </div>

        {isNetworkError && (
          <div className="mt-6 text-sm text-muted-foreground">
            <p className="font-bold text-start">Troubleshooting tips:</p>
            <ul className="list-disc text-left pl-6 mt-2">
              <li>Check your internet connection</li>
              <li>Try disabling VPN or proxy if you&#39;re using one</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try again in a few minutes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}