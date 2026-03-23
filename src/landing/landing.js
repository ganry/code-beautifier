import './landing.css'

// Scroll-triggered fade-in animations
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-in')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

  elements.forEach((el) => observer.observe(el))
}

// Mouse-following gradient glow on hero
function initHeroGlow() {
  const hero = document.querySelector('.hero')
  if (!hero) return

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    hero.style.setProperty('--mouse-x', `${x}%`)
    hero.style.setProperty('--mouse-y', `${y}%`)
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
  initScrollAnimations()
  initHeroGlow()
  initSmoothScroll()
})
