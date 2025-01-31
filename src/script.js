import Experience from './experience/experience'

// TODO: refactor ---
const canvas = document.querySelector('canvas.webgl')
const frame = document.querySelector('.frame path')

function resize() {
  const { width, height } = frame.getBoundingClientRect()

  canvas.style.width = `${width * 0.8}px`
  canvas.style.height = `${height * 0.8}px`
}

resize()
addEventListener('resize', resize)
// ---

Experience.init(canvas)
