import { button } from "js/button.js";

/**
 * Scene to select the number of teams that will be playing the game
 */
class numberOfTeams {
    constructor() {
        super("numberOfTeams");
    };
    preload() {

    }
    create() {
        this.add.rectangle(fillColor = 0xa9e3ff,);
        this.add.text("Select the number of teams that will be playing:");

        //buttons
        this.add.button(this, 200, 100, "Two Teams", scene.scene.start(noOfTeams = 2))
        this.add.button(this, 200, 100, "Three Teams", scene.scene.start(noOfTeams = 3))
        this.add.button(this, 200, 100, "Four Teams", scene.scene.start(noOfTeams = 4))
    }

    update() {

    }
}