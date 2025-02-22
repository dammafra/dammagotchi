import html2canvas from 'html2canvas-pro'

export async function getCanvasFrom(node) {
  return html2canvas(node, {
    ignoreElements: el =>
      el.nodeName !== 'BODY' &&
      el.nodeName !== 'HEAD' &&
      el.id !== 'html2canvas' &&
      !el.closest('#html2canvas') &&
      !el.href?.includes('.css'),
    backgroundColor: null,
  })
}
