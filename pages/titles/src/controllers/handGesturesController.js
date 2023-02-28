import { prepareRunChecker } from "../../../../lib/shared/utils.js"

const { shouldRun: scrollShoulRun } = prepareRunChecker({ timeDelay: 500 })
export default class HandGesturesController {
  #view
  #service
  #camera
  #lastDirection = {
    direction: '',
    y: 0
  }

  constructor({ view, service, camera }) {
    this.#view = view
    this.#service = service
    this.#camera = camera
  }

  async init() {
    return this.#loop()
  }

  #scrollPage(direction) {
    const pixelsPerScroll = 100
    if (this.#lastDirection.direction === direction) {
      this.#lastDirection.y = (
        direction === 'scroll-down'
          ? this.#lastDirection.y + pixelsPerScroll
          : this.#lastDirection.y - pixelsPerScroll
      )
    } else {
      this.#lastDirection.direction = direction
    }

    this.#view.scrollPage(this.#lastDirection.y)
  }

  async #estimateHands(video) {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video)
      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        if (event.includes('scroll')) {
          if (!scrollShoulRun()) continue
          this.#scrollPage(event)
        }
      }
    } catch (error) {
      console.error('Error trying to estimate hands.', error)
    }
  }

  async #loop() {
    await this.#service.initializeDetector()
    await this.#estimateHands()
    this.#view.loop(this.#loop.bind(this))
  }

  static async initialize(deps) {
    const controller = new HandGesturesController(deps)
    return controller.init()
  }
}