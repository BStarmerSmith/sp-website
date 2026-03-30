export interface CardFace {
  src: string
  alt?: string
}

export interface CardDeckConfig {
  frontFaces: CardFace[]
  backFaces: CardFace[]
  /** Total full rotations across the entire scroll distance. Defaults to frontFaces.length */
  totalRotations?: number
}

export class CardDeck {
  private readonly wrapper: HTMLElement
  private readonly frontImg: HTMLImageElement
  private readonly backImg: HTMLImageElement
  private readonly frontFaces: CardFace[]
  private readonly backFaces: CardFace[]
  private readonly totalRotations: number

  private lastCycleCount = -1
  private updatePending = false

  constructor(
    wrapper: HTMLElement,
    frontImg: HTMLImageElement,
    backImg: HTMLImageElement,
    config: CardDeckConfig,
  ) {
    this.wrapper = wrapper
    this.frontImg = frontImg
    this.backImg = backImg
    this.frontFaces = config.frontFaces
    this.backFaces = config.backFaces
    this.totalRotations = config.totalRotations ?? config.frontFaces.length

    this.setFace(this.frontImg, this.frontFaces[0])
    this.setFace(this.backImg, this.backFaces[0])

    window.addEventListener('scroll', () => this.handleScroll(), { passive: true })
  }

  private setFace(img: HTMLImageElement, face: CardFace): void {
    img.src = face.src
    img.alt = face.alt ?? ''
  }

  private handleScroll(): void {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
    const rotation = progress * this.totalRotations * 360

    this.wrapper.style.transform = `rotateY(${rotation}deg)`
    this.tick(rotation)
  }

  private tick(rotation: number): void {
    const cycleCount = Math.floor(rotation / 360)
    const normalized = rotation % 360
    const isShowingBack = normalized > 135 && normalized < 225

    if (isShowingBack && cycleCount !== this.lastCycleCount && !this.updatePending) {
      this.updatePending = true
      this.lastCycleCount = cycleCount

      this.setFace(this.frontImg, this.frontFaces[cycleCount % this.frontFaces.length])
      this.setFace(this.backImg, this.backFaces[cycleCount % this.backFaces.length])
    }

    if (!isShowingBack) {
      this.updatePending = false
    }
  }
}
