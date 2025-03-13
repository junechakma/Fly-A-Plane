/**
 * Pilot Model
 * Creates and manages the pilot model and its animations
 */

// Pilot constructor
class Pilot {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "pilot";
    
    // Body
    const bodyGeom = new THREE.BoxGeometry(15, 15, 15);
    const bodyMat = new THREE.MeshPhongMaterial({ color: Colors.brown, shading: THREE.FlatShading });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(2, -12, 0);
    this.mesh.add(body);

    // Face
    const faceGeom = new THREE.BoxGeometry(10, 10, 10);
    const faceMat = new THREE.MeshLambertMaterial({ color: Colors.pink });
    const face = new THREE.Mesh(faceGeom, faceMat);
    this.mesh.add(face);

    // Hair
    const hairGeom = new THREE.BoxGeometry(4, 4, 4);
    const hairMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
    
    // Create multiple hair elements
    const hairs = new THREE.Object3D();
    this.hairsTop = new THREE.Object3D();

    // Create the hairs at the top of the head
    // and position them on a 3 x 4 grid
    for (let i = 0; i < 12; i++) {
      const hair = new THREE.Mesh(hairGeom, hairMat);
      
      // Position the hair elements
      hair.position.x = (i % 3) * 4 - 4;
      hair.position.y = (i / 3) * 4 + 2;
      hair.position.z = 0;
      
      // Add random size and rotation to each hair
      const s = Math.random() * .5 + .5;
      hair.scale.set(s, s, s);
      
      // Add random rotation to each hair
      hair.rotation.z = Math.random() * Math.PI * 2;
      hair.rotation.x = Math.random() * Math.PI * 2;
      
      // Add the hair to the hairsTop container
      this.hairsTop.add(hair);
    }
    
    // Position the hairs at the top of the head
    this.hairsTop.position.set(-5, 5, 0);
    hairs.add(this.hairsTop);
    
    // Create the hairs at the side of the face
    const hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
    hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
    const hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
    const hairSideL = hairSideR.clone();
    
    // Position the side hairs
    hairSideR.position.set(8, -2, 6);
    hairSideL.position.set(8, -2, -6);
    hairs.add(hairSideR);
    hairs.add(hairSideL);

    // Create the hairs at the back of the head
    const hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
    const hairBack = new THREE.Mesh(hairBackGeom, hairMat);
    hairBack.position.set(-1, -4, 0);
    hairs.add(hairBack);
    
    this.mesh.add(hairs);

    // Glasses
    const glassGeom = new THREE.BoxGeometry(5, 5, 5);
    const glassMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
    const glassR = new THREE.Mesh(glassGeom, glassMat);
    glassR.position.set(6, 0, 3);
    const glassL = glassR.clone();
    glassL.position.z = -glassR.position.z;

    // Glass frame
    const glassFrameGeom = new THREE.BoxGeometry(11, 1, 11);
    const glassFrameMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
    const glassFrame = new THREE.Mesh(glassFrameGeom, glassFrameMat);
    glassFrame.position.set(2, 0, 0);
    
    // Add glasses to the mesh
    this.mesh.add(glassR);
    this.mesh.add(glassL);
    this.mesh.add(glassFrame);

    // Ear
    const earGeom = new THREE.BoxGeometry(2, 3, 2);
    const earL = new THREE.Mesh(earGeom, faceMat);
    earL.position.set(0, 0, -6);
    const earR = earL.clone();
    earR.position.set(0, 0, 6);
    
    // Add ears to the mesh
    this.mesh.add(earL);
    this.mesh.add(earR);
  }

  // Update hair animation
  updateHairs() {
    // Get the hair
    const hairs = this.hairsTop.children;

    // Update them according to the angle angleHairs
    const l = hairs.length;
    
    for (let i = 0; i < l; i++) {
      const h = hairs[i];
      
      // Each hair element will scale on cyclical basis between 75% and 100% of its original size
      h.scale.y = .75 + Math.cos(this.angleHairs + i / 3) * .25;
    }
    
    // Increment the angle for the next frame
    this.angleHairs += 0.16;
  }
}
