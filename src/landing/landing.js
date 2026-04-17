import './landing.css'

// Nav scroll effect — transparent to blurred on scroll
function initNavScroll() {
  const nav = document.getElementById('nav')
  if (!nav) return
  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40)
        ticking = false
      })
      ticking = true
    }
  }, { passive: true })
}

// Scroll-triggered reveal animations
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.06, rootMargin: '-20px' })

  elements.forEach((el) => observer.observe(el))

  // Check on load for already-visible elements
  requestAnimationFrame(() => {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible')
        observer.unobserve(el)
      }
    })
  })
}

// Global mouse-following gradient
function initGlobalGradient() {
  const gradient = document.getElementById('bgGradient')
  if (!gradient) return

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth * 100).toFixed(1)
    const y = (e.clientY / window.innerHeight * 100).toFixed(1)
    gradient.style.setProperty('--mx', x + '%')
    gradient.style.setProperty('--my', y + '%')
  })
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector(a.getAttribute('href'))
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll()
  initScrollAnimations()
  initGlobalGradient()
  initSmoothScroll()
})
