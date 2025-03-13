/**
 * Input Handler
 * Manages mouse, touch, and keyboard inputs
 */

// Input variables
let mousePos = { x: 0, y: 0 };
let keyboardControls = { up: false, down: false, left: false, right: false };

// Mouse movement handler
function handleMouseMove(event) {
  const tx = -1 + (event.clientX / WIDTH) * 2;
  const ty = 1 - (event.clientY / HEIGHT) * 2;
  mousePos = { x: tx, y: ty };
}

// Touch movement handler
function handleTouchMove(event) {
  event.preventDefault();
  const tx = -1 + (event.touches[0].pageX / WIDTH) * 2;
  const ty = 1 - (event.touches[0].pageY / HEIGHT) * 2;
  mousePos = { x: tx, y: ty };
}

// Mouse click handler
function handleMouseUp(event) {
  if (game.status == "waitingReplay") {
    resetGame();
    hideReplay();
  }
}

// Touch end handler
function handleTouchEnd(event) {
  if (game.status == "waitingReplay") {
    resetGame();
    hideReplay();
  }
}

// Touch start handler
function handleTouchStart(event) {
  if (game.status == "waitingReplay") {
    resetGame();
    hideReplay();
  }
}

// Keyboard key down handler
function handleKeyDown(event) {
  switch(event.key) {
    case 'ArrowUp':
    case 'w':
      keyboardControls.up = true;
      break;
    case 'ArrowDown':
    case 's':
      keyboardControls.down = true;
      break;
    case 'ArrowLeft':
    case 'a':
      keyboardControls.left = true;
      break;
    case 'ArrowRight':
    case 'd':
      keyboardControls.right = true;
      break;
  }
}

// Keyboard key up handler
function handleKeyUp(event) {
  switch(event.key) {
    case 'ArrowUp':
    case 'w':
      keyboardControls.up = false;
      break;
    case 'ArrowDown':
    case 's':
      keyboardControls.down = false;
      break;
    case 'ArrowLeft':
    case 'a':
      keyboardControls.left = false;
      break;
    case 'ArrowRight':
    case 'd':
      keyboardControls.right = false;
      break;
  }
}

// Update mouse position from keyboard input
function updateMousePosFromKeyboard() {
  // Calculate movement based on keyboard input
  let targetX = mousePos.x;
  let targetY = mousePos.y;
  
  const moveStep = 0.02;
  
  if (keyboardControls.left) targetX -= moveStep;
  if (keyboardControls.right) targetX += moveStep;
  if (keyboardControls.up) targetY += moveStep;
  if (keyboardControls.down) targetY -= moveStep;
  
  // Clamp values to valid range
  targetX = Math.max(-1, Math.min(1, targetX));
  targetY = Math.max(-1, Math.min(1, targetY));
  
  // Update mouse position if keys are pressed
  if (keyboardControls.left || keyboardControls.right || keyboardControls.up || keyboardControls.down) {
    mousePos = { x: targetX, y: targetY };
  }
}
