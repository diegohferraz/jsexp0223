export default class View {
  #btnInit = document.querySelector('#init')
  #statusEl = document.querySelector('#status')

  enableButton() {
    this.#btnInit.disabled = false
  }

  configureOnBtnClick(fn) {
    this.#btnInit.addEventListener('click', fn)
  }

  log(text) {
    this.#statusEl.innerHTML = text
  }
}