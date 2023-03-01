const { GestureDescription, Finger, FingerCurl } = window.fp

const ScrollDownGesture = new GestureDescription('scroll-down'); // ✊️
const ScrollUpGesture = new GestureDescription('scroll-up'); // 🖐
const ClickGesture = new GestureDescription('click'); // 🤏


// Scroll down
// -----------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ScrollDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}


// Scroll up
// -----------------------------------------------------------------------------

// no finger should be curled
for (let finger of Finger.all) {
  ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Click
// -----------------------------------------------------------------------------

// no finger should be curled
for (let finger of Finger.all) {
  ClickGesture.addCurl(finger.Index, FingerCurl.HalfCurl, 0.8);
  ClickGesture.addCurl(finger.Index, FingerCurl.FullCurl, 0.5);

  ClickGesture.addCurl(finger.Thumb, FingerCurl.NoCurl, 1.0);
  ClickGesture.addCurl(finger.Thumb, FingerCurl.HalfCurl, 0.4);

  ClickGesture.addCurl(finger.Middle, FingerCurl.HalfCurl, 1.0);
  ClickGesture.addCurl(finger.Middle, FingerCurl.FullCurl, 0.9);

  ClickGesture.addCurl(finger.Ring, FingerCurl.HalfCurl, 1.0);
  ClickGesture.addCurl(finger.Ring, FingerCurl.FullCurl, 0.9);

  ClickGesture.addCurl(finger.Pinky, FingerCurl.HalfCurl, 1.0);
  ClickGesture.addCurl(finger.Pinky, FingerCurl.FullCurl, 0.9);
}

const knownGestures = [
  ScrollDownGesture, ScrollUpGesture, ClickGesture
]

const gesturesStrings = {
  'scroll-up': '🖐',
  'scroll-down': '✊️',
  'click': '🤏'
}

export {
  knownGestures, gesturesStrings
}