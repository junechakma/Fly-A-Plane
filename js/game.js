//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    brownDark:0x23190f,
    pink:0xF5986E,
    yellow:0xf4ce93,
    blue:0x68c3c0,
    
    // Sky theme colors
    sunsetSky: 0xf7d9aa,
    nightSky: 0x0e546c,
    daySky: 0x87ceeb,
    
    // Sea colors for different themes
    sunsetSea: 0x68c3c0,
    nightSea: 0x1a3c5e,
    daySea: 0x68c3c0,  // Restored to the original color
    
    // Modern plane colors
    silver: 0xD9D9D9,        // Lighter, softer silver
    darkGrey: 0x5D5D5D,      // Warmer dark grey
    lightGrey: 0xA8A8A8,     // Softer light grey
    black: 0x222222,         // Softer black (very dark grey)
    navy: 0x1A3A5A,          // Softer, more muted navy
    jetBlue: 0x4f4e54,       // Softer blue with a hint of teal
    jetRed: 0x4f4e54,        // Softer, more muted red
    metallic: 0xB5BEC6,      // Softer metallic with blue undertones
    chrome: 0xECECEC,        // Softer chrome
    jetGold: 0xD4B86A        // Softer gold with less saturation
};

// Sky themes
var skyThemes = [
    {
        name: "sunset",
        fogColor: Colors.sunsetSky,
        seaColor: Colors.sunsetSea,
        ambientLightColor: 0xdc8874,
        ambientLightIntensity: 0.9,
        hemisphereLightColor: 0xaaaaaa,
        hemisphereLightGroundColor: 0x000000,
        hemisphereLightIntensity: 1,
        directionalLightColor: 0xffffff,
        directionalLightIntensity: 0.9,
        backgroundGradient: {
            top: "#e4e0ba",
            bottom: "#f7d9aa"
        }
    },
    {
        name: "night",
        fogColor: Colors.nightSky,
        seaColor: Colors.nightSea,
        ambientLightColor: 0x222266,
        ambientLightIntensity: 0.3,
        hemisphereLightColor: 0x444466,
        hemisphereLightGroundColor: 0x000111,
        hemisphereLightIntensity: 0.7,
        directionalLightColor: 0xaaaaff,
        directionalLightIntensity: .6,
        backgroundGradient: {
            top: "#051428",
            bottom: "#0e546c"
        }
    },
    {
        name: "day",
        fogColor: Colors.daySky,
        seaColor: Colors.daySea,
        ambientLightColor: 0x8a9597,
        ambientLightIntensity: 0.4,
        hemisphereLightColor: 0xffffff,
        hemisphereLightGroundColor: 0x88aaff,
        hemisphereLightIntensity: 0.7,
        directionalLightColor: 0xffffee,
        directionalLightIntensity: 0.7,
        backgroundGradient: {
            top: "#b8e0f3",    // Brighter, more vibrant blue
            bottom: "#89cff0"  // Lighter, sunnier blue
        }
    }
];

var currentThemeIndex = 0;
var distanceForThemeChange = 500; // Change theme every 2000 distance units
var themeLastUpdate = 0;

// Function to change the sky theme
function changeTheme(themeIndex) {
    var theme = skyThemes[themeIndex];
    
    // Update fog
    scene.fog.color.setHex(theme.fogColor);
    
    // Update sea color
    sea.mesh.material.color.setHex(theme.seaColor);
    
    // Update lights
    ambientLight.color.setHex(theme.ambientLightColor);
    ambientLight.intensity = theme.ambientLightIntensity;
    
    hemisphereLight.color.setHex(theme.hemisphereLightColor);
    hemisphereLight.groundColor.setHex(theme.hemisphereLightGroundColor);
    hemisphereLight.intensity = theme.hemisphereLightIntensity;
    
    shadowLight.color.setHex(theme.directionalLightColor);
    shadowLight.intensity = theme.directionalLightIntensity;
    
    // Update CSS background for both game-holder and world
    var gameHolder = document.getElementById('gameHolder');
    var worldElement = document.getElementById('world');
    
    var linearGradient = "linear-gradient(to bottom, " + theme.backgroundGradient.top + ", " + theme.backgroundGradient.bottom + ")";
    var webkitGradient = "-webkit-linear-gradient(" + theme.backgroundGradient.top + ", " + theme.backgroundGradient.bottom + ")";
    
    // Apply to game-holder (contains all UI elements)
    gameHolder.style.background = linearGradient;
    gameHolder.style.background = webkitGradient;
    
    // Clear the world background to be transparent
    worldElement.style.background = "transparent";
    
    console.log("Changing theme to " + theme.name + " with background gradient from " + theme.backgroundGradient.top + " to " + theme.backgroundGradient.bottom);
    
    currentThemeIndex = themeIndex;
}

///////////////

// GAME VARIABLES
var game;
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var ennemiesPool = [];
var particlesPool = [];
var particlesInUse = [];
var bulletsPool = []; // Pool for bullet objects
var bulletsInUse = []; // Active bullets
var keyboardControls = { up: false, down: false, left: false, right: false, shoot: false };
var highScore = 0; // Store the high score
var selectedPlaneType = "classic"; // Default plane type
var lastShootTime = 0; // Add cooldown tracking
var shootCooldown = 500; // Cooldown in milliseconds (0.5 seconds)
var isPaused = false; // Add pause state

// Initialize game object with default values
game = {
  speed: 0,
  initSpeed: 0.00035,
  baseSpeed: 0.00035,
  targetBaseSpeed: 0.00035,
  incrementSpeedByTime: 0.0000015,
  incrementSpeedByLevel: 0.000003,
  distanceForSpeedUpdate: 100,
  speedLastUpdate: 0,

  distance: 0,
  ratioSpeedDistance: 50,
  energy: 100,
  ratioSpeedEnergy: 3,

  level: 1,
  levelLastUpdate: 0,
  distanceForLevelUpdate: 1500,

  planeDefaultHeight: 100,
  planeAmpHeight: 80,
  planeAmpWidth: 75,
  planeMoveSensivity: 0.005,
  planeRotXSensivity: 0.0008,
  planeRotZSensivity: 0.0004,
  planeFallSpeed: 0.001,
  planeMinSpeed: 1.2,
  planeMaxSpeed: 1.6,
  planeSpeed: 0,
  planeCollisionDisplacementX: 0,
  planeCollisionSpeedX: 0,

  planeCollisionDisplacementY: 0,
  planeCollisionSpeedY: 0,

  seaRadius: 600,
  seaLength: 800,
  wavesMinAmp: 5,
  wavesMaxAmp: 20,
  wavesMinSpeed: 0.001,
  wavesMaxSpeed: 0.003,

  cameraFarPos: 500,
  cameraNearPos: 150,
  cameraSensivity: 0.002,

  coinDistanceTolerance: 15,
  coinValue: 3,
  coinsSpeed: 0.5,
  coinLastSpawn: 0,
  distanceForCoinsSpawn: 100,

  ennemyDistanceTolerance: 10,
  ennemyValue: 10,
  ennemiesSpeed: 0.6,
  ennemyLastSpawn: 0,
  distanceForEnnemiesSpawn: 50,

  status: "playing",
};

///////////////

//THREEJS RELATED VARIABLES

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer,
    container,
    controls;

// Add audio variables
var audioContext, backgroundMusic, backgroundMusicBuffer;
var collisionSound, collisionSoundBuffer;
var gameOverSound, gameOverSoundBuffer;
var coinSound, coinSoundBuffer;
var fireSound, fireSoundBuffer;
var isSoundMuted = false;
var gainNode; // Add persistent gain node

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = .1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  scene.fog = new THREE.Fog(skyThemes[currentThemeIndex].fogColor, 100,950);
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = game.planeDefaultHeight;
  //camera.lookAt(new THREE.Vector3(0, 400, 0));

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
  
  document.addEventListener('keydown', handleKeyDown, false);
  document.addEventListener('keyup', handleKeyUp, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('mouseup', handleMouseUp, false);
  document.addEventListener('touchend', handleTouchEnd, false);
  document.addEventListener('touchstart', handleTouchStart, false);

  /*
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = -Math.PI / 2;
  controls.maxPolarAngle = Math.PI ;

  //controls.noZoom = true;
  //controls.noPan = true;
  //*/
}

// MOUSE AND SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

function handleTouchMove(event) {
    event.preventDefault();
    var tx = -1 + (event.touches[0].pageX / WIDTH)*2;
    var ty = 1 - (event.touches[0].pageY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
}

function handleMouseUp(event){
  if (game.status == "waitingReplay"){
    resetGame();
    hideReplay();
  }
}


function handleTouchEnd(event){
  if (game.status == "waitingReplay"){
    resetGame();
    hideReplay();
  }
}

function handleTouchStart(event){
  if (game.status == "waitingReplay"){
    resetGame();
    hideReplay();
  }
}

// KEYBOARD EVENTS
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
    case ' ':
    case 'Spacebar':
      keyboardControls.shoot = true;
      break;
  }
}

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
    case ' ':
    case 'Spacebar':
      keyboardControls.shoot = false;
      break;
  }
}

function updateMousePosFromKeyboard() {
  const keyboardSensitivity = 0.015;
  
  if (keyboardControls.up) {
    mousePos.y = Math.min(mousePos.y + keyboardSensitivity, 1);
  }
  if (keyboardControls.down) {
    mousePos.y = Math.max(mousePos.y - keyboardSensitivity, -1);
  }
  if (keyboardControls.left) {
    mousePos.x = Math.max(mousePos.x - keyboardSensitivity, -1);
  }
  if (keyboardControls.right) {
    mousePos.x = Math.min(mousePos.x + keyboardSensitivity, 1);
  }
}

// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  // A hemisphere light is a gradient colored light; 
  // the first parameter is the sky color, the second parameter is the ground color, 
  // the third parameter is the intensity of the light
  hemisphereLight = new THREE.HemisphereLight(
    skyThemes[currentThemeIndex].hemisphereLightColor,
    skyThemes[currentThemeIndex].hemisphereLightGroundColor,
    skyThemes[currentThemeIndex].hemisphereLightIntensity
  );
  
  // A directional light shines from a specific direction. 
  // It acts like the sun, that means that all the rays produced are parallel. 
  shadowLight = new THREE.DirectionalLight(
    skyThemes[currentThemeIndex].directionalLightColor,
    skyThemes[currentThemeIndex].directionalLightIntensity
  );

  // Set the direction of the light  
  shadowLight.position.set(150, 350, 350);
  
  // Allow shadow casting 
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better, 
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  
  // an ambient light modifies the global color of a scene and makes the shadows softer
  ambientLight = new THREE.AmbientLight(
    skyThemes[currentThemeIndex].ambientLightColor,
    skyThemes[currentThemeIndex].ambientLightIntensity
  );

  scene.add(hemisphereLight);  
  scene.add(shadowLight);
  scene.add(ambientLight);
}

var Pilot = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "pilot";
  this.angleHairs=0;

  var bodyGeom = new THREE.BoxGeometry(15,15,15);
  var bodyMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  var body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.set(2,-12,0);

  this.mesh.add(body);

  var faceGeom = new THREE.BoxGeometry(10,10,10);
  var faceMat = new THREE.MeshLambertMaterial({color:Colors.pink});
  var face = new THREE.Mesh(faceGeom, faceMat);
  this.mesh.add(face);

  var hairGeom = new THREE.BoxGeometry(4,4,4);
  var hairMat = new THREE.MeshLambertMaterial({color:Colors.brown});
  var hair = new THREE.Mesh(hairGeom, hairMat);
  hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));
  var hairs = new THREE.Object3D();

  this.hairsTop = new THREE.Object3D();

  for (var i=0; i<12; i++){
    var h = hair.clone();
    var col = i%3;
    var row = Math.floor(i/3);
    var startPosZ = -4;
    var startPosX = -4;
    h.position.set(startPosX + row*4, 0, startPosZ + col*4);
    h.geometry.applyMatrix(new THREE.Matrix4().makeScale(1,1,1));
    this.hairsTop.add(h);
  }
  hairs.add(this.hairsTop);

  var hairSideGeom = new THREE.BoxGeometry(12,4,2);
  hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
  var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
  var hairSideL = hairSideR.clone();
  hairSideR.position.set(8,-2,6);
  hairSideL.position.set(8,-2,-6);
  hairs.add(hairSideR);
  hairs.add(hairSideL);

  var hairBackGeom = new THREE.BoxGeometry(2,8,10);
  var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
  hairBack.position.set(-1,-4,0)
  hairs.add(hairBack);
  hairs.position.set(-5,5,0);

  this.mesh.add(hairs);

  var glassGeom = new THREE.BoxGeometry(5,5,5);
  var glassMat = new THREE.MeshLambertMaterial({color:Colors.brown});
  var glassR = new THREE.Mesh(glassGeom,glassMat);
  glassR.position.set(6,0,3);
  var glassL = glassR.clone();
  glassL.position.z = -glassR.position.z

  var glassAGeom = new THREE.BoxGeometry(11,1,11);
  var glassA = new THREE.Mesh(glassAGeom, glassMat);
  this.mesh.add(glassR);
  this.mesh.add(glassL);
  this.mesh.add(glassA);

  var earGeom = new THREE.BoxGeometry(2,3,2);
  var earL = new THREE.Mesh(earGeom,faceMat);
  earL.position.set(0,0,-6);
  var earR = earL.clone();
  earR.position.set(0,0,6);
  this.mesh.add(earL);
  this.mesh.add(earR);
}

Pilot.prototype.updateHairs = function(){
  //*
   var hairs = this.hairsTop.children;

   var l = hairs.length;
   for (var i=0; i<l; i++){
      var h = hairs[i];
      h.scale.y = .75 + Math.cos(this.angleHairs+i/3)*.25;
   }
  this.angleHairs += game.speed*deltaTime*40;
  //*/
}

var AirPlane = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "airPlane";

  // Cabin

  var geomCabin = new THREE.BoxGeometry(80,50,50,1,1,1);
  var matCabin = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});

  geomCabin.vertices[4].y-=10;
  geomCabin.vertices[4].z+=20;
  geomCabin.vertices[5].y-=10;
  geomCabin.vertices[5].z-=20;
  geomCabin.vertices[6].y+=30;
  geomCabin.vertices[6].z+=20;
  geomCabin.vertices[7].y+=30;
  geomCabin.vertices[7].z-=20;

  var cabin = new THREE.Mesh(geomCabin, matCabin);
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  this.mesh.add(cabin);

  // Engine

  var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
  var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 50;
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);

  // Tail Plane

  var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  tailPlane.position.set(-40,20,0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
  this.mesh.add(tailPlane);

  // Wings

  var geomSideWing = new THREE.BoxGeometry(30,5,120,1,1,1);
  var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0,15,0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
  this.mesh.add(sideWing);

  var geomWindshield = new THREE.BoxGeometry(3,15,20,1,1,1);
  var matWindshield = new THREE.MeshPhongMaterial({color:Colors.white,transparent:true, opacity:.3, shading:THREE.FlatShading});;
  var windshield = new THREE.Mesh(geomWindshield, matWindshield);
  windshield.position.set(5,27,0);

  windshield.castShadow = true;
  windshield.receiveShadow = true;

  this.mesh.add(windshield);

  var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
  geomPropeller.vertices[4].y-=5;
  geomPropeller.vertices[4].z+=5;
  geomPropeller.vertices[5].y-=5;
  geomPropeller.vertices[5].z-=5;
  geomPropeller.vertices[6].y+=5;
  geomPropeller.vertices[6].z+=5;
  geomPropeller.vertices[7].y+=5;
  geomPropeller.vertices[7].z-=5;
  var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);

  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  var geomBlade = new THREE.BoxGeometry(1,80,10,1,1,1);
  var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
  var blade1 = new THREE.Mesh(geomBlade, matBlade);
  blade1.position.set(8,0,0);

  blade1.castShadow = true;
  blade1.receiveShadow = true;

  var blade2 = blade1.clone();
  blade2.rotation.x = Math.PI/2;

  blade2.castShadow = true;
  blade2.receiveShadow = true;

  this.propeller.add(blade1);
  this.propeller.add(blade2);
  this.propeller.position.set(60,0,0);
  this.mesh.add(this.propeller);

  var wheelProtecGeom = new THREE.BoxGeometry(30,15,10,1,1,1);
  var wheelProtecMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var wheelProtecR = new THREE.Mesh(wheelProtecGeom,wheelProtecMat);
  wheelProtecR.position.set(25,-20,25);
  this.mesh.add(wheelProtecR);

  var wheelTireGeom = new THREE.BoxGeometry(24,24,4);
  var wheelTireMat = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
  var wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat);
  wheelTireR.position.set(25,-28,25);

  var wheelAxisGeom = new THREE.BoxGeometry(10,10,6);
  var wheelAxisMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
  var wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat);
  wheelTireR.add(wheelAxis);

  this.mesh.add(wheelTireR);

  var wheelProtecL = wheelProtecR.clone();
  wheelProtecL.position.z = -wheelProtecR.position.z ;
  this.mesh.add(wheelProtecL);

  var wheelTireL = wheelTireR.clone();
  wheelTireL.position.z = -wheelTireR.position.z;
  this.mesh.add(wheelTireL);

  var wheelTireB = wheelTireR.clone();
  wheelTireB.scale.set(.5,.5,.5);
  wheelTireB.position.set(-35,-5,0);
  this.mesh.add(wheelTireB);

  var suspensionGeom = new THREE.BoxGeometry(4,20,4);
  suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0))
  var suspensionMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
  suspension.position.set(-35,-5,0);
  suspension.rotation.z = -.3;
  this.mesh.add(suspension);

  this.pilot = new Pilot();
  this.pilot.mesh.position.set(-10,27,0);
  this.mesh.add(this.pilot.mesh);

  this.mesh.castShadow = true;
  this.mesh.receiveShadow = true;
};

var Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 15;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    var h = game.seaRadius + 150 + Math.random()*150;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -200-Math.random()*300;
    c.mesh.rotation.z = a + Math.PI/2;
    var s = 0.8+Math.random()*0.8;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Sky.prototype.moveClouds = function(){
  for (var i=0; i<this.nClouds; i++){
    var c = this.clouds[i];
    c.rotate();
  }
  this.mesh.rotation.z += game.speed*deltaTime;

}

Sea = function(){
  var geom = new THREE.CylinderGeometry(game.seaRadius,game.seaRadius,game.seaLength,40,10);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  geom.mergeVertices();
  var l = geom.vertices.length;

  this.waves = [];

  for (var i=0;i<l;i++){
    var v = geom.vertices[i];
    //v.y = Math.random()*30;
    this.waves.push({y:v.y,
                     x:v.x,
                     z:v.z,
                     ang:Math.random()*Math.PI*2,
                     amp:game.wavesMinAmp + Math.random()*(game.wavesMaxAmp-game.wavesMinAmp),
                     speed:game.wavesMinSpeed + Math.random()*(game.wavesMaxSpeed - game.wavesMinSpeed)
                    });
  };
  var mat = new THREE.MeshPhongMaterial({
    color:skyThemes[currentThemeIndex].seaColor,
    transparent:true,
    opacity:.8,
    shading:THREE.FlatShading,

  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.name = "waves";
  this.mesh.receiveShadow = true;

}

Sea.prototype.moveWaves = function (){
  var verts = this.mesh.geometry.vertices;
  var l = verts.length;
  for (var i=0; i<l; i++){
    var v = verts[i];
    var vprops = this.waves[i];
    v.x =  vprops.x + Math.cos(vprops.ang)*vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
    vprops.ang += vprops.speed*deltaTime;
    this.mesh.geometry.verticesNeedUpdate=true;
  }
}

Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  
  // Create a more realistic cloud shape using spheres instead of cubes
  var geomSphere = new THREE.SphereGeometry(5, 6, 6);
  var mat = new THREE.MeshPhongMaterial({
    color: Colors.white,
    transparent: true,
    opacity: 0.8,
    flatShading: THREE.FlatShading
  });

  // Create a smaller, more optimized cloud with fewer elements
  var nBlocs = 3 + Math.floor(Math.random() * 2); 
  
  // Create the main body of the cloud
  for (var i = 0; i < nBlocs; i++) {
    var m = new THREE.Mesh(geomSphere.clone(), mat);
    
    // Position spheres closer together for a more cohesive cloud shape
    m.position.x = i * 16; 
    m.position.y = Math.random() * 10; 
    m.position.z = Math.random() * 14; 
    
    // Slight random rotation for natural look
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;
    
    // Smaller scale for optimization
    var s = 4 + Math.random() * 0.3; 
    m.scale.set(s, s, s);
    
    this.mesh.add(m);
    
    // Only cast shadows from the larger elements to improve performance
    m.castShadow = s > 1.2;
    m.receiveShadow = true;
  }
  
  // Add some smaller spheres on top for fluffiness
  for (var i = 0; i < Math.floor(nBlocs/2); i++) {
    var m = new THREE.Mesh(geomSphere.clone(), mat);
    m.position.x = (i * 8) + 4;
    m.position.y = 5 + Math.random() * 3;
    m.position.z = Math.random() * 5;
    
    var s = 0.5 + Math.random() * 0.4;
    m.scale.set(s, s, s);
    
    this.mesh.add(m);
    
    // Small spheres don't cast shadows for better performance
    m.castShadow = false;
    m.receiveShadow = true;
  }
  
  // Scale down the entire cloud
  this.mesh.scale.set(0.7, 0.7, 0.7);
}

Cloud.prototype.rotate = function(){
  var l = this.mesh.children.length;
  for(var i=0; i<l; i++){
    var m = this.mesh.children[i];
    m.rotation.z+= Math.random()*.005*(i+1);
    m.rotation.y+= Math.random()*.002*(i+1);
  }
}

Ennemy = function(){
  var geom = new THREE.TetrahedronGeometry(8,2);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.red,
    shininess:0,
    specular:0xffffff,
    shading:THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom,mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

EnnemiesHolder = function (){
  this.mesh = new THREE.Object3D();
  this.ennemiesInUse = [];
}

EnnemiesHolder.prototype.spawnEnnemies = function(){
  // Cap the number of enemies based on level
  var maxEnemies = Math.min(game.level, 5);  // Cap at 5 enemies max
  var nEnnemies = maxEnemies;

  for (var i=0; i<nEnnemies; i++){
    var ennemy;
    if (ennemiesPool.length) {
      ennemy = ennemiesPool.pop();
    }else{
      ennemy = new Ennemy();
    }

    ennemy.angle = - (i*0.1);
    ennemy.distance = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight-20);
    ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*ennemy.distance;
    ennemy.mesh.position.x = Math.cos(ennemy.angle)*ennemy.distance;

    this.mesh.add(ennemy.mesh);
    this.ennemiesInUse.push(ennemy);
  }
}

EnnemiesHolder.prototype.rotateEnnemies = function(){
  for (var i=0; i<this.ennemiesInUse.length; i++){
    var ennemy = this.ennemiesInUse[i];
    ennemy.angle += game.speed*deltaTime*game.ennemiesSpeed;

    if (ennemy.angle > Math.PI*2) ennemy.angle -= Math.PI*2;

    ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*ennemy.distance;
    ennemy.mesh.position.x = Math.cos(ennemy.angle)*ennemy.distance;
    ennemy.mesh.rotation.z += Math.random()*.1;
    ennemy.mesh.rotation.y += Math.random()*.1;

    var diffPos = airplane.mesh.position.clone().sub(ennemy.mesh.position.clone());
    var d = diffPos.length();
    if (d<game.ennemyDistanceTolerance){
      particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.red, 3);
      playCollisionSound();

      ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
      this.mesh.remove(ennemy.mesh);
      game.planeCollisionSpeedX = 100 * diffPos.x / d;
      game.planeCollisionSpeedY = 100 * diffPos.y / d;
      ambientLight.intensity = 2;

      removeEnergy();
      i--;
    }else if (ennemy.angle > Math.PI){
      ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
      this.mesh.remove(ennemy.mesh);
      i--;
    }
  }
}

Particle = function(){
  var geom = new THREE.TetrahedronGeometry(3,0);
  var mat = new THREE.MeshPhongMaterial({
    color:0x009999,
    shininess:0,
    specular:0xffffff,
    shading:THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom,mat);
}

Particle.prototype.explode = function(pos, color, scale){
  var _this = this;
  var _p = this.mesh.parent;
  this.mesh.material.color = new THREE.Color( color);
  this.mesh.material.needsUpdate = true;
  this.mesh.scale.set(scale, scale, scale);
  var targetX = pos.x + (-1 + Math.random()*2)*50;
  var targetY = pos.y + (-1 + Math.random()*2)*50;
  var speed = .6+Math.random()*.2;
  TweenMax.to(this.mesh.rotation, speed, {x:Math.random()*12, y:Math.random()*12});
  TweenMax.to(this.mesh.scale, speed, {x:.1, y:.1, z:.1});
  TweenMax.to(this.mesh.position, speed, {x:targetX, y:targetY, delay:Math.random() *.1, ease:Power2.easeOut, onComplete:function(){
      if(_p) _p.remove(_this.mesh);
      _this.mesh.scale.set(1,1,1);
      particlesPool.unshift(_this);
    }});
}

ParticlesHolder = function (){
  this.mesh = new THREE.Object3D();
  this.particlesInUse = [];
}

ParticlesHolder.prototype.spawnParticles = function(pos, density, color, scale){

  var nPArticles = density;
  for (var i=0; i<nPArticles; i++){
    var particle;
    if (particlesPool.length) {
      particle = particlesPool.pop();
    }else{
      particle = new Particle();
    }
    this.mesh.add(particle.mesh);
    particle.mesh.visible = true;
    var _this = this;
    particle.mesh.position.y = pos.y;
    particle.mesh.position.x = pos.x;
    particle.explode(pos,color, scale);
  }
}

Coin = function(){
  var geom = new THREE.TetrahedronGeometry(5,0);
  var mat = new THREE.MeshPhongMaterial({
    color:0xd2b100,
    shininess:0,
    specular:0xffffff,

    shading:THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom,mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

CoinsHolder = function (nCoins){
  this.mesh = new THREE.Object3D();
  this.coinsInUse = [];
  this.coinsPool = [];
  for (var i=0; i<nCoins; i++){
    var coin = new Coin();
    this.coinsPool.push(coin);
  }
}

CoinsHolder.prototype.spawnCoins = function(){

  var nCoins = 1 + Math.floor(Math.random()*10);
  var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight-20);
  var amplitude = 10 + Math.round(Math.random()*10);
  for (var i=0; i<nCoins; i++){
    var coin;
    if (this.coinsPool.length) {
      coin = this.coinsPool.pop();
    }else{
      coin = new Coin();
    }
    this.mesh.add(coin.mesh);
    this.coinsInUse.push(coin);
    coin.angle = - (i*0.02);
    coin.distance = d + Math.cos(i*.5)*amplitude;
    coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.distance;
    coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
  }
}

CoinsHolder.prototype.rotateCoins = function(){
  for (var i=0; i<this.coinsInUse.length; i++){
    var coin = this.coinsInUse[i];
    if (coin.exploding) continue;
    coin.angle += game.speed*deltaTime*game.coinsSpeed;
    if (coin.angle>Math.PI*2) coin.angle -= Math.PI*2;
    coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.distance;
    coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
    coin.mesh.rotation.z += Math.random()*.1;
    coin.mesh.rotation.y += Math.random()*.1;

    var diffPos = airplane.mesh.position.clone().sub(coin.mesh.position.clone());
    var d = diffPos.length();
    if (d<game.coinDistanceTolerance){
      this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
      this.mesh.remove(coin.mesh);
      particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0xd2b100, .8);
      playCoinSound();
      addEnergy();
      i--;
    }else if (coin.angle > Math.PI){
      this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
      this.mesh.remove(coin.mesh);
      i--;
    }
  }
}


// 3D Models
var sea;
var airplane;

// Plane selection functions
function selectPlane(planeType) {
  // Highlight the selected plane option
  document.getElementById('classicPlaneOption').classList.remove('selected');
  document.getElementById('modernPlaneOption').classList.remove('selected');
  document.getElementById(planeType + 'PlaneOption').classList.add('selected');
  
  // Store the selected plane type
  selectedPlaneType = planeType;
}

function startGame(planeType) {
  // Set the selected plane type
  if (planeType) {
    selectedPlaneType = planeType;
  }
  
  // Hide the plane selection screen
  const planeSelection = document.getElementById('planeSelection');
  if (planeSelection) {
    planeSelection.style.display = 'none';
  }

  // Show the game controls
  const gameControls = document.querySelector('.game-controls');
  if (gameControls) {
    gameControls.style.display = 'flex';
  }
  
  // Start the game if it hasn't already been initialized
  if (!airplane) {
    init();
  } else {
    // If the game was already initialized but paused for plane selection
    resetGame();
    hideReplay();
    scene.remove(airplane.mesh);
    createPlane();
    // Restart music
    initAudio();
  }
}

function createPlane(){
  if (selectedPlaneType === "modern") {
    airplane = new ModernPlane();
    airplane.mesh.scale.set(.32,.32,.32);
  } else {
    airplane = new AirPlane();
    airplane.mesh.scale.set(.25,.25,.25);
  }
  
  airplane.mesh.position.y = game.planeDefaultHeight;
  airplane.mesh.position.x = -40; 
  scene.add(airplane.mesh);
}

function createSea(){
  sea = new Sea();
  sea.mesh.position.y = -game.seaRadius;
  scene.add(sea.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -game.seaRadius;
  scene.add(sky.mesh);
}

function createCoins(){
  coinsHolder = new CoinsHolder(20);
  scene.add(coinsHolder.mesh)
}

function createEnnemies(){
  for (var i=0; i<10; i++){
    var ennemy = new Ennemy();
    ennemiesPool.push(ennemy);
  }
  ennemiesHolder = new EnnemiesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(ennemiesHolder.mesh)
}

function createParticles(){
  for (var i=0; i<10; i++){
    var particle = new Particle();
    particlesPool.push(particle);
  }
  particlesHolder = new ParticlesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(particlesHolder.mesh)
}

function loop(){

  newTime = new Date().getTime();
  deltaTime = newTime-oldTime;
  oldTime = newTime;

  if (game.status=="playing" && !isPaused){

    updateMousePosFromKeyboard();

    // Add energy coins every 100m;
    if (Math.floor(game.distance)%game.distanceForCoinsSpawn == 0 && Math.floor(game.distance) > game.coinLastSpawn){
      game.coinLastSpawn = Math.floor(game.distance);
      coinsHolder.spawnCoins();
    }

    if (Math.floor(game.distance)%game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate){
      game.speedLastUpdate = Math.floor(game.distance);
      game.targetBaseSpeed += game.incrementSpeedByTime*deltaTime;
    }

    if (Math.floor(game.distance)%game.distanceForEnnemiesSpawn == 0 && Math.floor(game.distance) > game.ennemyLastSpawn){
      game.ennemyLastSpawn = Math.floor(game.distance);
      ennemiesHolder.spawnEnnemies();
    }

    if (Math.floor(game.distance)%game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate){
      game.levelLastUpdate = Math.floor(game.distance);
      game.level++;
      fieldLevel.innerHTML = Math.floor(game.level);

      game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel*game.level
    }


    updatePlane();
    updateDistance();
    updateEnergy();
    game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
    game.speed = game.baseSpeed * game.planeSpeed;

    // Handle shooting with cooldown
    var currentTime = new Date().getTime();
    if (keyboardControls.shoot && selectedPlaneType === "modern" && currentTime - lastShootTime >= shootCooldown) {
      var bullet = airplane.shoot();
      scene.add(bullet.mesh);
      bulletsInUse.push(bullet);
      playFireSound();
      lastShootTime = currentTime;
    }

  }else if (game.status=="gameover"){
    updatePlaneFall();
    
    // Once the plane is below the sea level, show the replay message
    if (airplane.mesh.position.y < -game.seaRadius) {
      showReplay();
      game.status = "waitingReplay";
    }
  }else if (game.status=="waitingReplay"){

  }

  // Handle plane-specific animations in the game loop
  if (selectedPlaneType === "modern" && airplane.updateAfterburner) {
    // Modern plane has afterburner animation
    airplane.updateAfterburner();
  } else if (airplane.propeller) {
    // Classic plane has propeller animation
    airplane.propeller.rotation.x += .2 + game.planeSpeed * deltaTime*.005;
  }
  
  sea.mesh.rotation.z += game.speed*deltaTime;//*game.seaRotationSpeed;

  if (sea.mesh.rotation.z > 2*Math.PI) sea.mesh.rotation.z -= 2*Math.PI;

  ambientLight.intensity += (.5 - ambientLight.intensity)*deltaTime*0.005;

  if (!isPaused) {
    coinsHolder.rotateCoins();
    ennemiesHolder.rotateEnnemies();
    sky.moveClouds();
    sea.moveWaves();
    updateBullets();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updateDistance(){
  game.distance += game.speed*deltaTime*game.ratioSpeedDistance;
  fieldDistance.innerHTML = Math.floor(game.distance);
  var d = 502*(1-(game.distance%game.distanceForLevelUpdate)/game.distanceForLevelUpdate);
  levelCircle.setAttribute("stroke-dashoffset", d);
  
  // Check if current distance is a new high score
  checkHighScore();
  
  // Check if it's time to change the theme
  if (Math.floor(game.distance) % distanceForThemeChange == 0 && Math.floor(game.distance) > themeLastUpdate) {
    themeLastUpdate = Math.floor(game.distance);
    // Move to the next theme in the cycle
    var nextThemeIndex = (currentThemeIndex + 1) % skyThemes.length;
    console.log("Changing theme from " + skyThemes[currentThemeIndex].name + " to " + skyThemes[nextThemeIndex].name);
    changeTheme(nextThemeIndex);
  }
}

var blinkEnergy=false;

function updateEnergy(){
  game.energy -= game.speed*deltaTime*game.ratioSpeedEnergy;
  game.energy = Math.max(0, game.energy);
  energyBar.style.right = (100-game.energy)+"%";
  energyBar.style.backgroundColor = (game.energy<50)? "#f25346" : "#68c3c0";

  if (game.energy<30){
    energyBar.style.animationName = "blinking";
  }else{
    energyBar.style.animationName = "none";
  }

  if (game.energy < 1){
    game.status = "gameover";
    playGameOverSound();
    stopBackgroundMusic();
  }
}

function addEnergy(){
  game.energy += game.coinValue;
  game.energy = Math.min(game.energy, 100);
}

function removeEnergy(){
  game.energy -= game.ennemyValue;
  game.energy = Math.max(0, game.energy);
}

function resetGame(){
  game.status = "playing";
  game.distance = 0;
  game.speed = game.initSpeed;
  game.baseSpeed = game.initSpeed;
  game.targetBaseSpeed = game.initSpeed;
  game.planeSpeed = game.planeMinSpeed;
  game.planeCollisionDisplacementX = 0;
  game.planeCollisionSpeedX = 0;

  game.planeCollisionDisplacementY = 0;
  game.planeCollisionSpeedY = 0;

  game.planeFallSpeed = 0;
  game.level = 1;
  game.energy = 100;
  game.coinLastSpawn = 0;
  game.speedLastUpdate = 0;
  game.ennemyLastSpawn = 0;
  game.levelLastUpdate = 0;
  
  // Reset theme change tracking
  themeLastUpdate = 0;
  
  // Update UI elements if they exist
  if (fieldDistance) fieldDistance.innerHTML = "0";
  if (fieldLevel) fieldLevel.innerHTML = "1";
  if (levelCircle) levelCircle.setAttribute("stroke-dashoffset", "0");
  if (energyBar) {
    energyBar.style.right = "0%";
    energyBar.style.backgroundColor = "#68c3c0";
    energyBar.style.animationName = "none";
  }
  
  // Update airplane if it exists
  if (airplane && airplane.mesh) {
    airplane.mesh.position.y = game.planeDefaultHeight;
    airplane.mesh.position.x = -40;
    airplane.mesh.rotation.x = 0;
    airplane.mesh.rotation.z = 0;
  }
  
  // Update camera if it exists
  if (camera) {
    if (airplane && airplane.mesh) {
      camera.position.y = airplane.mesh.position.y;
    }
    camera.rotation.x = 0;
  }
  
  // Update lighting if it exists
  if (ambientLight) {
    ambientLight.intensity = 1;
  }
  
  // Load high score
  loadHighScore();

  // Clear bullets
  for (var i = 0; i < bulletsInUse.length; i++) {
    scene.remove(bulletsInUse[i].mesh);
  }
  bulletsInUse = [];

  // Restart background music
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      playBackgroundMusic();
    });
  } else {
    playBackgroundMusic();
  }
}

function showReplay(){
  replayMessage.style.display="block";
}

function hideReplay(){
  replayMessage.style.display="none";
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

var fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle, fieldHighScore;

function initAudio() {
    try {
        // Create audio context only if it doesn't exist or is closed
        if (!audioContext || audioContext.state === 'closed') {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Create a persistent gain node
            gainNode = audioContext.createGain();
            gainNode.gain.value = isSoundMuted ? 0 : 0.5;
            gainNode.connect(audioContext.destination);
        }
        
        // If context is suspended, resume it
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Load background music if not loaded
        if (!backgroundMusicBuffer) {
            fetch('sounds/background.mp3')
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    backgroundMusicBuffer = audioBuffer;
                    playBackgroundMusic();
                })
                .catch(error => console.error('Error loading background music:', error));
        } else {
            playBackgroundMusic();
        }

        // Load collision sound if not loaded
        if (!collisionSoundBuffer) {
            fetch('sounds/collision.mp3')
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    collisionSoundBuffer = audioBuffer;
                })
                .catch(error => console.error('Error loading collision sound:', error));
        }

        // Load game over sound if not loaded
        if (!gameOverSoundBuffer) {
            fetch('sounds/game-over.mp3')
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    gameOverSoundBuffer = audioBuffer;
                })
                .catch(error => console.error('Error loading game over sound:', error));
        }

        // Load coin sound if not loaded
        if (!coinSoundBuffer) {
            fetch('sounds/coin.mp3')
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    coinSoundBuffer = audioBuffer;
                })
                .catch(error => console.error('Error loading coin sound:', error));
        }

        // Load fire sound if not loaded
        if (!fireSoundBuffer) {
            fetch('sounds/fire.mp3')
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    fireSoundBuffer = audioBuffer;
                })
                .catch(error => console.error('Error loading fire sound:', error));
        }
    } catch (error) {
        console.error('Audio initialization error:', error);
    }
}

function toggleSound() {
    isSoundMuted = !isSoundMuted;
    const soundButton = document.getElementById('soundButton');
    
    if (soundButton) {
        soundButton.innerHTML = isSoundMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }
    
    if (gainNode) {
        gainNode.gain.value = isSoundMuted ? 0 : 0.5;
    }
}

function playBackgroundMusic() {
    try {
        if (!backgroundMusicBuffer || !audioContext) {
            console.warn('Background music buffer or audio context not initialized');
            return;
        }

        // If context is suspended, resume it first
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // Stop any existing music before creating new
        stopBackgroundMusic();
            
        backgroundMusic = audioContext.createBufferSource();
        backgroundMusic.buffer = backgroundMusicBuffer;
        backgroundMusic.loop = true;
            
        // Use the persistent gain node
        backgroundMusic.connect(gainNode);
            
        // Start playing
        backgroundMusic.start(0);
    } catch (error) {
        console.error('Error playing background music:', error);
    }
}

function stopBackgroundMusic() {
    try {
        if (backgroundMusic) {
            backgroundMusic.stop();
            backgroundMusic.disconnect();
            backgroundMusic = null;
        }
    } catch (error) {
        console.error('Error stopping background music:', error);
    }
}

function init(event){

  // UI

  fieldDistance = document.getElementById("distValue");
  energyBar = document.getElementById("energyBar");
  replayMessage = document.getElementById("replayMessage");
  fieldLevel = document.getElementById("levelValue");
  levelCircle = document.getElementById("levelCircleStroke");
  fieldHighScore = document.getElementById("highScoreValue");

  // Add event listeners for pause and exit buttons
  const pauseButton = document.getElementById('pauseButton');
  const exitButton = document.getElementById('exitButton');
  const soundButton = document.getElementById('soundButton');
  
  if (pauseButton) {
    pauseButton.addEventListener('click', togglePause);
  }
  if (exitButton) {
    exitButton.addEventListener('click', exitGame);
  }
  if (soundButton) {
    soundButton.addEventListener('click', toggleSound);
  }

  // Initialize audio
  initAudio();

  resetGame();
  createScene();

  createLights();
  createPlane();
  createSea();
  createSky();
  createCoins();
  createEnnemies();
  createParticles();
  
  // Apply initial theme
  changeTheme(currentThemeIndex);

  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('mouseup', handleMouseUp, false);
  document.addEventListener('touchend', handleTouchEnd, false);
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('keydown', handleKeyDown, false);
  document.addEventListener('keyup', handleKeyUp, false);

  loop();
}

// Don't auto-initialize on load anymore, wait for plane selection
// window.addEventListener('load', init, false);

// Instead, just show the plane selection screen
window.addEventListener('load', function() {
  // The plane selection screen is already visible by default in index.html
  // Make sure high score is displayed
  fieldHighScore = document.getElementById("highScoreValue");
  loadHighScore();
  updateHighScoreDisplay();
}, false);

function checkHighScore() {
  if (game.distance > highScore) {
    highScore = Math.floor(game.distance);
    saveHighScore();
    updateHighScoreDisplay();
  }
}

function saveHighScore() {
  localStorage.setItem("highScore", highScore);
}

function loadHighScore() {
  highScore = localStorage.getItem("highScore");
  if (highScore === null) {
    highScore = 0;
  } else {
    highScore = parseInt(highScore);
  }
}

function updateHighScoreDisplay() {
  fieldHighScore.innerHTML = highScore;
}

function updatePlane(){

  updateMousePosFromKeyboard();

  game.planeSpeed = normalize(mousePos.x,-.5,.5,game.planeMinSpeed, game.planeMaxSpeed);
  var targetY = normalize(mousePos.y,-.75,.75,game.planeDefaultHeight-game.planeAmpHeight, game.planeDefaultHeight+game.planeAmpHeight);
  var targetX = normalize(mousePos.x,-1,1,-game.planeAmpWidth*.7, -game.planeAmpWidth);

  // Adjust for mobile - make plane more centered in the view
  if (WIDTH < 768) {
    targetX += 20;
  }

  game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
  targetX += game.planeCollisionDisplacementX;

  game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
  targetY += game.planeCollisionDisplacementY;

  airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*deltaTime*game.planeMoveSensivity;
  airplane.mesh.position.x += (targetX-airplane.mesh.position.x)*deltaTime*game.planeMoveSensivity;

  airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*deltaTime*game.planeRotZSensivity;
  airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*deltaTime*game.planeRotXSensivity;
  var targetCameraZ = normalize(game.planeSpeed, game.planeMinSpeed, game.planeMaxSpeed, game.cameraNearPos, game.cameraFarPos);
  camera.fov = normalize(mousePos.x,-1,1,40, 80);
  camera.updateProjectionMatrix ()
  camera.position.y += (airplane.mesh.position.y - camera.position.y)*deltaTime*game.cameraSensivity;

  // Update plane-specific animations
  if (selectedPlaneType === "modern" && airplane.updateAfterburner) {
    airplane.updateAfterburner();
  } else if (airplane.propeller) {
    airplane.propeller.rotation.x += 0.3;
  }

  game.planeCollisionSpeedX += (0-game.planeCollisionSpeedX)*deltaTime * 0.03;
  game.planeCollisionDisplacementX += (0-game.planeCollisionDisplacementX)*deltaTime *0.01;
  game.planeCollisionSpeedY += (0-game.planeCollisionSpeedY)*deltaTime * 0.03;
  game.planeCollisionDisplacementY += (0-game.planeCollisionDisplacementY)*deltaTime *0.01;

  airplane.pilot.updateHairs();
}

function updatePlaneFall() {
  // Gradually increase the fall speed for a more realistic effect
  game.planeFallSpeed += 0.0001 * deltaTime;
  
  // Apply the fall speed to the plane's position
  airplane.mesh.position.y -= game.planeFallSpeed * deltaTime;
  
  // Make the plane rotate as it falls for a more dramatic effect
  airplane.mesh.rotation.z += 0.003 * deltaTime;
  airplane.mesh.rotation.x += 0.002 * deltaTime;
  
  // Move the camera to follow the falling plane
  camera.fov = normalize(airplane.mesh.position.y, -200, game.planeDefaultHeight, 40, 80);
  camera.updateProjectionMatrix();
  
  // Slow down the game speed as the plane falls
  game.speed *= 0.99;
}

// Modify the updateBullets function
function updateBullets() {
    for (var i = bulletsInUse.length - 1; i >= 0; i--) {
        var bullet = bulletsInUse[i];
        if (!bullet.active) {
            bulletsPool.push(bulletsInUse.splice(i, 1)[0]);
            scene.remove(bullet.mesh);
            continue;
        }

        // Move bullet forward (changed from negative to positive)
        bullet.mesh.position.x += bullet.speed * deltaTime;

        // Check for collisions with enemies
        for (var j = ennemiesHolder.ennemiesInUse.length - 1; j >= 0; j--) {
            var enemy = ennemiesHolder.ennemiesInUse[j];
            var distance = bullet.mesh.position.distanceTo(enemy.mesh.position);
            
            if (distance < game.ennemyDistanceTolerance) {
                // Hit enemy
                particlesHolder.spawnParticles(enemy.mesh.position.clone(), 15, Colors.red, 3);
                bulletsPool.push(bulletsInUse.splice(i, 1)[0]);
                scene.remove(bullet.mesh);
                ennemiesPool.push(ennemiesHolder.ennemiesInUse.splice(j, 1)[0]);
                ennemiesHolder.mesh.remove(enemy.mesh);
                break;
            }
        }

        // Remove bullets that go off screen (changed from -1000 to 1000)
        if (bullet.mesh.position.x > 1000) {
            bullet.active = false;
        }
    }
}

// Modify the handleMouseClick function to include cooldown
function handleMouseClick(event) {
    var currentTime = new Date().getTime();
    if (game.status === "playing" && selectedPlaneType === "modern" && currentTime - lastShootTime >= shootCooldown) {
        var bullet = airplane.shoot();
        scene.add(bullet.mesh);
        bulletsInUse.push(bullet);
        playFireSound();
        lastShootTime = currentTime;
    }
}

// Add event listeners
document.addEventListener('click', handleMouseClick);

// Initialize bullets
createBullets();

function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
        pauseButton.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    }
    if (isPaused) {
        if (audioContext) {
            audioContext.suspend();
        }
    } else {
        if (audioContext) {
            audioContext.resume();
        }
    }
}

function exitGame() {
    stopBackgroundMusic();
    
    // Reset game state
    resetGame();
    // Show plane selection screen
    const planeSelection = document.getElementById('planeSelection');
    if (planeSelection) {
        planeSelection.style.display = 'flex';
    }
    // Hide game controls
    const gameControls = document.querySelector('.game-controls');
    if (gameControls) {
        gameControls.style.display = 'none';
    }
    // Hide replay message if visible
    hideReplay();
    // Reset pause state
    isPaused = false;
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
        pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

function playCollisionSound() {
    try {
        if (collisionSoundBuffer && audioContext && !isSoundMuted) {
            collisionSound = audioContext.createBufferSource();
            collisionSound.buffer = collisionSoundBuffer;
            
            // Create a separate gain node for the collision sound
            const collisionGainNode = audioContext.createGain();
            collisionGainNode.gain.value = 0.4; // Slightly lower volume for sound effect
            
            collisionSound.connect(collisionGainNode);
            collisionGainNode.connect(audioContext.destination);
            
            collisionSound.start(0);
        }
    } catch (error) {
        console.error('Error playing collision sound:', error);
    }
}

function playGameOverSound() {
    try {
        if (gameOverSoundBuffer && audioContext && !isSoundMuted) {
            gameOverSound = audioContext.createBufferSource();
            gameOverSound.buffer = gameOverSoundBuffer;
            
            // Create a separate gain node for the game over sound
            const gameOverGainNode = audioContext.createGain();
            gameOverGainNode.gain.value = 0.6; // Slightly louder than collision sound
            
            gameOverSound.connect(gameOverGainNode);
            gameOverGainNode.connect(audioContext.destination);
            
            gameOverSound.start(0);
        }
    } catch (error) {
        console.error('Error playing game over sound:', error);
    }
}

function playCoinSound() {
    try {
        if (coinSoundBuffer && audioContext && !isSoundMuted) {
            coinSound = audioContext.createBufferSource();
            coinSound.buffer = coinSoundBuffer;
            
            // Create a separate gain node for the coin sound
            const coinGainNode = audioContext.createGain();
            coinGainNode.gain.value = 0.3; // Lower volume for coin sound
            
            coinSound.connect(coinGainNode);
            coinGainNode.connect(audioContext.destination);
            
            coinSound.start(0);
        }
    } catch (error) {
        console.error('Error playing coin sound:', error);
    }
}

function playFireSound() {
    try {
        if (fireSoundBuffer && audioContext && !isSoundMuted) {
            fireSound = audioContext.createBufferSource();
            fireSound.buffer = fireSoundBuffer;
            
            // Create a separate gain node for the fire sound
            const fireGainNode = audioContext.createGain();
            fireGainNode.gain.value = 0.5; // Lower volume for fire sound
            
            fireSound.connect(fireGainNode);
            fireGainNode.connect(audioContext.destination);
            
            fireSound.start(0);
        }
    } catch (error) {
        console.error('Error playing fire sound:', error);
    }
}
