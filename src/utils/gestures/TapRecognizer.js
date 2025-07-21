export class TapRecognizer {
  constructor({}) {
    this.tapState = new Map();
  }

  addTapState(touchId, point) {
    this.tapState.set(touchId, {
      point,
      duration: undefined,
      distance: undefined,
    });
  }

  removeTapState(touchId) {
    this.tapState.delete(touchId);
  }

  getTapState(touchId) {
    return this.tapState.get(touchId);
  }

  setTapState(touchId, point) {
    const state = this.getTapState(touchId);
    if (state) {
      state.duration = Date.now() - state.point.startTime;
      state.distance = Math.sqrt(
        Math.pow(point.currentX - state.point.startX, 2) +
          Math.pow(point.currentY - state.point.startY, 2)
      );
    }

    return state;
  }

  recognize(gestureData) {
    const { phase, touchPoints, touchCount } = gestureData;

    if (touchCount !== 1) {
      return { recognized: false, phase: phase };
    }

    const point = touchPoints[0];
    const touchId = `${point.startX}-${point.startY}-${point.startTime}`;

    switch (phase) {
      case "start":
        this.addTapState(touchId, point);
        return { recognized: false, phase: phase };

      case "end":
        const endState = this.setTapState(touchId, point);
        if (endState) {
          if (endState.duration < 300 && endState.distance < 10) {
            this.removeTapState(touchId);
            return { recognized: true, phase: phase, state: endState };
          }
        }

        this.removeTapState(touchId);
        return { recognized: false, phase: phase };

      default:
        return { recognized: false, phase: phase };
    }
  }
}
