export default class View {
  #btnInit = document.querySelector('#init')
  #statusEl = document.querySelector('#status')
  #videoFrameCanvas = document.createElement('canvas')
  #canvasFrameCtx = this.#videoFrameCanvas.getContext('2d', { willReadFrequently: true })
  #videoEl = document.querySelector('#video')

  enableButton() {
    this.#btnInit.disabled = false
  }

  configureOnBtnClick(fn) {
    this.#btnInit.addEventListener('click', fn)
  }

  getVideoFrame(video) {
    const canvas = this.#videoFrameCanvas
    const [width, height] = [video.videoWidth, video.videoHeight]
    canvas.width = width
    canvas.height = height

    this.#canvasFrameCtx.drawImage(video, 0, 0, width, height)
    return this.#canvasFrameCtx.getImageData(0, 0, width, height)
  }

  togglePlayVideo() {
    if (this.#videoEl.paused) {
      this.#videoEl.play()
      return
    }

    this.#videoEl.pause()
  }

  log(text) {
    this.#statusEl.innerHTML = text
  }
}