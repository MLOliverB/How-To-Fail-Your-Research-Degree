export default class options extends Phaser.Scene {
    constructor() {
        super({key: "options"});
    }
    
    create() {
        this.add.text(10, 50, 'Options', { font: '30px Courier', fill: '#29379b' });
        this.add.text(10, 100, "Example Option A", { font: "20px Courier", fill: "#3260b5" });
        this.add.text(10, 145, "Example Option B", { font: "20px Courier", fill: "#3260b5" });
        this.add.text(10, 550, "Back to menu", { font: "30px Courier", fill: "#3260b5" }).setInteractive().on("pointerdown", () => this.scene.start('mainMenu'));
    }
}
