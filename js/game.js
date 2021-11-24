/**
 * Create and configure the game variable
 */
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [mainMenu, playerView]
}

var game = new Phaser.Game(config);