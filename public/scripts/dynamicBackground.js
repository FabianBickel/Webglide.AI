const circles = document.getElementsByClassName("circle");
const body = document.getElementsByTagName("body")[0];

const bodyWidth = body.offsetWidth;
const bodyHeight = body.offsetHeight;

const MIN_ANIMATION_DURATION = 500;
const MAX_ANIMATION_DURATION = 1000;

colorCircles(circles);

for (const circle of circles) {
      const circleWidth = circle.offsetWidth;
      const circleHeight = circle.offsetHeight;
      
      const circleWidthPercent = circleWidth / bodyWidth * 100;
      const circleHeightPercent = circleHeight / bodyHeight * 100;

      const randomFactorX = Math.random() * 50
      const randomFactorY = Math.random() * 50;

      const randomOffsetX = randomFactorX + 25  - circleWidthPercent / 2;
      const randomOffsetY = randomFactorY + 25  - circleHeightPercent / 2;

      console.log(randomOffsetX, randomOffsetY);

      circle.style.left = randomOffsetX + "%";
      circle.style.top = randomOffsetY + "%";

      // Min and max speed in pixels per second
      const minSpeed = 10;
      const maxSpeed = 100;

}

startShiftCircles(circles, minSpeed, maxSpeed);

function startShiftCircles(circles, minSpeed, maxSpeed) {
      let circleSpeeds = [];
  
      for (let i = 0; i < circles.length; i++) {
          circleSpeeds.push({
              x: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed,  // Random initial direction
              y: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed
          });
      }
  
      let lastTimestamp = performance.now();
  
      function updateCirclePosition(timestamp) {
          const deltaTime = timestamp - lastTimestamp;
          lastTimestamp = timestamp;
  
          for (let i = 0; i < circles.length; i++) {
              const circle = circles[i];
              const speed = circleSpeeds[i];
  
              // Update speed
              speed.x += (Math.random() - 0.5) * 20;
              speed.y += (Math.random() - 0.5) * 20;
  
              // Clamp the speed
              speed.x = Math.min(Math.max(speed.x, -maxSpeed), maxSpeed);  // Negative values allow backward movement
              speed.y = Math.min(Math.max(speed.y, -maxSpeed), maxSpeed);
  
              // Get the current position in pixels
              const bodyWidth = document.body.offsetWidth;
              const bodyHeight = document.body.offsetHeight;
  
              const currentX = (parseFloat(circle.style.left || '0%') / 100) * bodyWidth;
              const currentY = (parseFloat(circle.style.top || '0%') / 100) * bodyHeight;
  
              // Update position
              const newX = currentX + speed.x * (deltaTime / 1000);
              const newY = currentY + speed.y * (deltaTime / 1000);
  
              // Convert back to percentage for styling
              circle.style.left = (newX / bodyWidth) * 100 + "%";
              circle.style.top = (newY / bodyHeight) * 100 + "%";
          }
  
          requestAnimationFrame(updateCirclePosition);
      }
  
      requestAnimationFrame(updateCirclePosition);
  }
  
  
  

function colorCircles(circles) {
      const circleCount = circles.length;

      const what = 128 + 256;
      const step = what / (circleCount - 1);

      for (let i = 0; i < circleCount; i++) {
            const current = step * i;

            const some = 127 + current;

            const red = Math.min(255, some);
            const blue = Math.max(255 - (some - red), 127);

            circles[i].style.backgroundColor = `rgb(${red}, 0, ${blue})`;
      }
}