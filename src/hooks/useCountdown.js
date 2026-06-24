import { useEffect, useRef, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Counts down from `saleHours` + `saleMinutes` from mount, ticking every second.
 * Returns zero-padded { days, hours, mins, secs } strings.
 */
export function useCountdown(saleHours = 32, saleMinutes = 45) {
  const [time, setTime] = useState({ days: '00', hours: '00', mins: '00', secs: '00' })
  const endRef = useRef(0)

  useEffect(() => {
    endRef.current = Date.now() + (saleHours * 3600 + saleMinutes * 60) * 1000

    const tick = () => {
      let remaining = Math.max(0, endRef.current - Date.now())
      const days = Math.floor(remaining / 86400000)
      remaining -= days * 86400000
      const hours = Math.floor(remaining / 3600000)
      remaining -= hours * 3600000
      const mins = Math.floor(remaining / 60000)
      remaining -= mins * 60000
      const secs = Math.floor(remaining / 1000)
      setTime({ days: pad(days), hours: pad(hours), mins: pad(mins), secs: pad(secs) })
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [saleHours, saleMinutes])

  return time
}
