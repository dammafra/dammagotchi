export default class Loading {
  constructor() {
    this.element = document.querySelector('.loading')
  }

  ready() {
    this.element.classList.add('end')
  }
}
