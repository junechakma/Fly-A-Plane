/**
 * Main Game Initialization
 * Initializes the game and sets up event listeners
 */

// Initialize the game
function init(event) {
  // Initialize UI elements
  fieldDistance = document.getElementById("distValue");
  energyBar = document.getElementById("energyBar");
  replayMessage = document.getElementById("replayMessage");
  fieldLevel = document.getElementById("levelValue");
  levelCircle = document.getElementById("levelCircleStroke");
  
  // Reset game state
  resetGame();
  
  // Create scene and lights
  createScene();
  createLights();
  
  // Create game objects
  createPlane();
  createSea();
  createSky();
  createCoins();
  createEnnemies();
  createParticles();

  // Add instructions for mobile
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    const instructions = document.getElementById("instructions");
    instructions.innerHTML = "Swipe to control the plane<span>avoid the red ones</span>";
  }

  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('mouseup', handleMouseUp, false);
  document.addEventListener('touchend', handleTouchEnd, false);
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('keydown', handleKeyDown, false);
  document.addEventListener('keyup', handleKeyUp, false);
  
  // Start the game loop
  loop();
}

// Initialize the game when the window loads
window.addEventListener('load', init, false);
