export default class HandGesturesView {
  #handsCanvas = document.querySelector('#hands')
  #canvasContext = this.#handsCanvas.getContext('2d')
  #fingerLookpIdx

  constructor({ fingerLookpIdx }) {
    this.#handsCanvas.width = globalThis.screen.availWidth
    this.#handsCanvas.height = globalThis.screen.availHeight
    this.#fingerLookpIdx = fingerLookpIdx
  }

  clear() {
    this.#canvasContext.clearRect(0, 0, this.#handsCanvas.width, this.#handsCanvas.height)
  }

  drawResults(hands) {
    for (const { keypoints, handedness } of hands) {
      if (!keypoints) continue

      this.#canvasContext.fillStyle = handedness === "Left" ? 'red' : 'green'
      this.#canvasContext.strokeStyle = 'white'
      this.#canvasContext.lineWidth = 8
      this.#canvasContext.lineJoin = 'round'

      this.#drawJoints(keypoints)
      this.#drawFingersAndHoverElements(keypoints)
    }
  }

  clickOnElement(x, y) {
    const element = document.elementFromPoint(x, y)
    if (!element) return

    const rect = element.getBoundingClientRect()
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: rect.left + x,
      clientY: rect.top + y
    })

    element.dispatchEvent(event)
    console.log(element, x, y)
  }

  #drawJoints(keypoints) {
    for (const { x, y } of keypoints) {
      this.#canvasContext.beginPath()

      const radius = 3
      const startAngle = 0
      const endAngle = Math.PI

      this.#canvasContext.arc(x - 2, y - 2, radius, startAngle, endAngle)
      this.#canvasContext.fill()
    }
  }

  #drawFingersAndHoverElements(keypoints) {
    const fingers = Object.keys(this.#fingerLookpIdx)

    for (const finger of fingers) {
      const points = this.#fingerLookpIdx[finger].map(
        index => keypoints[index]
      )

      const region = new Path2D()
      const [{ x, y }] = points
      region.moveTo(x, y)

      for (const point of points) {
        region.lineTo(point.x, point.y)
      }

      this.#canvasContext.stroke(region)
    }
  }

  loop(fn) {
    requestAnimationFrame(fn)
  }

  scrollPage(top) {
    scroll({
      top,
      behavior: 'smooth'
    })
  }
} 