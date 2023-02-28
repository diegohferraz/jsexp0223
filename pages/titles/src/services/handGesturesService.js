import { knownGestures, gesturesStrings } from "../util/gestures.js"

export default class HandGesturesService {
  #gestureEstimator
  #fingerpose
  #handPoseDetection
  #handsVersion
  #detector = null

  constructor({ fingerpose, handPoseDetection, handsVersion }) {
    this.#gestureEstimator = new fingerpose.GestureEstimator(knownGestures)
    this.#fingerpose = fingerpose
    this.#handPoseDetection = handPoseDetection
    this.#handsVersion = handsVersion
  }

  async estimate(keypoints3D) {
    const predictions = await this.#gestureEstimator.estimate(
      this.#getLandmarksFromKeypoints(keypoints3D),
      9
    )

    return predictions.gestures
  }

  async * detectGestures(predictions) {
    for (const hand of predictions) {
      if (!hand.keypoints3D) continue

      const gestures = await this.estimate(hand.keypoints3D)
      if (!gestures.length) continue

      const result = gestures.reduce(
        (prev, curr) => (prev.score > curr.score) ? prev : curr
      )
      
      const {x, y} = hand.keypoints.find(keypoint => keypoint.name === 'index_finger_tip')
      yield {event: result.name, x, y}
    }
  }

  #getLandmarksFromKeypoints(keypoints3D) {
    return keypoints3D.map(keypoint => [keypoint.x, keypoint.y, keypoint.z])
  }

  async estimateHands(video) {
    return this.#detector.estimateHands(
      video,
      { flipHorizontal: true }
    )
  }

  async initializeDetector() {
    if (this.#detector) return this.#detector

    const detectorConfig = {
      runtime: 'mediapipe',
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
      modelType: 'lite',
      maxHands: 2
    }

    this.#detector = await this.#handPoseDetection.createDetector(
      this.#handPoseDetection.SupportedModels.MediaPipeHands,
      detectorConfig
    )

    return this.#detector
  }
}