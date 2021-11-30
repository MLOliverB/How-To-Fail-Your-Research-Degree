/**
 * Interactive button that when clicked runs a function
 * Help from https://snowbillr.github.io/blog/2018-07-03-buttons-in-phaser-3/
 */
export class button extends Phaser.GameObjects {
    constructor(scene, w, h, buttonText, functionOnClick) {
        background = this.add.rectangle(w, h, fillColor = 0x008080);
        button = this.add.text(100, 100, buttonText, {} ).setTint(0xfff)
            .setInteractive({ useHandCursor: true }) //apply to all setInteractive elements in game when valid
            .on("pointerdown", () => functionOnClick())
            .on("pointerover", () => this.buttonHover())
            .on("pointerout", () => this.buttonOut());
    }

    buttonHover() {
        background.setTint(0x045D5D);
    }

    buttonOut() {
        background.setTint(0x008080);
    }

}