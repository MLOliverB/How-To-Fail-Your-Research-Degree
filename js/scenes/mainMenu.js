import { button } from "js/button.js";

/**
 * Scene for the main menu screen of the game
 */
class main_menu extends Phaser.Scene {

    constructor() {
        super("mainMenu");
    }

    preload() {
    }

    create() {
        this.add.rectangle(fillColor = 0xa9e3ff,);
        this.add.text("How to Fail Your Research Degree");
        this.add.button(this, 200, 100, "Start Game", scene.scene.start(numberOfTeams));
    }

    update() {

    }
}

