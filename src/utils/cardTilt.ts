const cleanupKey = '__tiltCleanup'

export const vCardTilt = {
  mounted(el: HTMLElement) {
    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0
    let rafId: number
    let isRunning = false

    el.style.transformStyle = 'preserve-3d'
    el.style.willChange = 'transform'

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const loop = () => {
      currentX = lerp(currentX, targetX, 0.15)
      currentY = lerp(currentY, targetY, 0.15)
      el.style.transform = `perspective(800px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`
      const atRest = Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01 && targetX === 0 && targetY === 0
      if (atRest) {
        isRunning = false
        return
      }
      rafId = requestAnimationFrame(loop)
    }

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      targetY = ((x - rect.width / 2) / (rect.width / 2)) * 6
      targetX = -((y - rect.height / 2) / (rect.height / 2)) * 6
      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(loop)
      }
    }, { passive: true })

    el.addEventListener('mouseleave', () => {
      targetX = 0
      targetY = 0
      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(loop)
      }
    }, { passive: true })

    ;(el as any)[cleanupKey] = () => {
      cancelAnimationFrame(rafId)
    }
  },
  unmounted(el: HTMLElement) {
    const cleanup = (el as any)[cleanupKey]
    if (cleanup) cleanup()
  }
}
