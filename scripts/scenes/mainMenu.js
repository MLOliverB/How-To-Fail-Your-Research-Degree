export default class mainMenu extends Phaser.Scene {
    constructor() {
        super({key: "mainMenu"});
    }
    
    create() {
        this.add.text(10, 10, 'How to Fail Your Research Degree', { font: '36px Courier', fill: '#29379b' });
        this.add.text(10, 70, "Start Game", { font: "30px Courier", fill: "#3260b5" }).setInteractive().on("pointerdown", () => this.scene.start('numberOfTeams'));
        this.add.text(10, 110, "Options", { font: "30px Courier", fill: "#3260b5" }).setInteractive().on("pointerdown", () => this.scene.start('options'));
        this.events.on('shutdown', this.shutdown, this);
    }
    
    shutdown() {
        //  We need to clear keyboard events, or they'll stack up when the mainMenu is re-run
        this.input.keyboard.shutdown();
    }
}