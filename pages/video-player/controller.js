export default class Controller {
  #view
  #service

  constructor({ view, service }) {
    this.#view = view
    this.#service = service

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('No blink detected.')
    return controller.init()
  }

  async init() {
    console.log('Controller initialized')
  }

  log(text) {
    this.#view.log(`Logger: ${text}`)
  }

  onBtnStart() {
    this.log('Initializing detection...')
  }
}