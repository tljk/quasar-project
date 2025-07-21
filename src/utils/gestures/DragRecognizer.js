export class DragRecognizer {
  constructor({}) {
    this.dragState = new Map();
  }

  addDragState(touchId, point) {
    this.dragState.set(touchId, {
      point,
      isDragging: false,
      duration: 0,
      distance: 0,
      distanceX: 0,
      distanceY: 0,
      velocity: 0,
      velocityX: 0,
      velocityY: 0,
    });
  }

  removeDragState(touchId) {
    this.dragState.delete(touchId);
  }

  getDragState(touchId) {
    return this.dragState.get(touchId);
  }

  setDragState(touchId, point) {
    const state = this.getDragState(touchId);
    if (state) {
      state.duration = Date.now() - state.point.startTime;
      state.distance = Math.sqrt(
        Math.pow(point.currentX - state.point.startX, 2) +
          Math.pow(point.currentY - state.point.startY, 2)
      );
      state.distanceX = state.point.startX - point.currentX;
      state.distanceY = state.point.startY - point.currentY;
      state.velocity = state.distance / state.duration;
      state.velocityX = state.distanceX / state.duration;
      state.velocityY = state.distanceY / state.duration;
    }

    return state;
  }

  recognize(gestureData) {
    const { phase, touchPoints, touchCount } = gestureData;

    if (touchCount !== 1) {
      return { recognized: false, start: phase };
    }

    const point = touchPoints[0];
    const touchId = `${point.startX}-${point.startY}-${point.startTime}`;

    switch (phase) {
      case "start":
        this.addDragState(touchId, point);
        return { recognized: false, phase: phase };

      case "move":
        const state = this.setDragState(touchId, point);
        if (state) {
          if (!state.isDragging && state.distance > 0) {
            state.isDragging = true;
          }

          if (state.isDragging) {
            return { recognized: true, phase: phase, state: state };
          }
        } else {
          this.addDragState(touchId, point);
        }

        return { recognized: false, phase: phase };

      case "end":
        const endState = this.getDragState(touchId);
        if (endState) {
          this.dragState.delete(touchId);
          endState.isDragging = false;
          return { recognized: true, phase: phase, state: endState };
        }

        return { recognized: false, phase: phase };

      default:
        return { recognized: false, phase: phase };
    }
  }
}
