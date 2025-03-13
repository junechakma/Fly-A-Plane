/**
 * Sea Model
 * Creates and manages the sea model and its animations
 */

// Sea variable
let sea;

// Sea constructor
class Sea {
  constructor() {
    // Create the geometry (a cylinder)
    const geom = new THREE.CylinderGeometry(game.seaRadius, game.seaRadius, game.seaLength, 40, 10);
    
    // Rotate the geometry on the x axis
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    
    // Create the material
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.blue,
      transparent: true,
      opacity: .6,
      shading: THREE.FlatShading,
    });

    // To create an object in Three.js, we have to create a mesh
    // which is a combination of a geometry and some material
    this.mesh = new THREE.Mesh(geom, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;
    
    // Create the waves
    this.waves = [];
    
    // Get the vertices
    const verts = this.mesh.geometry.vertices;
    const l = verts.length;
    
    // Initialize waves
    for (let i = 0; i < l; i++) {
      // Get each vertex
      const v = verts[i];
      
      // Store some values associated to it
      this.waves.push({
        y: v.y,
        x: v.x,
        z: v.z,
        // A random angle
        ang: Math.random() * Math.PI * 2,
        // A random distance
        amp: game.wavesMinAmp + Math.random() * (game.wavesMaxAmp - game.wavesMinAmp),
        // A random speed between 0.016 and 0.048 radians / frame
        speed: game.wavesMinSpeed + Math.random() * (game.wavesMaxSpeed - game.wavesMinSpeed)
      });
    }
  }
  
  // Move the waves
  moveWaves() {
    // Get the vertices
    const verts = this.mesh.geometry.vertices;
    const l = verts.length;
    
    for (let i = 0; i < l; i++) {
      // Get the data associated to it
      const v = verts[i];
      const vprops = this.waves[i];
      
      // Update the position of the vertex
      v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
      v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;
      
      // Increment the angle for the next frame
      vprops.ang += vprops.speed * deltaTime;
    }
    
    // Tell the renderer that the geometry of the sea has changed.
    // In fact, in order to maintain the best level of performance,
    // three.js caches the geometries and ignores any changes
    // unless we add this line
    this.mesh.geometry.verticesNeedUpdate = true;
  }
}

// Create the sea
function createSea() {
  sea = new Sea();
  
  // Position the sea
  sea.mesh.position.y = -game.seaRadius;
  
  // Add the mesh to the scene
  scene.add(sea.mesh);
}
