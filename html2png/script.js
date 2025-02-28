import html2canvas from 'html2canvas-pro'
import { Pane } from 'tweakpane'

async function html2png(element) {
  const canvas = await html2canvas(element, {
    onclone: (_, el) => (el.style.backgroundColor = 'transparent'),
    backgroundColor: null,
  })

  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `${element.id}.png`
  link.click()
}

const pane = new Pane({})
pane.element.parentElement.style.top = 'unset'
pane.element.parentElement.style.bottom = '16px'

document.querySelectorAll('body main > div').forEach(element => {
  const button = pane.addButton({ title: `⬇️ ${element.id}` }).on('click', () => html2png(element))

  button.element.addEventListener('mouseenter', () => (element.style.transform = 'scale(1.1)'))
  button.element.addEventListener('mouseleave', () => (element.style.transform = 'scale(1)'))
})
