const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max)
const round = (v: number, p = 3) => parseFloat(v.toFixed(p))

export function initCardEffects(): void {
  const tiltStage = document.getElementById('cardTiltStage') as HTMLElement | null
  const stage = document.getElementById('cardStage') as HTMLElement | null

  if (!tiltStage || !stage) return

  let hovering = false
  let targetRX = 0
  let targetRY = 0
  let currentRX = 0
  let currentRY = 0

  // Smooth tilt lerp loop
  const tick = () => {
    const ease = hovering ? 0.15 : 0.07
    currentRX += (targetRX - currentRX) * ease
    currentRY += (targetRY - currentRY) * ease
    tiltStage.style.transform = `rotateY(${currentRX}deg) rotateX(${currentRY}deg)`
    requestAnimationFrame(tick)
  }
  tick()

  stage.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = tiltStage.getBoundingClientRect()
    const px = clamp(round((100 / rect.width) * (e.clientX - rect.left)))
    const py = clamp(round((100 / rect.height) * (e.clientY - rect.top)))
    targetRX = round(-(px - 50) / 3.5)
    targetRY = round((py - 50) / 3.5)
  })

  stage.addEventListener('mouseenter', () => { hovering = true })

  stage.addEventListener('mouseleave', () => {
    hovering = false
    targetRX = 0
    targetRY = 0
  })
}
