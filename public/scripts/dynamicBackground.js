const MIN_ANIMATION_DURATION = 500;
const MAX_ANIMATION_DURATION = 1000;

const AREA_SIZE_PERCENT = 90;
const CIRCLE_SIZE_PERCENT = 20;
const CIRCLE_OPACITY = 50;
const CIRCLE_COUNT = 8;

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

      const circles = spawnCircles();
      resetCirclePositions(circles);
      colorCircles(circles);
      startShiftCircles(circles);
});

function spawnCircles() {

      const circleContainer = document.getElementById("dynamicBackground");
      const circles = [];

      for (let i = 0; i < CIRCLE_COUNT; i++) {
            const circle = document.createElement("div");
            circle.style.height = `${CIRCLE_SIZE_PERCENT}%`;
            circle.style.width = `${CIRCLE_SIZE_PERCENT}%`;
            circle.style.opacity = `${CIRCLE_OPACITY / 100}`;
            circle.style.position = "absolute";
            circleContainer.appendChild(circle);
            circles.push(circle);
      }

      return circles;
}

function resetCirclePositions(circles) {
      for (const circle of circles) {

            if (!circle) continue;

            const { x, y } = getRandomValidPositionPercent();

            circle.style.left = `${x}%`;
            circle.style.top = `${y}%`;
      }
}

function getRandomValidPositionPercent() {

      const circleCenterOffset = AREA_SIZE_PERCENT / 2 - CIRCLE_SIZE_PERCENT / 2;

      const randomAngle = Math.random() * 360;
      const randomDistance = Math.random() * circleCenterOffset;

      const offset = 50 - CIRCLE_SIZE_PERCENT / 2;

      const randomXPercent = offset + Math.cos(randomAngle) * randomDistance;
      const randomYPercent = offset + Math.sin(randomAngle) * randomDistance;

      return { x: randomXPercent, y: randomYPercent };
}

function colorCircles(circles) {
      const circleCount = circles.length;

      const total = 128 + 256 + 128;
      const step = total / (circleCount - 1);

      for (let i = 0; i < circleCount; i++) {
            const current = step * i;

            const green = Math.max(127 - current, 0);
            const redBase = Math.max(current - 128 + green, 0);
            const red = Math.min(redBase, 255);
            const blueBase = Math.max(current - 384, 0);
            const blue = 255 - blueBase;

            circles[i].style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
            console.log(`rgb(${red}, ${green}, ${blue})`);
      }
}

function startShiftCircles(circles) {
      let circleTargetMap = new Map();

      for (let i = 0; i < circles.length; i++) {
            circleTargetMap.set(circles[i], getRandomValidPositionPercent());
      }

      let lastTimestamp = performance.now();


}