// Demo script to show how to use the ModernPlane model
// This file demonstrates how to create and display the modern plane

// Wait for the DOM to be fully loaded
window.addEventListener('load', init, false);

// Global variables
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container;
var hemisphereLight, shadowLight, ambientLight;
var modernPlane;
var HEIGHT, WIDTH;

function init() {
    // Set up the scene, camera, and renderer
    createScene();
    
    // Add lights
    createLights();
    
    // Add the modern plane
    createModernPlane();
    
    // Start the rendering loop
    loop();
    
    // Add window resize handler
    window.addEventListener('resize', handleWindowResize, false);
}

function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    
    // Create the scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    
    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    
    // Set the camera position
    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 200;
    
    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    
    // Set the renderer size and enable shadows
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    
    // Append the renderer to the DOM
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
}

function createLights() {
    // Hemisphere light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    
    // Directional light
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    
    // Set shadow properties
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    
    // Ambient light
    ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
    
    // Add lights to scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(ambientLight);
}

function createModernPlane() {
    // Create the modern plane
    modernPlane = new ModernPlane();
    
    // Position the plane
    modernPlane.mesh.position.y = 100;
    
    // Add the plane to the scene
    scene.add(modernPlane.mesh);
}

function handleWindowResize() {
    // Update height and width
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    
    // Update renderer size
    renderer.setSize(WIDTH, HEIGHT);
    
    // Update camera
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function loop() {
    // Rotate the plane for demo purposes
    modernPlane.mesh.rotation.y += 0.01;
    
    // Animate the afterburners
    modernPlane.updateAfterburner();
    
    // Render the scene
    renderer.render(scene, camera);
    
    // Call the loop function again
    requestAnimationFrame(loop);
}
