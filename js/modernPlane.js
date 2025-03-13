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

    // Main Fuselage (more streamlined than the original plane)
    var geomFuselage = new THREE.BoxGeometry(100, 40, 40, 1, 1, 1);
    var matFuselage = new THREE.MeshPhongMaterial({
        color: Colors.silver,
        shading: THREE.FlatShading
    });

    // Modify vertices to create a more aerodynamic shape
    geomFuselage.vertices[4].y -= 5;
    geomFuselage.vertices[4].z += 10;
    geomFuselage.vertices[5].y -= 5;
    geomFuselage.vertices[5].z -= 10;
    geomFuselage.vertices[6].y += 15;
    geomFuselage.vertices[6].z += 10;
    geomFuselage.vertices[7].y += 15;
    geomFuselage.vertices[7].z -= 10;

    // Nose cone vertices (front)
    geomFuselage.vertices[0].x += 30;
    geomFuselage.vertices[1].x += 30;
    geomFuselage.vertices[0].y += 0;
    geomFuselage.vertices[1].y += 0;
    geomFuselage.vertices[0].z += 0;
    geomFuselage.vertices[1].z -= 0;

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
    cockpit.position.set(20, 25, 0);
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
    geomMainWing.vertices[0].x += 10;
    geomMainWing.vertices[1].x += 10;
    geomMainWing.vertices[4].x -= 10;
    geomMainWing.vertices[5].x -= 10;

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
    geomTailVertical.vertices[0].x -= 5;
    geomTailVertical.vertices[1].x -= 5;
    geomTailVertical.vertices[4].x += 5;
    geomTailVertical.vertices[5].x += 5;

    var tailVertical = new THREE.Mesh(geomTailVertical, matTailVertical);
    tailVertical.position.set(-45, 20, 0);
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
    geomTailHorizontal.vertices[0].x -= 5;
    geomTailHorizontal.vertices[1].x -= 5;

    var tailHorizontal = new THREE.Mesh(geomTailHorizontal, matTailHorizontal);
    tailHorizontal.position.set(-45, 10, 0);
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
    engineLeft.position.set(-10, 0, 35);
    engineLeft.rotation.x = Math.PI / 2;
    engineLeft.castShadow = true;
    engineLeft.receiveShadow = true;
    this.mesh.add(engineLeft);

    // Right Engine
    var engineRight = new THREE.Mesh(geomEngine, matEngine);
    engineRight.position.set(-10, 0, -35);
    engineRight.rotation.x = Math.PI / 2;
    engineRight.castShadow = true;
    engineRight.receiveShadow = true;
    this.mesh.add(engineRight);

    // Engine Nozzles
    var geomNozzle = new THREE.CylinderGeometry(6, 8, 5, 8, 1);
    var matNozzle = new THREE.MeshPhongMaterial({
        color: Colors.black,
        shading: THREE.FlatShading
    });

    // Left Nozzle
    var nozzleLeft = new THREE.Mesh(geomNozzle, matNozzle);
    nozzleLeft.position.set(-22, 0, 35);
    nozzleLeft.rotation.x = Math.PI / 2;
    nozzleLeft.castShadow = true;
    nozzleLeft.receiveShadow = true;
    this.mesh.add(nozzleLeft);

    // Right Nozzle
    var nozzleRight = new THREE.Mesh(geomNozzle, matNozzle);
    nozzleRight.position.set(-22, 0, -35);
    nozzleRight.rotation.x = Math.PI / 2;
    nozzleRight.castShadow = true;
    nozzleRight.receiveShadow = true;
    this.mesh.add(nozzleRight);

    // Landing Gear - Front
    var geomFrontGear = new THREE.BoxGeometry(5, 15, 5);
    var matGear = new THREE.MeshPhongMaterial({
        color: Colors.darkGrey,
        shading: THREE.FlatShading
    });
    var frontGear = new THREE.Mesh(geomFrontGear, matGear);
    frontGear.position.set(30, -20, 0);
    this.mesh.add(frontGear);

    // Front Wheel
    var geomWheel = new THREE.CylinderGeometry(5, 5, 3, 8);
    var matWheel = new THREE.MeshPhongMaterial({
        color: Colors.black,
        shading: THREE.FlatShading
    });
    var frontWheel = new THREE.Mesh(geomWheel, matWheel);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(30, -28, 0);
    this.mesh.add(frontWheel);

    // Landing Gear - Left
    var leftGear = new THREE.Mesh(geomFrontGear, matGear);
    leftGear.position.set(-10, -20, 25);
    this.mesh.add(leftGear);

    // Left Wheel
    var leftWheel = new THREE.Mesh(geomWheel, matWheel);
    leftWheel.rotation.z = Math.PI / 2;
    leftWheel.position.set(-10, -28, 25);
    this.mesh.add(leftWheel);

    // Landing Gear - Right
    var rightGear = new THREE.Mesh(geomFrontGear, matGear);
    rightGear.position.set(-10, -20, -25);
    this.mesh.add(rightGear);

    // Right Wheel
    var rightWheel = new THREE.Mesh(geomWheel, matWheel);
    rightWheel.rotation.z = Math.PI / 2;
    rightWheel.position.set(-10, -28, -25);
    this.mesh.add(rightWheel);

    // Afterburner effects (for animation)
    var geomAfterburner = new THREE.CylinderGeometry(3, 6, 10, 8, 1);
    var matAfterburner = new THREE.MeshPhongMaterial({
        color: Colors.yellow,
        transparent: true,
        opacity: 0.7,
        shading: THREE.FlatShading
    });
    
    // Left Afterburner
    this.afterburnerLeft = new THREE.Mesh(geomAfterburner, matAfterburner);
    this.afterburnerLeft.position.set(-27, 0, 35);
    this.afterburnerLeft.rotation.x = Math.PI / 2;
    this.afterburnerLeft.scale.set(0.5, 0.5, 0.5); // Start small
    this.mesh.add(this.afterburnerLeft);
    
    // Right Afterburner
    this.afterburnerRight = new THREE.Mesh(geomAfterburner, matAfterburner);
    this.afterburnerRight.position.set(-27, 0, -35);
    this.afterburnerRight.rotation.x = Math.PI / 2;
    this.afterburnerRight.scale.set(0.5, 0.5, 0.5); // Start small
    this.mesh.add(this.afterburnerRight);

    // Pilot
    this.pilot = new Pilot();
    this.pilot.mesh.position.set(15, 27, 0);
    this.pilot.mesh.scale.set(0.8, 0.8, 0.8); // Slightly smaller pilot for the modern plane
    this.mesh.add(this.pilot.mesh);

    // Set shadow properties for the entire plane
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
};

// Add a method to animate the plane (similar to the original plane's propeller animation)
ModernPlane.prototype.updateAfterburner = function() {
    // Animate the afterburners with a pulsing effect
    var scaleAdjust = Math.random() * 0.3;
    this.afterburnerLeft.scale.set(0.5 + scaleAdjust, 0.5 + scaleAdjust, 0.8 + scaleAdjust);
    this.afterburnerRight.scale.set(0.5 + scaleAdjust, 0.5 + scaleAdjust, 0.8 + scaleAdjust);
    
    // Update pilot's hair animation if the pilot has updateHairs method
    if (this.pilot.updateHairs) {
        this.pilot.updateHairs();
    }
};
