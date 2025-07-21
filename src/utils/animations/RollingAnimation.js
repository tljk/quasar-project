export const rollingKeyframes = [
  { transform: "translateX(-100px) rotate(0turn)" },
  { transform: "translateX(100px) rotate(1.3turn)" },
];

export const rollingOptions = {
  duration: 2000,
  direction: "alternate",
  easing: "ease-in-out",
  iterations: "Infinity",
};

export class RollingAnimation extends KeyframeEffect {
  constructor({ target, composite = "replace" }) {
    super(target, rollingKeyframes, rollingOptions);
    this.composite = composite;
  }
}
