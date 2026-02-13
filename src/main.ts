import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a')
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href')
    if (href === currentPath || 
        (currentPath === '/' && href === '/') ||
        (currentPath.endsWith('index.html') && href === '/')) {
      link.classList.add('nav-link-active')
      link.classList.remove('nav-link')
    }
  })
})
