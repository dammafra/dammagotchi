export default class Random {
  static oneOf(first, second) {
    return Math.random() - 0.5 > 0 ? first : second
  }

  static boolean() {
    return Math.random() - 0.5 > 0
  }

  static fromArray(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  static color() {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`
  }

  static runOneIn(callback, chance) {
    Math.random() < 1 / chance && callback && callback()
  }

  static number(min, max, precision = 2) {
    const factor = Math.pow(10, precision)
    return Math.round((Math.random() * (max - min) + min) * factor) / factor
  }
}
