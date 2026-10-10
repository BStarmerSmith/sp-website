import { marked } from 'marked'
import type { Card } from './card'

// ── YAML schema types ─────────────────────────────────────────────────

export interface YamlSide {
  header: string
  body: string
}

export interface YamlCard {
  id: string
  name?: string
  position?: number
  image: number
  hidden?: boolean
  link?: string
  alt?: string
  side?: YamlSide
}

export interface YamlDeck {
  backs?: string[]
  cards: YamlCard[]
}

// ── Transformer ───────────────────────────────────────────────────────

const DEFAULT_BACKS = ['back_1.png', 'back_2.png', 'back_3.png', 'back_4.png']

export function buildCards(deck: YamlDeck): Card[] {
  const backs = deck.backs ?? DEFAULT_BACKS
  const sorted = deck.cards
    .filter((c) => !c.hidden)
    // Cards without a position go after the positioned ones, in file order
    .sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))

  return sorted.map((entry, i) => ({
    name: entry.name,
    link: entry.link,
    front: {
      src: `/assets/cards/${entry.image}.png`,
      alt: entry.alt ?? entry.name ?? entry.id,
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
