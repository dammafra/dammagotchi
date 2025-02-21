import Experience from './experience/experience'

Experience.init(document.querySelector('canvas.webgl'))
document.querySelectorAll('.fab').forEach(b => b.addEventListener('focus', e => e.target.blur()))
