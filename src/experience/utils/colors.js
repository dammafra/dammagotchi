export function rgbToHex(rgb) {
  const { r, g, b } = rgb
  const hex = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`
  return hex
}

export function hexToRgb(hex) {
  hex = hex.replace('#', '')

  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  return { r, g, b }
}

export function colorDistance(color1, color2) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2),
  )

  return distance
}

export function areColorsNear(color1, color2, threshold = 25) {
  const distance = colorDistance(color1, color2)
  return distance < threshold
}

export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`
}
