import { useEffect, useRef, useSyncExternalStore } from 'react'

const CURSOR_SPEED = 0.15
const CURSOR_HOVER_SCALE = 1.5
const CURSOR_TRAIL_SIZE = 40
const CURSOR_POINTER_SIZE = 16

const pointerStore = {
  subscribe(callback: () => void) {
    if (typeof window === 'undefined') return () => {}
    const mediaQuery = window.matchMedia('(any-pointer: fine)')
    mediaQuery.addEventListener('change', callback)
    return () => mediaQuery.removeEventListener('change', callback)
  },
  getSnapshot() {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(any-pointer: fine)').matches
  },
  getServerSnapshot() {
    return false
  }
}

export function CustomCursor() {
  const hasPointer = useSyncExternalStore(
    pointerStore.subscribe,
    pointerStore.getSnapshot,
    pointerStore.getServerSnapshot
  )

  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const currentScale = useRef(1)
  const pointerScale = useRef(1)
  const isHoveringRef = useRef(false)
  const isVisibleRef = useRef(false)
  const trailRef = useRef<HTMLDivElement | null>(null)
  const pointerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hasPointer) return

    let rafId: number
    let isLooping = false

    const updatePosition = () => {
      const targetX = mousePos.current.x
      const targetY = mousePos.current.y

      const dx = targetX - cursorPos.current.x
      const dy = targetY - cursorPos.current.y

      const targetScale = isHoveringRef.current ? CURSOR_HOVER_SCALE : 1
      const dScale = targetScale - currentScale.current

      const targetPointerScale = isHoveringRef.current ? 0.3 : 1
      const dPointerScale = targetPointerScale - pointerScale.current

      const targetOpacity = isVisibleRef.current ? 1 : 0

      if (
        Math.abs(dx) < 0.05 &&
        Math.abs(dy) < 0.05 &&
        Math.abs(dScale) < 0.005 &&
        Math.abs(dPointerScale) < 0.005
      ) {
        cursorPos.current.x = targetX
        cursorPos.current.y = targetY
        currentScale.current = targetScale
        pointerScale.current = targetPointerScale

        if (trailRef.current) {
          trailRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(${targetScale})`
          trailRef.current.style.opacity = String(targetOpacity * 0.85)
        }
        if (pointerRef.current) {
          pointerRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(${targetPointerScale})`
          pointerRef.current.style.opacity = String(targetOpacity)
        }

        isLooping = false
        return
      }

      cursorPos.current.x += dx * CURSOR_SPEED
      cursorPos.current.y += dy * CURSOR_SPEED
      currentScale.current += dScale * 0.15
      pointerScale.current += dPointerScale * 0.15

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) scale(${currentScale.current})`
        trailRef.current.style.opacity = String(targetOpacity * 0.85)
      }

      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(${pointerScale.current})`
        pointerRef.current.style.opacity = String(targetOpacity)
      }

      rafId = requestAnimationFrame(updatePosition)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisibleRef.current) {
        isVisibleRef.current = true
      }
      if (!isLooping) {
        isLooping = true
        rafId = requestAnimationFrame(updatePosition)
      }
    }

    const handleMouseLeave = () => {
      isVisibleRef.current = false
      if (!isLooping) {
        isLooping = true
        rafId = requestAnimationFrame(updatePosition)
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const isInteractive = target.closest("a, button, [role='button'], input, select, textarea, label, [data-state]")
      const newHover = !!isInteractive
      if (newHover !== isHoveringRef.current) {
        isHoveringRef.current = newHover
        if (!isLooping) {
          isLooping = true
          rafId = requestAnimationFrame(updatePosition)
        }
      }
    }

    const handleClick = (e: MouseEvent) => {
      const pulse = document.createElement('div')
      pulse.style.position = 'fixed'
      pulse.style.top = '0'
      pulse.style.left = '0'
      pulse.style.width = '40px'
      pulse.style.height = '40px'
      pulse.style.marginLeft = '-20px'
      pulse.style.marginTop = '-20px'
      pulse.style.borderRadius = '50%'
      pulse.style.border = '1.5px solid #ffffff'
      pulse.style.pointerEvents = 'none'
      pulse.style.zIndex = '99997'
      pulse.style.mixBlendMode = 'difference'
      pulse.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(0.5)`
      pulse.style.opacity = '0.8'
      pulse.style.transition = 'transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.4s cubic-bezier(0.1, 0.8, 0.3, 1)'

      document.body.appendChild(pulse)

      requestAnimationFrame(() => {
        pulse.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(2.5)`
        pulse.style.opacity = '0'
      })

      setTimeout(() => pulse.remove(), 400)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick, true)
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseover', handleMouseOver)

    isLooping = true
    rafId = requestAnimationFrame(updatePosition)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick, true)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(rafId)
    }
  }, [hasPointer])

  useEffect(() => {
    if (!hasPointer) {
      document.documentElement.style.cursor = ''
      document.getElementById('custom-cursor-style')?.remove()
      return
    }

    document.documentElement.style.cursor = 'none'
    const style = document.createElement('style')
    style.id = 'custom-cursor-style'
    style.innerHTML = '* { cursor: none !important; }'
    document.head.appendChild(style)

    return () => {
      document.documentElement.style.cursor = ''
      document.getElementById('custom-cursor-style')?.remove()
    }
  }, [hasPointer])

  if (!hasPointer) return null

  return (
    <>
      {/* Leading pointer dot — snaps to mouse immediately */}
      <div
        ref={pointerRef}
        style={{
          width: `${CURSOR_POINTER_SIZE}px`,
          height: `${CURSOR_POINTER_SIZE}px`,
          marginLeft: `-${CURSOR_POINTER_SIZE / 2}px`,
          marginTop: `-${CURSOR_POINTER_SIZE / 2}px`,
        }}
        className="custom-cursor-pointer"
      />
      {/* Trailing orb — lags behind with lerp */}
      <div
        ref={trailRef}
        style={{
          width: `${CURSOR_TRAIL_SIZE}px`,
          height: `${CURSOR_TRAIL_SIZE}px`,
          marginLeft: `-${CURSOR_TRAIL_SIZE / 2}px`,
          marginTop: `-${CURSOR_TRAIL_SIZE / 2}px`,
        }}
        className="custom-cursor-trail"
      />
    </>
  )
}