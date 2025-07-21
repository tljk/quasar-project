export class PinchRecognizer {
  constructor({}) {
    this.pinchState = new Map();
  }

  addPinchState(touchId, point1, point2) {
    const initialDistance = Math.sqrt(
      Math.pow(point2.currentX - point1.currentX, 2) +
        Math.pow(point2.currentY - point1.currentY, 2)
    );
    const initialCenter = {
      x: (point1.currentX + point2.currentX) / 2,
      y: (point1.currentY + point2.currentY) / 2,
    };
    this.pinchState.set(touchId, {
      point1,
      point2,
      isPinching: false,
      initialDistance: initialDistance,
      currentDistance: initialDistance,
      initialCenter: initialCenter,
      currentCenter: initialCenter,
      duration: 0,
      distance: 0,
      distanceX: 0,
      distanceY: 0,
      velocity: 0,
      velocityX: 0,
      velocityY: 0,
      scale: 1,
    });
  }

  removePinchState(touchId) {
    this.pinchState.delete(touchId);
  }

  getPinchState(touchId) {
    return this.pinchState.get(touchId);
  }

  setPinchState(touchId, point1, point2) {
    const state = this.getPinchState(touchId);
    if (state) {
      const previousDistance = state.currentDistance;
      state.currentDistance = Math.sqrt(
        Math.pow(point2.currentX - point1.currentX, 2) +
          Math.pow(point2.currentY - point1.currentY, 2)
      );
      state.currentCenter = {
        x: (point1.currentX + point2.currentX) / 2,
        y: (point1.currentY + point2.currentY) / 2,
      };
      state.duration = Date.now() - point1.startTime;
      state.distance = Math.sqrt(
        Math.pow(state.currentCenter.x - state.initialCenter.x, 2) +
          Math.pow(state.currentCenter.y - state.initialCenter.y, 2)
      );
      state.distanceX = state.initialCenter.x - state.currentCenter.x;
      state.distanceY = state.initialCenter.y - state.currentCenter.y;
      state.velocity = state.distance / state.duration;
      state.velocityX = state.distanceX / state.duration;
      state.velocityY = state.distanceY / state.duration;
      state.scale = state.currentDistance / previousDistance;
    }

    return state;
  }

  recognize(gestureData) {
    const { phase, touchPoints, touchCount } = gestureData;

    if (touchCount !== 2) {
      return { recognized: false, phase: phase };
    }

    const [point1, point2] = touchPoints;
    const touchId = `${point1.startX}-${point1.startY}-${point2.startX}-${point2.startY}-${point1.startTime}`;

    switch (phase) {
      case "start":
        this.addPinchState(touchId, point1, point2);
        return { recognized: false, phase: phase };

      case "move":
        const state = this.setPinchState(touchId, point1, point2);
        if (state) {
          if (!state.isPinching && (state.scale !== 1 || state.distance > 0)) {
            state.isPinching = true;
          }

          if (state.isPinching) {
            return { recognized: true, phase: phase, state: state };
          }
        } else {
          this.addPinchState(touchId, point1, point2);
        }

        return { recognized: false, phase: phase };

      case "end":
        const endState = this.getPinchState(touchId);
        if (endState) {
          this.pinchState.delete(touchId);
          endState.isPinching = false;
          return { recognized: true, phase: phase, state: endState };
        }

        return { recognized: false, phase: phase };

      case "default":
        return { recognized: false, phase: phase };
    }
  }
}
