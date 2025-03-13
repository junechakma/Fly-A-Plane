/**
 * Enemies Model
 * Creates and manages enemy objects and their mechanics
 */

// Enemies variables
let ennemiesHolder;
let ennemiesPool = [];

// Enemy constructor
class Ennemy {
  constructor() {
    // Create the geometry
    const geom = new THREE.TetrahedronGeometry(8, 2);
    
    // Create the material
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      shininess: 0,
      specular: 0xffffff,
      shading: THREE.FlatShading
    });
    
    // Create the mesh
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
    
    // Initial angle and distance
    this.angle = 0;
    this.dist = 0;
  }
}

// EnnemiesHolder constructor
class EnnemiesHolder {
  constructor() {
    // Create an empty container
    this.mesh = new THREE.Object3D();
    this.ennemiesInUse = [];
  }
  
  // Spawn enemies
  spawnEnnemies() {
    // Check if we need to spawn an enemy
    const d = game.distance;
    
    if (d - game.ennemyLastSpawn > game.distanceForEnnemiesSpawn) {
      game.ennemyLastSpawn = d;
      
      // Add an enemy in a random position
      const nEnnemies = game.level;
      
      for (let i = 0; i < nEnnemies; i++) {
        let ennemy;
        
        // Check if we have an available enemy in the pool
        if (ennemiesPool.length) {
          ennemy = ennemiesPool.pop();
        } else {
          // If not, create a new enemy
          ennemy = new Ennemy();
        }
        
        // Set enemy position and rotation
        ennemy.angle = - (i * 0.1);
        ennemy.distance = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
        ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle) * ennemy.distance;
        ennemy.mesh.position.x = Math.cos(ennemy.angle) * ennemy.distance;
        
        // Rotate the enemy
        this.mesh.add(ennemy.mesh);
        this.ennemiesInUse.push(ennemy);
      }
    }
  }
  
  // Rotate enemies
  rotateEnnemies() {
    for (let i = 0; i < this.ennemiesInUse.length; i++) {
      const ennemy = this.ennemiesInUse[i];
      
      // Rotate the enemy
      ennemy.angle += game.speed * deltaTime * game.ennemiesSpeed;
      
      if (ennemy.angle > Math.PI * 2) ennemy.angle -= Math.PI * 2;
      
      // Update enemy position
      ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle) * ennemy.distance;
      ennemy.mesh.position.x = Math.cos(ennemy.angle) * ennemy.distance;
      ennemy.mesh.rotation.z += Math.random() * .1;
      ennemy.mesh.rotation.y += Math.random() * .1;
      
      // Check if enemy is out of the field of view
      const diffPos = airplane.mesh.position.clone().sub(ennemy.mesh.position.clone());
      const d = diffPos.length();
      
      if (d < game.ennemyDistanceTolerance) {
        // Remove the enemy from the scene
        particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.red, 3);
        
        this.ennemiesInUse.splice(i, 1);
        this.mesh.remove(ennemy.mesh);
        ennemiesPool.unshift(ennemy);
        
        // Update game status
        game.planeCollisionSpeedX = 100 * diffPos.x / d;
        game.planeCollisionSpeedY = 100 * diffPos.y / d;
        
        // Remove energy
        removeEnergy();
        
        i--;
      } else if (ennemy.angle > Math.PI) {
        // Remove the enemy from the scene
        this.ennemiesInUse.splice(i, 1);
        this.mesh.remove(ennemy.mesh);
        ennemiesPool.unshift(ennemy);
        i--;
      }
    }
  }
}

// Create enemies
function createEnnemies() {
  // Initialize the enemies pool with 10 enemies
  for (let i = 0; i < 10; i++) {
    const ennemy = new Ennemy();
    ennemiesPool.push(ennemy);
  }
  
  ennemiesHolder = new EnnemiesHolder();
  scene.add(ennemiesHolder.mesh);
}
