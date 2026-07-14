import { createContext, useCallback, useContext, useState } from 'react'
import { colors, fonts } from '../theme'

const ToastContext = createContext(null)
let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((message, type = 'success') => {
    idCounter += 1
    const id = idCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => dismiss(id), 3000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          maxWidth: 320,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            style={{
              background: t.type === 'error' ? '#DC2626' : colors.ink,
              color: '#fff',
              padding: '13px 18px',
              borderRadius: 12,
              fontFamily: fonts.body,
              fontSize: 13.5,
              fontWeight: 600,
              boxShadow: '0 12px 28px rgba(16,24,40,.22)',
              cursor: 'pointer',
              animation: 'toastIn .25s ease',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
