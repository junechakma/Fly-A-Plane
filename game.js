// Make these functions globally accessible for the HTML onclick handlers
window.selectPlane = function(planeType) {
    // Prevent event bubbling
    event.stopPropagation();
    
    // Highlight the selected plane option
    document.getElementById('classicPlaneOption').classList.remove('selected');
    document.getElementById('modernPlaneOption').classList.remove('selected');
    document.getElementById(planeType + 'PlaneOption').classList.add('selected');
    
    // Store the selected plane type
    selectedPlaneType = planeType;
};

window.startGame = function(planeType) {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    console.log("Starting game with plane type:", planeType);
    
    // Set the selected plane type
    selectedPlaneType = planeType;
    
    // Hide the plane selection screen - try multiple approaches
    planeSelection = document.getElementById('planeSelection'); // Ensure we have the element
    console.log("Plane selection element:", planeSelection);
    
    if (planeSelection) {
        planeSelection.style.display = 'none';
        planeSelection.style.visibility = 'hidden'; // Add extra hiding
        console.log("Set display to none and visibility to hidden");
    }

    // Show the game controls
    gameControls = document.querySelector('.game-controls');
    if (gameControls) {
        gameControls.style.display = 'flex';
        console.log("Game controls displayed");
    }
    
    // Start the game if it hasn't already been initialized
    if (!airplane) {
        console.log("Initializing new game");
        init();
    } else {
        console.log("Resetting existing game");
        resetGame();
        hideReplay();
        scene.remove(airplane.mesh);
        createPlane();
    }
};

// Also modify the init function to ensure proper initialization
function init(event) {
    console.log("Initializing game...");
    
    // Initialize DOM elements
    fieldDistance = document.getElementById('distValue');
    fieldLevel = document.getElementById('levelValue');
    levelCircle = document.getElementById('levelCircleStroke');
    energyBar = document.getElementById('energyBar');
    replayMessage = document.getElementById("replayMessage");
    fieldHighScore = document.getElementById("highScoreValue");
    
    // Ensure plane selection is hidden
    planeSelection = document.getElementById('planeSelection');
    if (planeSelection) {
        planeSelection.style.display = 'none';
        planeSelection.style.visibility = 'hidden';
        console.log("Hiding plane selection menu during init");
    }
    
    // Show game controls
    gameControls = document.querySelector('.game-controls');
    if (gameControls) {
        gameControls.style.display = 'flex';
        console.log("Showing game controls during init");
    }

    // Rest of init function...
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

    loop();
}

// Combine select and start functions into one
window.selectAndStartGame = function(planeType) {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();
    
    // Store the selected plane type
    selectedPlaneType = planeType;
    
    // Update visual selection
    document.getElementById('classicPlaneOption').classList.remove('selected');
    document.getElementById('modernPlaneOption').classList.remove('selected');
    document.getElementById(planeType + 'PlaneOption').classList.add('selected');
    
    // Hide the plane selection screen
    planeSelection = document.getElementById('planeSelection');
    if (planeSelection) {
        planeSelection.style.display = 'none';
    }

    // Show the game controls
    gameControls = document.querySelector('.game-controls');
    if (gameControls) {
        gameControls.style.display = 'flex';
    }
    
    // Start the game
    if (!airplane) {
        init();
    } else {
        resetGame();
        hideReplay();
        scene.remove(airplane.mesh);
        createPlane();
    }
}; 