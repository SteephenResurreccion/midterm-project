import { useEffect, useRef, useState } from 'react'

export default function useScrollDirection(threshold = 6) {
  const [direction, setDirection] = useState('up') // 'up' | 'down'
  const [isAtTop, setIsAtTop] = useState(true)
  const lastY = useRef(window.scrollY)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setIsAtTop(y <= 4)

      const diff = Math.abs(y - lastY.current)
      if (diff < threshold) return

      if (y > lastY.current) setDirection('down')
      else setDirection('up')

      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return { direction, isAtTop }
}
