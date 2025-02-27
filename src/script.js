import { createDoubleTapPreventer } from '@utils/double-tap-preventer'
import Experience from './experience/experience'

const v = '1.0'
if (v !== localStorage.getItem('version')) {
  localStorage.removeItem('life')
  localStorage.removeItem('stats')
  localStorage.removeItem('tab-pulled')
}
localStorage.setItem('version', v)

Experience.init(document.querySelector('canvas.webgl'))
document.querySelectorAll('.fab').forEach(b => b.addEventListener('focus', e => e.target.blur()))

const isMobile = () => /Mobi|Android|iPhone|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)

const fullScreenButton = document.getElementById('fullscreen')
fullScreenButton.addEventListener('click', () => {
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
  fullScreenButton.firstElementChild.classList.toggle('fa-compress')
  fullScreenButton.firstElementChild.classList.toggle('fa-expand')
})

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

if (isStandalone()) {
  if (isMobile()) document.body.classList.add('fullscreen')
  fullScreenButton.remove()
}

const hasFullScreen = () =>
  document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen

if (!hasFullScreen()) {
  fullScreenButton.remove()
}

document.body.addEventListener('touchstart', createDoubleTapPreventer(500), { passive: false })
