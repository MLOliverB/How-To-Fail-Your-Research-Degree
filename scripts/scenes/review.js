import { buttonToggle, ToolbarButton } from "../activity_cards/gameBoard.js";

export default class review extends Phaser.Scene {
    constructor() {
        super({key: "review"});
    }
    
    create(data) {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.teams = data[0];
        this.numberOfTeams = data[1];
        this.currentTeam = 0;
        console.log(this.teams);
        console.log(this.numberOfTeams);

        //new Menu(this);
        new BoardViewer(this)
    }
}



/**
 * The "game over" menu which first appears after finishing the game
 */
class Menu {
    constructor(scene) {
        this.scene = scene;

        this.scene.add.rectangle(this.scene.x, this.scene.y, this.scene.width, this.scene.height, 0xffffff);
        this.scene.add.text(this.scene.x, this.scene.y*0.2, "Game Over", {color: "0x000000"}).setOrigin(0.5).setFontSize(30);

        this.next = this.scene.add.rectangle(this.scene.x, this.scene.y, this.scene.width*0.3, this.scene.height*0.1, 0x6c95b7).setInteractive();
        this.next.on("pointerup", () => {
            this.next.disableInteractive();     // redundant but just in case this button somehow gets clicked again...
            new BoardViewer(this.scene);
        });
        this.scene.add.text(this.scene.x, this.scene.y, "Review the boards", {color: "0x000000"}).setOrigin(0.5);
    }
}



/**
 * The main section of this scene
 * Allows the user to view all the final boards and information about any cards
 * Doesn't allow the user to modify anything
 */
class BoardViewer {
    constructor(scene) {
        scene.add.rectangle(scene.x, scene.y, scene.width, scene.height, 0xede0d4);    							// background
		scene.add.rectangle(scene.x, scene.y*0.77, scene.width, scene.height, 0xf4a261).setScale(0.98, 0.75);	// playing board
		scene.add.rectangle(scene.x, scene.y*1.95, scene.width, scene.height, 0x023047).setScale(1, 0.2);		// toolbar
        scene.label = new ToolbarButton(scene, 1, 0.1, "Team 1", undefined, undefined, undefined);
        buttonToggle(scene.label.button, 0, false);
        scene.left = new TriangleButton(scene, 0.83, 1);
        scene.right = new TriangleButton(scene, 1.17, 0);
    }
}



/**
 * A triangle button on the toolbar which cycles between teams when clicked
 */
class TriangleButton {
    /**
     * @param {*} scene 
     * @param {Integer} x X position of the button on the toolbar
     * @param {Integer} direction The "direction" to cycle the teams in (0 = forwards, 1 = backwards)
     */
    constructor(scene, x, direction) {
        this.scene = scene;
        this.disabled = false;
        
        // triangle points right when moving forwards, and vice versa
        if (direction == 0) {
            this.button = scene.add.triangle(scene.x*x, scene.y*1.875, 0, 100, 100, 50, 0, 0, 0xb1cfe0).setScale(0.54).setInteractive();
            if (scene.numberOfTeams == 1) {
                buttonToggle(this.button, 0, false);
                this.disabled = true;
            }
        } else {
            this.button = scene.add.triangle(scene.x*x, scene.y*1.875, 0, 50, 100, 100, 100, 0, 0xb1cfe0).setScale(0.54).setInteractive();
            buttonToggle(this.button, 0, false);
            this.disabled = true;
        }
        
		this.button.on("pointerover", () => { this.button.setFillStyle(0x6c95b7); });
		this.button.on("pointerout", () => {
            if (!this.disabled) {
                this.button.setFillStyle(0xb1cfe0);
            }
        });
		this.button.on("pointerup", () => { this.moveTeam(direction) });

        
    }


    /**
     * Moves between teams
     * @param {Integer} direction The "direction" to cycle the teams in (0 = forwards, 1 = backwards)
     */
    moveTeam(direction) {
        // unloading current team



        // updating variables/buttons to move to next team
        if (direction == 0) {   // cycle forwards
            console.log("Next team")
            this.scene.currentTeam++;
            if (this.scene.currentTeam == this.scene.numberOfTeams-1) {
                buttonToggle(this.scene.right.button, 0, false);
                this.scene.right.disabled = true;
            }
            buttonToggle(this.scene.left.button, 0, true);
        } else {    // cycle backwards
            console.log("Previous team")
            this.scene.currentTeam--;
            if (this.scene.currentTeam == 0) {
                buttonToggle(this.scene.left.button, 0, false);
                this.scene.left.disabled = true;
            }
            buttonToggle(this.scene.right.button, 0, true);
        }
        this.scene.label.buttonText.setText("Team " + (this.scene.currentTeam+1));


        // loading the current team
    }
}



/**
 * Makes a team visible/invisible
 * @param {*} scene 
 * @param {Integer} team The number of the team (starting from 0)
 * @param {Boolean} isVisible Whether the team should be visible
 */
function teamToggle(scene, team, isVisible) {
    console.log("hi")
    let cards = scene.teams[scene.currentTeam].get("cards")[team];
    for (let i = 0; i < cards.length; i++) {
        console.log(cards[i])
        /*
        if (cards[i].cardId != 0) {
            cards[i].setVisible(true, false);
        }
        */
       
        cards[i].placementBox.setVisible(isVisible);
        cards[i].cardText.setVisible(isVisible);
        cards[i].cardImage.setVisible(isVisible);
        if (cards[i].hasWorkLate) {
            cards[i].workLateImage.setVisible(isVisible);
        }
    }
}