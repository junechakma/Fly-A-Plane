/**
 * Particles Model
 * Creates and manages particle effects for explosions and collisions
 */

// Particles variables
let particlesHolder;
let particlesPool = [];
let particlesInUse = [];

// Particle constructor
class Particle {
  constructor() {
    // Create the geometry
    const geom = new THREE.TetrahedronGeometry(3, 0);
    
    // Create the material
    const mat = new THREE.MeshPhongMaterial({
      color: 0x009999,
      shininess: 0,
      specular: 0xffffff,
      shading: THREE.FlatShading
    });
    
    // Create the mesh
    this.mesh = new THREE.Mesh(geom, mat);
  }
}

// ParticlesHolder constructor
class ParticlesHolder {
  constructor() {
    // Create an empty container
    this.mesh = new THREE.Object3D();
  }
  
  // Spawn particles
  spawnParticles(pos, density, color, scale) {
    const nPArticles = density;
    
    for (let i = 0; i < nPArticles; i++) {
      let particle;
      
      // Check if we have an available particle in the pool
      if (particlesPool.length) {
        particle = particlesPool.pop();
      } else {
        // If not, create a new particle
        particle = new Particle();
      }
      
      // Set particle position, rotation, and color
      this.mesh.add(particle.mesh);
      particlesInUse.push(particle);
      
      // Set the position
      particle.mesh.position.x = pos.x;
      particle.mesh.position.y = pos.y;
      particle.mesh.position.z = pos.z;
      
      // Set the scale
      particle.mesh.scale.set(scale, scale, scale);
      
      // Set the velocity
      const s = Math.random() * .5;
      particle.mesh.material.color.set(color);
      
      // Set the initial rotation
      particle.vx = -1 + Math.random() * 2;
      particle.vy = -1 + Math.random() * 2;
      particle.vz = -1 + Math.random() * 2;
      
      // Set the lifetime
      particle.gravity = -0.5 + Math.random();
      particle.drag = 0.98;
      particle.lifeTime = 150 + Math.random() * 100;
      particle.remainingLife = particle.lifeTime;
      particle.acceleration = Math.random() * .2;
      
      // Start the animation
      TweenMax.to(particle.mesh.scale, 1, { x: .01, y: .01, z: .01 });
      TweenMax.to(particle.mesh.material, 1, { opacity: 0 });
    }
  }
  
  // Update particles
  updateParticles() {
    for (let i = 0; i < particlesInUse.length; i++) {
      const particle = particlesInUse[i];
      
      // Update particle position
      particle.mesh.position.x += particle.vx;
      particle.mesh.position.y += particle.vy;
      particle.mesh.position.z += particle.vz;
      
      // Apply gravity and drag
      particle.vy += particle.gravity;
      particle.vx *= particle.drag;
      particle.vy *= particle.drag;
      particle.vz *= particle.drag;
      
      // Update remaining life
      particle.remainingLife--;
      
      // Check if particle is dead
      if (particle.remainingLife < 0) {
        // Remove the particle from the scene
        particlesInUse.splice(i, 1);
        this.mesh.remove(particle.mesh);
        particlesPool.unshift(particle);
        i--;
      }
    }
  }
}

// Create explosion effect
function explode(pos, color, scale) {
  particlesHolder.spawnParticles(pos, 15, color, scale);
}

// Create particles
function createParticles() {
  // Initialize the particles pool with 10 particles
  for (let i = 0; i < 10; i++) {
    const particle = new Particle();
    particlesPool.push(particle);
  }
  
  particlesHolder = new ParticlesHolder();
  scene.add(particlesHolder.mesh);
}
