import './style.css'
import { CardDeck } from './card'
import { Aurora } from './aurora'
import { buildCards, type YamlDeck } from './content'
import { initCardEffects } from './effects'
import deckContent from '../content/cards.yaml'

document.addEventListener('DOMContentLoaded', () => {
  // Active nav link highlighting (inner pages only — home has no nav)
  const currentPath = window.location.pathname
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a')

  navLinks.forEach(link => {
    const href = link.getAttribute('href')
    if (
      href === currentPath ||
      (currentPath === '/' && href === '/') ||
      (currentPath.endsWith('index.html') && href === '/')
    ) {
      link.classList.add('nav-link-active')
    }
  })

  // Mobile menu toggle (inner pages only)
  const menuBtn = document.querySelector('.mobile-menu-btn')
  const mobileNav = document.querySelector('.mobile-nav')
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => mobileNav.classList.toggle('open'))
  }

  // Aurora background — home page only
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
