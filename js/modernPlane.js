// COLORS
var Colors = {
    red: 0xf25346,
    white: 0xd8d0d1,
    brown: 0x59332e,
    brownDark: 0x23190f,
    pink: 0xF5986E,
    yellow: 0xf4ce93,
    blue: 0x68c3c0,
    silver: 0xC0C0C0,
    darkGrey: 0x444444,
    lightGrey: 0x888888,
    black: 0x000000,
    navy: 0x000080
};

/**
 * ModernPlane - A sleek, modern aircraft model
 * This class creates a modern jet plane with a more streamlined design
 * Note: This class requires the Pilot class from game.js
 */
var ModernPlane = function() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "modernPlane";

    // Rotate the entire plane 180 degrees around Y axis
    // This ensures the engines/propulsion are at the back when viewed in the game
    this.mesh.rotation.y = Math.PI;

    // Main Fuselage (more streamlined than the original plane)
    var geomFuselage = new THREE.BoxGeometry(100, 40, 40, 1, 1, 1);
    var matFuselage = new THREE.MeshPhongMaterial({
        color: Colors.silver,
        shading: THREE.FlatShading
    });

    // Modify vertices to create a more aerodynamic shape
    // Front vertices (make the nose pointed)
    geomFuselage.vertices[0].x -= 30;
    geomFuselage.vertices[1].x -= 30;
    geomFuselage.vertices[2].x -= 15;
    geomFuselage.vertices[3].x -= 15;
    
    // Top vertices
    geomFuselage.vertices[4].y -= 5;
    geomFuselage.vertices[4].z += 10;
    geomFuselage.vertices[5].y -= 5;
    geomFuselage.vertices[5].z -= 10;
    geomFuselage.vertices[6].y += 15;
    geomFuselage.vertices[6].z += 10;
    geomFuselage.vertices[7].y += 15;
    geomFuselage.vertices[7].z -= 10;

    var fuselage = new THREE.Mesh(geomFuselage, matFuselage);
    fuselage.castShadow = true;
    fuselage.receiveShadow = true;
    this.mesh.add(fuselage);

    // Cockpit (canopy)
    var geomCockpit = new THREE.BoxGeometry(30, 15, 30, 1, 1, 1);
    var matCockpit = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        opacity: 0.5,
        shading: THREE.FlatShading
    });

    // Modify vertices to create a curved canopy
    geomCockpit.vertices[0].y += 5;
    geomCockpit.vertices[1].y += 5;
    geomCockpit.vertices[4].y += 10;
    geomCockpit.vertices[5].y += 10;
    geomCockpit.vertices[4].z += 5;
    geomCockpit.vertices[5].z -= 5;

    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.position.set(-20, 25, 0); // Moved forward (negative X)
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    // Wings - Main wings are larger and more swept back
    var geomMainWing = new THREE.BoxGeometry(40, 5, 150, 1, 1, 1);
    var matMainWing = new THREE.MeshPhongMaterial({
        color: Colors.silver,
        shading: THREE.FlatShading
    });

    // Modify wing vertices to create a swept-back look
    geomMainWing.vertices[0].x -= 10;
    geomMainWing.vertices[1].x -= 10;
    geomMainWing.vertices[4].x += 10;
    geomMainWing.vertices[5].x += 10;

    var mainWing = new THREE.Mesh(geomMainWing, matMainWing);
    mainWing.position.set(0, 10, 0);
    mainWing.castShadow = true;
    mainWing.receiveShadow = true;
    this.mesh.add(mainWing);

    // Tail - Vertical stabilizer
    var geomTailVertical = new THREE.BoxGeometry(15, 30, 5, 1, 1, 1);
    var matTailVertical = new THREE.MeshPhongMaterial({
        color: Colors.navy,
        shading: THREE.FlatShading
    });

    // Modify vertices for a more aerodynamic shape
    geomTailVertical.vertices[0].x += 5;
    geomTailVertical.vertices[1].x += 5;
    geomTailVertical.vertices[4].x -= 5;
    geomTailVertical.vertices[5].x -= 5;

    var tailVertical = new THREE.Mesh(geomTailVertical, matTailVertical);
    tailVertical.position.set(45, 20, 0); // Moved to the back (positive X)
    tailVertical.castShadow = true;
    tailVertical.receiveShadow = true;
    this.mesh.add(tailVertical);

    // Horizontal Stabilizers
    var geomTailHorizontal = new THREE.BoxGeometry(20, 5, 60, 1, 1, 1);
    var matTailHorizontal = new THREE.MeshPhongMaterial({
        color: Colors.silver,
        shading: THREE.FlatShading
    });

    // Modify vertices for a more aerodynamic shape
    geomTailHorizontal.vertices[0].x += 5;
    geomTailHorizontal.vertices[1].x += 5;

    var tailHorizontal = new THREE.Mesh(geomTailHorizontal, matTailHorizontal);
    tailHorizontal.position.set(45, 10, 0); // Moved to the back (positive X)
    tailHorizontal.castShadow = true;
    tailHorizontal.receiveShadow = true;
    this.mesh.add(tailHorizontal);

    // Engines
    var geomEngine = new THREE.CylinderGeometry(8, 10, 25, 8, 1);
    var matEngine = new THREE.MeshPhongMaterial({
        color: Colors.darkGrey,
        shading: THREE.FlatShading
    });

    // Left Engine
    var engineLeft = new THREE.Mesh(geomEngine, matEngine);
    engineLeft.position.set(30, 0, 35); // Moved to the back (positive X)
    engineLeft.rotation.x = Math.PI / 2;
    engineLeft.castShadow = true;
    engineLeft.receiveShadow = true;
    this.mesh.add(engineLeft);

    // Right Engine
    var engineRight = new THREE.Mesh(geomEngine, matEngine);
    engineRight.position.set(30, 0, -35); // Moved to the back (positive X)
    engineRight.rotation.x = Math.PI / 2;
    engineRight.castShadow = true;
    engineRight.receiveShadow = true;
    this.mesh.add(engineRight);

    // Afterburners (for jet engines)
    this.afterburnerLeft = new THREE.Object3D();
    this.afterburnerRight = new THREE.Object3D();
    
    // Create afterburner effect
    var geomAfterburner = new THREE.CylinderGeometry(5, 8, 10, 8, 1);
    var matAfterburner = new THREE.MeshPhongMaterial({
        color: Colors.yellow,
        transparent: true,
        opacity: 0.7,
        shading: THREE.FlatShading
    });
    
    var afterburnerEffectLeft = new THREE.Mesh(geomAfterburner, matAfterburner);
    afterburnerEffectLeft.position.set(5, 0, 0);
    afterburnerEffectLeft.rotation.z = Math.PI / 2;
    this.afterburnerLeft.add(afterburnerEffectLeft);
    
    var afterburnerEffectRight = new THREE.Mesh(geomAfterburner, matAfterburner);
    afterburnerEffectRight.position.set(5, 0, 0);
    afterburnerEffectRight.rotation.z = Math.PI / 2;
    this.afterburnerRight.add(afterburnerEffectRight);
    
    this.afterburnerLeft.position.set(45, 0, 35); // Moved to the back (positive X)
    this.afterburnerRight.position.set(45, 0, -35); // Moved to the back (positive X)
    
    this.mesh.add(this.afterburnerLeft);
    this.mesh.add(this.afterburnerRight);

    // Landing gear
    var geomWheel = new THREE.CylinderGeometry(5, 5, 3, 8, 1);
    var matWheel = new THREE.MeshPhongMaterial({
        color: Colors.black,
        shading: THREE.FlatShading
    });
    
    // Front wheel
    var wheelFront = new THREE.Mesh(geomWheel, matWheel);
    wheelFront.rotation.x = Math.PI / 2;
    wheelFront.position.set(-30, -20, 0);
    this.mesh.add(wheelFront);
    
    // Left wheel
    var wheelLeft = new THREE.Mesh(geomWheel, matWheel);
    wheelLeft.rotation.x = Math.PI / 2;
    wheelLeft.position.set(20, -20, 25);
    this.mesh.add(wheelLeft);
    
    // Right wheel
    var wheelRight = new THREE.Mesh(geomWheel, matWheel);
    wheelRight.rotation.x = Math.PI / 2;
    wheelRight.position.set(20, -20, -25);
    this.mesh.add(wheelRight);
    
    // Struts for landing gear
    var geomStrut = new THREE.BoxGeometry(3, 20, 3, 1, 1, 1);
    var matStrut = new THREE.MeshPhongMaterial({
        color: Colors.silver,
        shading: THREE.FlatShading
    });
    
    // Front strut
    var strutFront = new THREE.Mesh(geomStrut, matStrut);
    strutFront.position.set(-30, -10, 0);
    this.mesh.add(strutFront);
    
    // Left strut
    var strutLeft = new THREE.Mesh(geomStrut, matStrut);
    strutLeft.position.set(20, -10, 25);
    this.mesh.add(strutLeft);
    
    // Right strut
    var strutRight = new THREE.Mesh(geomStrut, matStrut);
    strutRight.position.set(20, -10, -25);
    this.mesh.add(strutRight);

    // Add pilot
    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-15, 27, 0); // Moved forward (negative X)
    // Rotate the pilot 180 degrees to face forward
    this.pilot.mesh.rotation.y = Math.PI;
    this.mesh.add(this.pilot.mesh);

    // Cast shadows
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
};

// Create the afterburner effect for the modern plane
var createAfterburner = function() {
    var geomAfterburner = new THREE.CylinderGeometry(5, 8, 10, 8, 1);
    var matAfterburner = new THREE.MeshPhongMaterial({
        color: Colors.yellow,
        transparent: true,
        opacity: 0.7,
        shading: THREE.FlatShading
    });
    
    return new THREE.Mesh(geomAfterburner, matAfterburner);
};

// Update the afterburner effect animation
ModernPlane.prototype.updateAfterburner = function() {
    // Randomly adjust the opacity for a flame effect
    var minOpacity = 0.4;
    var maxOpacity = 0.9;
    
    // Get the afterburner meshes
    var leftBurner = this.afterburnerLeft.children[0];
    var rightBurner = this.afterburnerRight.children[0];
    
    // Randomly adjust opacity for flame effect
    if (leftBurner && leftBurner.material) {
        leftBurner.material.opacity = minOpacity + Math.random() * (maxOpacity - minOpacity);
    }
    
    if (rightBurner && rightBurner.material) {
        rightBurner.material.opacity = minOpacity + Math.random() * (maxOpacity - minOpacity);
    }
    
    // Randomly adjust the scale for a pulsing effect
    var minScale = 0.8;
    var maxScale = 1.2;
    var scale = minScale + Math.random() * (maxScale - minScale);
    
    this.afterburnerLeft.scale.set(scale, scale, scale);
    this.afterburnerRight.scale.set(scale, scale, scale);
};
