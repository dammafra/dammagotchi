import html2canvas from 'html2canvas-pro'
import { CanvasTexture } from 'three'

export default class HTMLTexture {
  /** @type {Map<string, CanvasTexture>} */
  static textures = new Map()

  static async from(element, useCache = true, download = false) {
    const hash = HTMLTexture.getHash(element)

    const existing = HTMLTexture.textures.get(hash)
    if (useCache && existing) return existing

    const texture = await html2canvas(element, {
      ignoreElements: el =>
        el.nodeName !== 'BODY' &&
        el.nodeName !== 'HEAD' &&
        el.id !== 'html2canvas' &&
        !el.closest('#html2canvas') &&
        !el.href?.includes('.css'),
      backgroundColor: null,
    })
      .then(canvas => {
        if (!download) return canvas

        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = 'screenshot.png'
        link.click()

        return canvas
      })
      .then(canvas => new CanvasTexture(canvas))

    HTMLTexture.textures.set(hash, texture)

    return texture
  }

  static getHash(element) {
    const text = element.outerHTML

    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) % 0xffffffff
    }

    return hash.toString(36)
  }
}
