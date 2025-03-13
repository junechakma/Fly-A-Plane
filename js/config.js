/**
 * Game Configuration
 * Contains constants and configuration for the game
 */

// Colors
const Colors = {
    red: 0xf25346,
    white: 0xd8d0d1,
    brown: 0x59332e,
    brownDark: 0x23190f,
    pink: 0xF5986E,
    yellow: 0xf4ce93,
    blue: 0x68c3c0,
};

// Game default configuration
const GameConfig = {
    // Speed settings
    initSpeed: .00035,
    baseSpeed: .00035,
    targetBaseSpeed: .00035,
    incrementSpeedByTime: .0000025,
    incrementSpeedByLevel: .000005,
    distanceForSpeedUpdate: 100,
    
    // Distance and energy settings
    ratioSpeedDistance: 50,
    ratioSpeedEnergy: 3,
    distanceForLevelUpdate: 1000,
    
    // Plane settings
    planeDefaultHeight: 100,
    planeAmpHeight: 80,
    planeAmpWidth: 75,
    planeMoveSensivity: 0.005,
    planeRotXSensivity: 0.0008,
    planeRotZSensivity: 0.0004,
    planeFallSpeed: .001,
    planeMinSpeed: 1.2,
    planeMaxSpeed: 1.6,
    
    // Sea settings
    seaRadius: 600,
    seaLength: 800,
    wavesMinAmp: 5,
    wavesMaxAmp: 20,
    wavesMinSpeed: 0.001,
    wavesMaxSpeed: 0.003,
    
    // Camera settings
    cameraFarPos: 500,
    cameraNearPos: 150,
    cameraSensivity: 0.002,
    
    // Coin settings
    coinDistanceTolerance: 15,
    coinValue: 3,
    coinsSpeed: .5,
    distanceForCoinsSpawn: 100,
    
    // Enemy settings
    ennemyDistanceTolerance: 10,
    ennemyValue: 10,
    ennemiesSpeed: .6,
    distanceForEnnemiesSpawn: 50,
};
