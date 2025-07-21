export function useGestures(element) {
  const recognizers = new Map();
  const touchPoints = new Map();

  const registerGesture = (name, recognizer) => {
    recognizers.set(name, recognizer);
  };

  const emitGesture = (name, result) => {
    if (!element) return;
    const gestureEvent = new CustomEvent(`gesture:${name}`, {
      detail: {
        name,
        ...result,
      },
      bubbles: true,
      cancelable: true,
    });

    element.dispatchEvent(gestureEvent);
  };

  const recognizeGestures = (phase, event) => {
    const gestureData = {
      phase,
      event,
      touchPoints: Array.from(touchPoints.values()),
      touchCount: touchPoints.size,
    };

    for (const [name, recognizer] of recognizers) {
      const result = recognizer.recognize(gestureData);
      emitGesture(name, result);
    }
  };

  const handleTouchStart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const touch of event.changedTouches) {
      touchPoints.set(touch.identifier, {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
        startTime: Date.now(),
        target: event.target,
      });
    }

    recognizeGestures("start", event);
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const touch of event.changedTouches) {
      const point = touchPoints.get(touch.identifier);
      if (point) {
        point.deltaX = touch.clientX - point.currentX;
        point.deltaY = touch.clientY - point.currentY;
        point.currentX = touch.clientX;
        point.currentY = touch.clientY;
      }
    }

    recognizeGestures("move", event);
  };

  const handleTouchEnd = (event) => {
    event.preventDefault();
    event.stopPropagation();

    recognizeGestures("end", event);

    for (const touch of event.changedTouches) {
      touchPoints.delete(touch.identifier);
    }
  };

  const addEventListeners = () => {
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    element.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });
  };

  const removeEventListeners = () => {
    if (!element) return;

    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchmove", handleTouchMove);
    element.removeEventListener("touchend", handleTouchEnd);
  };

  return {
    registerGesture,
    addEventListeners,
    removeEventListeners,
  };
}
