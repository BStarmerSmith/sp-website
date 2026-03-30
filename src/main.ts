import './style.css'
import { CardDeck } from './card'

document.addEventListener('DOMContentLoaded', () => {
  // Active nav link highlighting
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

  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn')
  const mobileNav = document.querySelector('.mobile-nav')

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open')
    })
  }

  // Card deck — home page only
  const wrapper = document.getElementById('cardWrapper') as HTMLElement | null
  const frontImg = document.getElementById('cardFrontImage') as HTMLImageElement | null
  const backImg = document.getElementById('cardBackImage') as HTMLImageElement | null

  if (wrapper && frontImg && backImg) {
    new CardDeck(wrapper, frontImg, backImg, {
      frontFaces: [
        { src: '/assets/cards/1.png', alt: 'Suzy Parker Games card 1' },
        { src: '/assets/cards/2.png', alt: 'Suzy Parker Games card 2' },
        { src: '/assets/cards/3.png', alt: 'Suzy Parker Games card 3' },
        { src: '/assets/cards/4.png', alt: 'Suzy Parker Games card 4' },
        { src: '/assets/cards/5.png', alt: 'Suzy Parker Games card 5' },
      ],
      backFaces: [
        { src: '/assets/cards/back_1.png', alt: 'Card back 1' },
        { src: '/assets/cards/back_2.png', alt: 'Card back 2' },
      ],
    })

    // Hide scroll indicator once user starts scrolling
    const indicator = document.getElementById('scrollIndicator')
    if (indicator) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          indicator.classList.add('hidden-indicator')
        }
      }, { passive: true, once: true })
    }
  }
})
