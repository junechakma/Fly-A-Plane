/**
 * Sky Model
 * Creates and manages the sky model and its clouds
 */

// Sky variable
let sky;

// Sky constructor
class Sky {
  constructor() {
    // Create an empty container
    this.mesh = new THREE.Object3D();
    
    // Number of clouds to be scattered in the sky
    this.nClouds = 20;
    
    // To distribute the clouds consistently,
    // we need to place them according to a uniform angle
    const stepAngle = Math.PI * 2 / this.nClouds;
    
    // Create the clouds
    for (let i = 0; i < this.nClouds; i++) {
      const c = new Cloud();
      
      // Set the rotation and position of each cloud
      const a = stepAngle * i; // Final angle of the cloud
      const h = game.seaRadius + 150 + Math.random() * 200; // Distance from the center of the axis
      
      // Convert polar coordinates (angle, distance) to Cartesian coordinates (x, y)
      c.mesh.position.y = Math.sin(a) * h;
      c.mesh.position.x = Math.cos(a) * h;
      
      // Rotate the cloud according to its position
      c.mesh.rotation.z = a + Math.PI / 2;
      
      // Random depth for the clouds on the z-axis
      c.mesh.position.z = -400 - Math.random() * 400;
      
      // Random scale for each cloud
      const s = 1 + Math.random() * 2;
      c.mesh.scale.set(s, s, s);
      
      // Add the cloud to the container
      this.mesh.add(c.mesh);
    }
  }
  
  // Move the clouds
  moveClouds() {
    for (let i = 0; i < this.nClouds; i++) {
      const c = this.mesh.children[i];
      
      // Rotate the cloud
      c.rotation.z += game.speed * deltaTime * 0.2;
    }
  }
}

// Cloud constructor
class Cloud {
  constructor() {
    // Create an empty container that will hold the different parts of the cloud
    this.mesh = new THREE.Object3D();
    
    // Create a cube geometry
    // This shape will be duplicated to create the cloud
    const geom = new THREE.BoxGeometry(20, 20, 20);
    
    // Create a material
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.white,
    });
    
    // Duplicate the geometry a random number of times
    const nBlocs = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < nBlocs; i++) {
      // Create the mesh by cloning the geometry
      const m = new THREE.Mesh(geom, mat);
      
      // Set the position and rotation of each cube randomly
      m.position.x = i * 15;
      m.position.y = Math.random() * 10;
      m.position.z = Math.random() * 10;
      m.rotation.z = Math.random() * Math.PI * 2;
      m.rotation.y = Math.random() * Math.PI * 2;
      
      // Set the size of the cube randomly
      const s = .1 + Math.random() * .9;
      m.scale.set(s, s, s);
      
      // Allow each cube to cast and to receive shadows
      m.castShadow = true;
      m.receiveShadow = true;
      
      // Add the cube to the container
      this.mesh.add(m);
    }
  }
  
  // Rotate the cloud
  rotate() {
    const l = this.mesh.children.length;
    
    for (let i = 0; i < l; i++) {
      const m = this.mesh.children[i];
      m.rotation.z += Math.random() * .005 * (i + 1);
      m.rotation.y += Math.random() * .002 * (i + 1);
    }
  }
}

// Create the sky
function createSky() {
  sky = new Sky();
  sky.mesh.position.y = -game.seaRadius;
  scene.add(sky.mesh);
}
