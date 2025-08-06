'use client'
import './toast.css'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Check, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message?: string
  type?: ToastType
  duration?: number
}

function ToastMessage({ duration = 5000 }: { duration?: number }) {
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [toast, setToast] = useState<ToastProps | null>(null)

  useEffect(() => {
    // Get toast parameters from URL
    const message = searchParams.get('toast')
    const type = (searchParams.get('toastType') as ToastType) || 'success'

    if (message) {
      setToast({ message, type })
      setVisible(true)

      // Auto-hide the toast after duration
      const timer = setTimeout(() => {
        setVisible(false)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [searchParams, duration])

  const typeConfig = {
    success: {
      bg: 'bg-green-500',
      icon: <Check size={16} />,
    },
    error: {
      bg: 'bg-red-500',
      icon: <X size={16} />
    },
    info: {
      bg: 'bg-blue-500',
      icon: <Info size={16} />
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: <TriangleAlert size={16} />
    }
  }[toast?.type || 'success']

  if (!visible || !toast) return null

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 flex justify-center z-60 mt-4 px-4 transition-all duration-300 ease-in-out transform",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
      )}
    >
      <div
        className={cn(
          "max-w-md w-full rounded-lg shadow-lg flex items-center overflow-hidden",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <div className={cn("w-2 self-stretch", typeConfig.bg)} />
        <div className={cn("flex-1 bg-white/10 glassEffect shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] p-4 flex items-center")}>
          <div className={cn("flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full mr-3", typeConfig.bg, "text-white")}>
            {typeConfig.icon}
          </div>
          <p className="text-sm text-gray-800  flex-1">
            {toast?.message}
          </p>
          <button
            onClick={() => setVisible(false)}
            className="ml-3 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {visible && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4">
          <div className="max-w-md w-full overflow-hidden rounded-b-lg">
            <div
              className={cn("h-1", typeConfig.bg)}
              style={{
                width: "100%",
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

export default function ToastMSG() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastMessage />
    </Suspense>
  )
}