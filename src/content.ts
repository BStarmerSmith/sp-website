import { marked } from 'marked'
import type { Card } from './card'

// ── YAML schema types ─────────────────────────────────────────────────

export interface YamlSide {
  header: string
  body: string
}

export interface YamlCard {
  id: string
  position: number
  image: number
  side?: YamlSide
}

export interface YamlDeck {
  backs?: string[]
  cards: YamlCard[]
}

// ── Transformer ───────────────────────────────────────────────────────

const DEFAULT_BACKS = ['back_1.png', 'back_2.png']

export function buildCards(deck: YamlDeck): Card[] {
  const backs = deck.backs ?? DEFAULT_BACKS
  const sorted = [...deck.cards].sort((a, b) => a.position - b.position)

  return sorted.map((entry, i) => ({
    front: {
      src: `/assets/cards/${entry.image}.png`,
      alt: entry.id,
    },
    back: {
      src: `/assets/cards/${backs[i % backs.length]}`,
      alt: 'Card back',
    },
    sidePage: entry.side
      ? {
          title: entry.side.header,
          // marked returns HTML — rendered into the side panel via innerHTML
          body: marked(entry.side.body) as string,
        }
      : undefined,
  }))
}
