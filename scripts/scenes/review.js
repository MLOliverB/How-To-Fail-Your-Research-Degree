import { buttonToggle, ToolbarButton, displayCardInfo } from "../activity_cards/gameBoard.js";

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
        this.cardMap = data[2];
        this.currentTeam = 0;

        new Menu(this);
        //new BoardViewer(this)
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

        // remaking all the cards onto this scene (the ones passed as data only appear on playerView scene)
        let teamsTemp = [];     // this will be replacing scene.teams after processing
        for (let i = 0; i < scene.numberOfTeams; i++) {                 // each team
            let team = [];
            for (let j = 0; j < scene.teams[i].length; j++) {           // each stage
                for (let k = 0; k < scene.teams[i][j].length; k++) {    // each card
                    if (scene.teams[i][j][k].cardId != 0) {
                        team.push(new ReviewCardBox(scene, scene.teams[i][j][k].cardId, scene.teams[i][j][k].distanceFromMiddle, scene.teams[i][j][k].stage, scene.teams[i][j][k].hasWorkLate));
                    }
                    //team.push(new ReviewCardBox(scene, scene.teams[i][j][k].cardId, scene.teams[i][j][k].distanceFromMiddle, scene.teams[i][j][k].stage, scene.teams[i][j][k].hasWorkLate));
                }
            }
            teamsTemp.push(team);
        }

        scene.teams = teamsTemp;
        
        // hiding all teams other than the first team
        for (let i = 1; i < scene.numberOfTeams; i++) {
            teamToggle(scene, i, false);
        }
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
        teamToggle(this.scene, this.scene.currentTeam, false);


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
        teamToggle(this.scene, this.scene.currentTeam, true);
    }
}



/**
 * A class which appears the same as CardBox but is stuck in facilitator mode
 */
class ReviewCardBox {
    /**
     * @param {Phaser.Scene} scene The scene to render this on
     * @param {Integer} id The id of this card
     * @param {Integer} distanceFromMiddle The distance the card is from the middle
     * @param {Integer} stage The stage the card is in
     * @param {Boolean} hasWorkLate Whether this card has a work late tile on it
     */
    constructor(scene, id, distanceFromMiddle, stage, hasWorkLate) {
        this.hasWorkLate = hasWorkLate;

        let xPos = scene.x*(1+0.225*distanceFromMiddle);
		let yPos = scene.y*(1.33-(0.31*stage));

        this.placementBox = scene.add.rectangle(xPos, yPos, scene.width, scene.height, 0xb1cfe0).setScale(0.108, 0.136).setInteractive();
        this.placementBox.on("pointerup", () => { displayCardInfo(scene, id) });
        this.placementBox.on("pointerover", () => { this.placementBox.setFillStyle(0x6c95b7); });
		this.placementBox.on("pointerout", () => { this.placementBox.setFillStyle(0xb1cfe0); });
        this.cardImage = scene.add.image(xPos, yPos, id).setScale(0.2);
        if (hasWorkLate) {
            this.workLateImage = scene.add.image(xPos, yPos, "workLate").setScale(0.17);
        }
    }
}



/**
 * Makes a team visible/invisible
 * @param {*} scene 
 * @param {Integer} team The number of the team (starting from 0)
 * @param {Boolean} isVisible Whether the team should be visible
 */
function teamToggle(scene, team, isVisible) {
    let cards = scene.teams[team];
    for (let i = 0; i < cards.length; i++) {
        cards[i].placementBox.setVisible(isVisible);
        cards[i].cardImage.setVisible(isVisible);
        if (cards[i].hasWorkLate) {
            cards[i].workLateImage.setVisible(isVisible);
        }
    }
}