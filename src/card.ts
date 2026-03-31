export interface CardFace {
  src: string
  alt?: string
}

export interface SidePage {
  title: string
  body: string
}

export interface Card {
  front: CardFace
  back: CardFace
  sidePage?: SidePage
}

export interface CardDeckState {
  step: number
  maxStep: number
  sideOpen: boolean
  hasSidePage: boolean
  sideDir: 'right' | 'left'
}

export interface CardDeckConfig {
  cards: Card[]
  /** Duration of flip and side-page animations in ms. Defaults to 600 */
  animationDurationMs?: number
  /** Called after every state change — use to drive external UI like indicators */
  onStateChange?: (state: CardDeckState) => void
}

export class CardDeck {
  private readonly wrapper: HTMLElement
  private readonly stage: HTMLElement
  private readonly frontImg: HTMLImageElement
  private readonly backImg: HTMLImageElement
  private readonly cards: Card[]
  private readonly dur: number
  private readonly onStateChange?: (state: CardDeckState) => void
  private readonly sidePageEl: HTMLElement

  // Each card = two steps: even step = front, odd step = back
  private step = 0
  private readonly maxStep: number
  private animating = false
  private sideOpen = false

  constructor(
    stage: HTMLElement,
    wrapper: HTMLElement,
    frontImg: HTMLImageElement,
    backImg: HTMLImageElement,
    config: CardDeckConfig,
  ) {
    this.stage = stage
    this.wrapper = wrapper
    this.frontImg = frontImg
    this.backImg = backImg
    this.cards = config.cards
    this.dur = config.animationDurationMs ?? 600
    // Last step is the front of the final card — backs are only shown between cards
    this.maxStep = config.cards.length * 2 - 2
    this.onStateChange = config.onStateChange

    this.sidePageEl = document.createElement('div')
    this.stage.appendChild(this.sidePageEl)

    this.loadCard(0)
    this.syncSidePage()
    this.applyCardTransform(false)
    this.emitState()
    this.bindEvents()
  }

  // ── Helpers ──────────────────────────────────────────────

  private cardIndex(step = this.step): number {
    return Math.floor(step / 2)
  }

  private getSideDir(cardIdx = this.cardIndex()): 'right' | 'left' {
    return cardIdx % 2 === 0 ? 'right' : 'left'
  }

  private currentCard(): Card {
    return this.cards[this.cardIndex()]
  }

  private setFace(img: HTMLImageElement, face: CardFace): void {
    img.src = face.src
    img.alt = face.alt ?? ''
  }

  private loadCard(index: number): void {
    const card = this.cards[index]
    this.setFace(this.frontImg, card.front)
    this.setFace(this.backImg, card.back)
  }

  private emitState(): void {
    this.onStateChange?.({
      step: this.step,
      maxStep: this.maxStep,
      sideOpen: this.sideOpen,
      hasSidePage: !!this.currentCard().sidePage,
      sideDir: this.getSideDir(),
    })
  }

  private get sideOffset(): number {
    return window.innerWidth < 768 ? 160 : 216
  }

  private get settledCardX(): number {
    if (!this.sideOpen) return 0
    return this.getSideDir() === 'right' ? -this.sideOffset : this.sideOffset
  }

  // ── Transforms ───────────────────────────────────────────

  private applyCardTransform(animate: boolean): void {
    const degrees = this.step * 180
    this.wrapper.style.transition = animate ? `transform ${this.dur}ms ease-in-out` : 'none'
    this.wrapper.style.transform = `translateX(${this.settledCardX}px) rotateY(${degrees}deg)`
  }

  private setSidePagePosition(progress: number, animate: boolean): void {
    const t = Math.max(0, Math.min(1, progress))
    const cardHalfWidth = window.innerWidth < 768 ? 150 : 200
    const hidden = window.innerWidth / 2 + cardHalfWidth + 32
    const open = 16
    const tx = hidden + (open - hidden) * t
    const dir = this.getSideDir()

    this.sidePageEl.style.transition = animate
      ? `transform ${this.dur}ms ease-in-out, opacity ${this.dur}ms ease-in-out`
      : 'none'
    this.sidePageEl.style.transform = dir === 'right'
      ? `translateY(-50%) translateX(${tx}px)`
      : `translateY(-50%) translateX(${-tx}px)`
    this.sidePageEl.style.opacity = String(t)
    this.sidePageEl.style.pointerEvents = t > 0.5 ? 'auto' : 'none'
  }

  private syncSidePage(): void {
    this.sidePageEl.className = `side-page side-page-${this.getSideDir()}`
    const sp = this.currentCard().sidePage
    this.sidePageEl.innerHTML = sp
      ? `<h2 class="side-page-title">${sp.title}</h2><div class="side-page-body">${sp.body}</div>`
      : ''
    void this.sidePageEl.offsetHeight
    this.setSidePagePosition(this.sideOpen ? 1 : 0, false)
  }

  // ── Side page open / close ────────────────────────────────

  private openSide(): void {
    if (this.sideOpen || !this.currentCard().sidePage || this.animating) return
    this.animating = true
    this.sideOpen = true
    this.applyCardTransform(true)
    this.setSidePagePosition(1, true)
    this.emitState()
    setTimeout(() => { this.animating = false }, this.dur)
  }

  private closeSide(): void {
    if (!this.sideOpen || this.animating) return
    this.animating = true
    this.sideOpen = false
    this.applyCardTransform(true)
    this.setSidePagePosition(0, true)
    this.emitState()
    setTimeout(() => { this.animating = false }, this.dur)
  }

  // ── Card flip ────────────────────────────────────────────

  advance(direction: 1 | -1): void {
    if (this.sideOpen || this.animating) return
    const nextStep = this.step + direction
    if (nextStep < 0 || nextStep > this.maxStep) return

    this.animating = true

    const fromCardIdx = this.cardIndex(this.step)
    const toCardIdx = this.cardIndex(nextStep)
    const cardChanges = fromCardIdx !== toCardIdx

    if (cardChanges) {
      const toCard = this.cards[toCardIdx]
      if (direction === 1) {
        this.setFace(this.frontImg, toCard.front)
      } else {
        this.setFace(this.backImg, toCard.back)
      }
    }

    this.step = nextStep
    this.applyCardTransform(true)
    this.emitState()

    setTimeout(() => {
      if (cardChanges) {
        const toCard = this.cards[this.cardIndex()]
        if (direction === 1) {
          this.setFace(this.backImg, toCard.back)
        } else {
          this.setFace(this.frontImg, toCard.front)
        }
        this.syncSidePage()
      }
      this.animating = false
    }, this.dur)
  }

  // ── Event binding ────────────────────────────────────────

  private bindEvents(): void {

    // Click card → open side page (front face only — even step)
    this.wrapper.addEventListener('click', () => {
      if (this.animating) return
      if (this.step % 2 === 0 && this.currentCard().sidePage) this.openSide()
    })

    // Click side page → close
    this.sidePageEl.addEventListener('click', () => {
      if (this.animating) return
      this.closeSide()
    })

    // Wheel: vertical flips cards
    window.addEventListener('wheel', (e) => {
      e.preventDefault()
      if (this.animating || this.sideOpen) return
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        this.advance(e.deltaY > 0 ? 1 : -1)
      }
    }, { passive: false })

    // Touch swipe: vertical flips, horizontal not needed anymore
    let touchStartX = 0
    let touchStartY = 0

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }, { passive: true })

    window.addEventListener('touchend', (e) => {
      if (this.animating) return
      const dx = e.changedTouches[0].clientX - touchStartX
      const dy = e.changedTouches[0].clientY - touchStartY
      // Only act on predominantly vertical swipes when side is closed
      if (!this.sideOpen && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
        this.advance(dy < 0 ? 1 : -1)
      }
    }, { passive: true })

    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (this.animating) return
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (!this.sideOpen) this.advance(1)
          break
        case 'ArrowUp':
          e.preventDefault()
          if (!this.sideOpen) this.advance(-1)
          break
        case 'ArrowLeft':
        case 'ArrowRight':
          e.preventDefault()
          if (this.sideOpen) this.closeSide()
          else if (this.step % 2 === 0) this.openSide()
          break
        case 'Escape':
          e.preventDefault()
          if (this.sideOpen) this.closeSide()
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (this.sideOpen) this.closeSide()
          else if (this.step % 2 === 0) this.openSide()
          break
      }
    })
  }
}
