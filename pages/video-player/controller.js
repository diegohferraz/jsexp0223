export default class Controller {
  #view
  #worker
  #camera
  #blinkCounter = 0

  constructor({ view, worker, camera }) {
    this.#view = view
    this.#worker = this.#configureWorker(worker)
    this.#camera = camera
    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('No blink detected.')
    return controller.init()
  }

  #configureWorker(worker) {
    let ready = false
    worker.onmessage = ({ data }) => {
      if ('READY' === data) {
        console.log('worker is ready...')
        this.#view.enableButton()
        ready = true
        return
      }

      const blinked = data.blinked
      this.#blinkCounter += blinked
      this.#view.togglePlayVideo()
      console.log('blinked', blinked)
    }

    return {
      send(msg) {
        if (!ready) return
        worker.postMessage(msg)
      }
    }
  }

  async init() {
    console.log('Controller initialized')
  }

  loop() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)

    this.#worker.send(img)

    setTimeout(() => this.loop(), 100)
  }

  log(text) {
    const times = `         - blinked times: ${this.#blinkCounter}`
    this.#view.log(`Status: ${text}`.concat(this.#blinkCounter ? times : ''))
  }

  onBtnStart() {
    this.log('Initializing detection...')
    this.#blinkCounter = 0
    this.loop()
  }
}