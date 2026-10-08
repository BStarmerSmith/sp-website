import './style.css'
import { CardDeck } from './card'
import { Aurora } from './aurora'
import { buildCards, type YamlDeck } from './content'
import { initCardEffects } from './effects'
import deckContent from '../content/cards.yaml'

document.addEventListener('DOMContentLoaded', () => {
  // No nav and no burger menu: the site is three pages — the card home
  // page, and the two legal pages, which carry only the logo back to it.

  // Aurora background — the home page and both legal pages, which share it.
  const auroraContainer = document.getElementById('auroraContainer')
  if (auroraContainer) {
    new Aurora({ container: auroraContainer })
  }

  // Card deck — home page only
  const stage = document.getElementById('cardStage') as HTMLElement | null
  const wrapper = document.getElementById('cardWrapper') as HTMLElement | null
  const frontImg = document.getElementById('cardFrontImage') as HTMLImageElement | null
  const backImg = document.getElementById('cardBackImage') as HTMLImageElement | null
  const navDotsContainer = document.getElementById('cardNavDots') as HTMLElement | null

  initCardEffects()

  if (stage && wrapper && frontImg && backImg) {
    const cards = buildCards(deckContent as YamlDeck)
    const deck = new CardDeck(stage, wrapper, frontImg, backImg, {
      cards,

      onStateChange: ({ step }) => {
        if (!navDotsContainer) return
        const currentCardIndex = Math.floor(step / 2)
        
        // Update active state on dots
        const dots = navDotsContainer.querySelectorAll('.card-nav-dot')
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentCardIndex)
        })
      },
    })

    // Create navigation dots
    if (navDotsContainer) {
      cards.forEach((card, index) => {
        const dot = document.createElement('button')
        dot.className = 'card-nav-dot'
        const cardName = card.name || `Card ${index + 1}`
        dot.setAttribute('aria-label', `Go to ${cardName}`)
        dot.setAttribute('title', cardName)
        
        // Set initial active state
        if (index === 0) {
          dot.classList.add('active')
        }

        // Handle click to jump to card
        dot.addEventListener('click', () => {
          if (!dot.classList.contains('active')) {
            deck.jumpToCard(index)
          }
        })

        navDotsContainer.appendChild(dot)
      })
    }
  }
})
