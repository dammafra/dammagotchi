export function createDoubleTapPreventer(timeout) {
  let dblTapTimer = 0
  let dblTapPressed = false

  return function (e) {
    clearTimeout(dblTapTimer)
    if (dblTapPressed) {
      e.preventDefault()
      dblTapPressed = false
    } else {
      dblTapPressed = true
      dblTapTimer = setTimeout(() => {
        dblTapPressed = false
      }, timeout)
    }
  }
}
