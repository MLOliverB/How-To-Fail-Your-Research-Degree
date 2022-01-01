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
    }
}
