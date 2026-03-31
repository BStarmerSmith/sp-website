import './style.css'
import { CardDeck } from './card'
import { buildCards, type YamlDeck } from './content'
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

  // Card deck — home page only
  const stage = document.getElementById('cardStage') as HTMLElement | null
  const wrapper = document.getElementById('cardWrapper') as HTMLElement | null
  const frontImg = document.getElementById('cardFrontImage') as HTMLImageElement | null
  const backImg = document.getElementById('cardBackImage') as HTMLImageElement | null
  const flipUp = document.getElementById('flipUp') as HTMLElement | null
  const flipDown = document.getElementById('flipDown') as HTMLElement | null

  if (stage && wrapper && frontImg && backImg) {
    new CardDeck(stage, wrapper, frontImg, backImg, {
      cards: buildCards(deckContent as YamlDeck),

      onStateChange: ({ step, maxStep, sideOpen }) => {
        if (!flipUp || !flipDown) return
        flipUp.classList.toggle('inactive', step === 0 || sideOpen)
        flipDown.classList.toggle('inactive', step === maxStep || sideOpen)
      },
    })
  }
})
