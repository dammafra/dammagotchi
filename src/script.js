import { createDoubleTapPreventer } from '@utils/double-tap-preventer'
import { inject } from '@vercel/analytics'
import Experience from './experience/experience'

inject()

const v = '1.3'
if (v !== localStorage.getItem('version')) {
  localStorage.removeItem('life')
  localStorage.removeItem('stats')
}
localStorage.setItem('version', v)

Experience.init(document.querySelector('canvas.webgl'))
document.querySelectorAll('.fab').forEach(b => b.addEventListener('focus', e => e.target.blur()))

const isMobile = () => /Mobi|Android|iPhone|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)

const fullscreenButton = document.getElementById('fullscreen')
fullscreenButton.addEventListener('click', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }

  if (isMobile()) document.body.classList.toggle('fullscreen')
  fullscreenButton.firstElementChild.classList.toggle('fa-compress')
  fullscreenButton.firstElementChild.classList.toggle('fa-expand')
})

document.addEventListener('fullscreenchange', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (fullscreenElement) {
    fullscreenButton.firstElementChild.classList.add('fa-compress')
    fullscreenButton.firstElementChild.classList.remove('fa-expand')
  } else {
    fullscreenButton.firstElementChild.classList.remove('fa-compress')
    fullscreenButton.firstElementChild.classList.add('fa-expand')
  }
})

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

if (isStandalone()) {
  if (isMobile()) document.body.classList.add('fullscreen')
  fullscreenButton.remove()
}

const hasFullScreen = () =>
  document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen

if (!hasFullScreen()) {
  fullscreenButton.remove()
}

document.body.addEventListener('touchstart', createDoubleTapPreventer(500), { passive: false })
