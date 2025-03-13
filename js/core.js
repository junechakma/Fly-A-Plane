/**
 * Core Game Engine
 * Handles game state, initialization, and core mechanics
 */

// Game variables
let game;
let deltaTime = 0;
let newTime = new Date().getTime();
let oldTime = new Date().getTime();

// Reset and initialize game state
function resetGame() {
  game = {
    speed: 0,
    initSpeed: GameConfig.initSpeed,
    baseSpeed: GameConfig.baseSpeed,
    targetBaseSpeed: GameConfig.targetBaseSpeed,
    incrementSpeedByTime: GameConfig.incrementSpeedByTime,
    incrementSpeedByLevel: GameConfig.incrementSpeedByLevel,
    distanceForSpeedUpdate: GameConfig.distanceForSpeedUpdate,
    speedLastUpdate: 0,

    distance: 0,
    ratioSpeedDistance: GameConfig.ratioSpeedDistance,
    energy: 100,
    ratioSpeedEnergy: GameConfig.ratioSpeedEnergy,

    level: 1,
    levelLastUpdate: 0,
    distanceForLevelUpdate: GameConfig.distanceForLevelUpdate,

    planeDefaultHeight: GameConfig.planeDefaultHeight,
    planeAmpHeight: GameConfig.planeAmpHeight,
    planeAmpWidth: GameConfig.planeAmpWidth,
    planeMoveSensivity: GameConfig.planeMoveSensivity,
    planeRotXSensivity: GameConfig.planeRotXSensivity,
    planeRotZSensivity: GameConfig.planeRotZSensivity,
    planeFallSpeed: GameConfig.planeFallSpeed,
    planeMinSpeed: GameConfig.planeMinSpeed,
    planeMaxSpeed: GameConfig.planeMaxSpeed,
    planeSpeed: 0,
    planeCollisionDisplacementX: 0,
    planeCollisionSpeedX: 0,
    planeCollisionDisplacementY: 0,
    planeCollisionSpeedY: 0,

    seaRadius: GameConfig.seaRadius,
    seaLength: GameConfig.seaLength,
    wavesMinAmp: GameConfig.wavesMinAmp,
    wavesMaxAmp: GameConfig.wavesMaxAmp,
    wavesMinSpeed: GameConfig.wavesMinSpeed,
    wavesMaxSpeed: GameConfig.wavesMaxSpeed,

    cameraFarPos: GameConfig.cameraFarPos,
    cameraNearPos: GameConfig.cameraNearPos,
    cameraSensivity: GameConfig.cameraSensivity,

    coinDistanceTolerance: GameConfig.coinDistanceTolerance,
    coinValue: GameConfig.coinValue,
    coinsSpeed: GameConfig.coinsSpeed,
    coinLastSpawn: 0,
    distanceForCoinsSpawn: GameConfig.distanceForCoinsSpawn,

    ennemyDistanceTolerance: GameConfig.ennemyDistanceTolerance,
    ennemyValue: GameConfig.ennemyValue,
    ennemiesSpeed: GameConfig.ennemiesSpeed,
    ennemyLastSpawn: 0,
    distanceForEnnemiesSpawn: GameConfig.distanceForEnnemiesSpawn,

    status: "playing",
  };
  
  // Update UI
  fieldLevel.innerHTML = Math.floor(game.level);
}

// Game loop
function loop() {
  newTime = new Date().getTime();
  deltaTime = newTime - oldTime;
  oldTime = newTime;

  if (game.status == "playing") {
    // Update game elements
    sea.mesh.rotation.z += game.speed * deltaTime;

    if (sea.mesh.rotation.z > 2 * Math.PI) {
      sea.mesh.rotation.z -= 2 * Math.PI;
    }

    // Update airplane
    updatePlane();

    // Update camera
    camera.fov = normalize(mousePos.x, -1, 1, 40, 80);
    camera.updateProjectionMatrix();

    // Update sea
    sea.moveWaves();

    // Update sky
    sky.moveClouds();

    // Update coins
    coinsHolder.rotateCoins();
    
    // Update enemies
    ennemiesHolder.rotateEnnemies();

    // Update distance, energy, etc.
    updateDistance();
    updateEnergy();

    // Spawn game elements
    coinsHolder.spawnCoins();
    ennemiesHolder.spawnEnnemies();
  } else if (game.status == "gameover") {
    // Game over state
  }

  // Schedule next frame
  requestAnimationFrame(loop);
  renderer.render(scene, camera);
}

// Utility function for normalization
function normalize(v, vmin, vmax, tmin, tmax) {
  const nv = Math.max(Math.min(v, vmax), vmin);
  const dv = vmax - vmin;
  const pc = (nv - vmin) / dv;
  const dt = tmax - tmin;
  const tv = tmin + (pc * dt);
  return tv;
}

// Update distance
function updateDistance() {
  game.distance += game.speed * deltaTime * game.ratioSpeedDistance;
  fieldDistance.innerHTML = Math.floor(game.distance);
  
  // Level up
  if (Math.floor(game.distance) % game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate) {
    game.levelLastUpdate = Math.floor(game.distance);
    game.level++;
    fieldLevel.innerHTML = Math.floor(game.level);
    
    // Update game speed
    game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel * game.level;
  }
  
  // Update speed
  if (Math.floor(game.distance) % game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate) {
    game.speedLastUpdate = Math.floor(game.distance);
    game.targetBaseSpeed += game.incrementSpeedByTime;
  }
  
  game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
  game.speed = game.baseSpeed * game.planeSpeed;
}

// Energy management
let blinkEnergy = false;

function updateEnergy() {
  game.energy -= game.speed * deltaTime * game.ratioSpeedEnergy;
  game.energy = Math.max(0, game.energy);
  energyBar.style.right = (100 - game.energy) + "%";
  energyBar.style.backgroundColor = (game.energy < 50) ? "#f25346" : "#68c3c0";
  
  if (game.energy < 30) {
    energyBar.style.animationName = "blinking";
    blinkEnergy = true;
  } else {
    energyBar.style.animationName = "none";
    blinkEnergy = false;
  }
  
  if (game.energy < 1) {
    game.status = "gameover";
    showReplay();
  }
}

function addEnergy() {
  game.energy += game.coinValue;
  game.energy = Math.min(game.energy, 100);
}

function removeEnergy() {
  game.energy -= game.ennemyValue;
  game.energy = Math.max(0, game.energy);
}

// Game over UI
function showReplay() {
  replayMessage.style.display = "block";
}

function hideReplay() {
  replayMessage.style.display = "none";
}

// Initialize game UI elements
let fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle;
