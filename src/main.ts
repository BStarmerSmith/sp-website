import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Active nav link highlighting
  const currentPath = window.location.pathname
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a')

  navLinks.forEach(link => {
    const href = link.getAttribute('href')
    if (href === currentPath ||
        (currentPath === '/' && href === '/') ||
        (currentPath.endsWith('index.html') && href === '/')) {
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
})
