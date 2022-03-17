import { colours, fonts } from "../theme.js";
import { CenterButton } from "../menuButtons.js";

export default class options extends Phaser.Scene {
    constructor() {
        super({key: "options"});
    }
    
    create(data) {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background")); // background
        this.add.rectangle(this.x, this.y*0.17, this.width, this.y*0.35, colours.get("toolbar")); // header bar
        this.add.text(this.x, this.y*0.17, 'Options', fonts.get("h2")).setOrigin(0.5);

        this.roundLengths = [15, 30, 60, 120];
        this.eventCardPerRounds = [1, 2, 3, 4, 5];
        this.workLatePerTeams = [1, 2, 3, 4];
        

        this.roundLength = this.roundLengths.indexOf(data[0]);
        this.eventCardPerRound = this.eventCardPerRounds.indexOf(data[1]);
        this.workLatePerTeam = this.workLatePerTeams.indexOf(data[2]);



        this.add.text(this.x, this.y*0.5, "Round Length:", fonts.get("h3")).setOrigin(0.5);
        this.buttonRoundLength = new CenterButton(this, 0.65, this.roundLengths[this.roundLength] + " seconds", () => { nextRoundLength(this) });

        this.add.text(this.x, this.y*0.85, "Event Cards Per Round:", fonts.get("h3")).setOrigin(0.5);
        this.buttonEventCards = new CenterButton(this, 1.0, this.eventCardPerRounds[this.eventCardPerRound], () => { nextEventCardPerRound(this) });

        this.add.text(this.x, this.y*1.2, "Work Late Tiles Per Team:", fonts.get("h3")).setOrigin(0.5);
        this.buttonWorkLate = new CenterButton(this, 1.35, this.workLatePerTeams[this.workLatePerTeam], () => { nextWorkLatePerTeam(this) });

        new CenterButton(this, 1.7, "Back to menu", () => {
            let d = [this.roundLengths[this.roundLength], this.eventCardPerRounds[this.eventCardPerRound], this.workLatePerTeams[this.workLatePerTeam]]
            this.scene.start('mainMenu', d);
        });
        
    }
}



function nextRoundLength(scene) {
    if (scene.roundLength == scene.roundLengths.length-1) {
        scene.roundLength = 0;
    } else {
        scene.roundLength++;
    }
    scene.buttonRoundLength.buttonText.setText(scene.roundLengths[scene.roundLength] + " seconds");
}

function nextEventCardPerRound(scene) {
    if (scene.eventCardPerRound == scene.eventCardPerRounds.length-1) {
        scene.eventCardPerRound = 0;
    } else {
        scene.eventCardPerRound++;
    }
    scene.buttonEventCards.buttonText.setText(scene.eventCardPerRounds[scene.eventCardPerRound]);
}

function nextWorkLatePerTeam(scene) {
    if (scene.workLatePerTeam == scene.workLatePerTeams.length-1) {
        scene.workLatePerTeam = 0;
    } else {
        scene.workLatePerTeam++;
    }
    scene.buttonWorkLate.buttonText.setText(scene.workLatePerTeams[scene.workLatePerTeam]);
}