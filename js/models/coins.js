/**
 * Coins Model
 * Creates and manages coin objects and their mechanics
 */

// Coins holder variable
let coinsHolder;

// Coin constructor
class Coin {
  constructor() {
    // Create the geometry
    const geom = new THREE.TetrahedronGeometry(5, 0);
    
    // Create the material
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.blue,
      shininess: 0,
      specular: 0xffffff,
      shading: THREE.FlatShading
    });
    
    // Create the mesh
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
    
    // Initial angle
    this.angle = 0;
    this.dist = 0;
  }
}

// CoinsHolder constructor
class CoinsHolder {
  constructor(nCoins) {
    // Create an empty container
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
    this.coinsPool = [];
    
    // Create the coins
    const nCoinsInitial = nCoins || 10;
    
    for (let i = 0; i < nCoinsInitial; i++) {
      const coin = new Coin();
      this.coinsPool.push(coin);
    }
  }
  
  // Spawn coins
  spawnCoins() {
    // Keep a reference to the coins holder
    const nCoins = 1 + Math.floor(Math.random() * 10);
    
    // Check if we need to spawn a coin
    const d = game.distance;
    
    if (d - game.coinLastSpawn > game.distanceForCoinsSpawn) {
      game.coinLastSpawn = d;
      
      // Add coins in a random position
      const amplitude = Math.min(game.seaWidth - 20, 800);
      const height = game.seaHeight + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
      
      for (let i = 0; i < nCoins; i++) {
        let coin;
        
        // Check if we have an available coin in the pool
        if (this.coinsPool.length) {
          coin = this.coinsPool.pop();
        } else {
          // If not, create a new coin
          coin = new Coin();
        }
        
        // Set coin position and rotation
        this.mesh.add(coin.mesh);
        this.coinsInUse.push(coin);
        
        // Set the position
        coin.angle = - (i * 0.02);
        coin.distance = amplitude + Math.cos(i * .5) * amplitude;
        
        // Update coin position
        coin.mesh.position.y = height;
        coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
        coin.mesh.position.z = Math.sin(coin.angle) * coin.distance;
      }
    }
  }
  
  // Rotate coins
  rotateCoins() {
    for (let i = 0; i < this.coinsInUse.length; i++) {
      const coin = this.coinsInUse[i];
      
      // Rotate the coin
      coin.angle += game.speed * deltaTime * game.coinsSpeed;
      
      // Update coin position
      if (coin.angle > Math.PI * 2) coin.angle -= Math.PI * 2;
      
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
      coin.mesh.position.z = Math.sin(coin.angle) * coin.distance;
      
      // Rotate the coin
      coin.mesh.rotation.z += Math.random() * .1;
      coin.mesh.rotation.y += Math.random() * .1;
      
      // Check if coin is out of the field of view
      const diffPos = airplane.mesh.position.clone().sub(coin.mesh.position.clone());
      const d = diffPos.length();
      
      if (d < game.coinDistanceTolerance) {
        // Remove the coin from the scene
        this.coinsInUse.splice(i, 1);
        this.mesh.remove(coin.mesh);
        this.coinsPool.unshift(coin);
        
        // Add energy
        addEnergy();
        
        i--;
      } else if (coin.angle > Math.PI) {
        // Remove the coin from the scene
        this.coinsInUse.splice(i, 1);
        this.mesh.remove(coin.mesh);
        this.coinsPool.unshift(coin);
        i--;
      }
    }
  }
}

// Create coins
function createCoins() {
  coinsHolder = new CoinsHolder(20);
  scene.add(coinsHolder.mesh);
}
