export default class Random {
  static oneOf(first, second) {
    return Math.random() - 0.5 > 0 ? first : second
  }

  static boolean() {
    return Math.random() - 0.5 > 0
  }
}
