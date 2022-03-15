import { colours, fonts } from "../theme.js";
import { CenterButton } from "../menuButtons.js";

export default class numberOfTeams extends Phaser.Scene {
    constructor() {
        super({key: "numberOfTeams"});
    }
    
    create() {
        this.add.text(10, 50, 'How many teams are playing?', { font: '30px Courier', fill: '#29379b' });
        this.add.text(10, 100, "Two teams", { font: "20px Courier", fill: "#3260b5" }).setInteractive().on("pointerdown", () => this.scene.start('playerView', {playerNo: 2}));
        this.add.text(10, 145, "Three teams", { font: "20px Courier", fill: "#3260b5" }).setInteractive().on("pointerdown", () => this.scene.start('playerView', {playerNo: 3}));
        this.add.text(10, 190, "Four teams", { font: "20px Courier", fill: "#3260b5" }).setInteractive().on("pointerdown", () => this.scene.start('playerView', {playerNo: 4}));
        this.add.text(10, 550, "Back to menu", { font: "30px Courier", fill: "#3260b5" }).setInteractive().on("pointerdown", () => this.scene.start('mainMenu'));

        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background")); // background
        this.add.rectangle(this.x, 50, this.width, 100, colours.get("toolbar")); // header bar
        this.add.text(this.x, 50, 'Number of Teams', fonts.get("h2")).setOrigin(0.5);

        new CenterButton(this, 0.6, "One Team", () => this.scene.start('playerView', {playerNo: 1}));
        new CenterButton(this, 0.8, "Two Teams", () => this.scene.start('playerView', {playerNo: 2}));
        new CenterButton(this, 1.0, "Three Teams", () => this.scene.start('playerView', {playerNo: 3}));
        new CenterButton(this, 1.2, "Four Teams", () => this.scene.start('playerView', {playerNo: 4}));
        new CenterButton(this, 1.7, "Back to menu", () => this.scene.start('mainMenu'));
    }
}
