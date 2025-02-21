import Experience from './experience/experience'

Experience.init(document.querySelector('canvas.webgl'))
document.querySelectorAll('.fab').forEach(b => b.addEventListener('focus', e => e.target.blur()))

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

if (isStandalone()) {
  document.body.classList.add('standalone')
}
