import { colours, fonts } from "../theme.js";
import { CenterButton } from "../menuButtons.js";

export default class options extends Phaser.Scene {
    constructor() {
        super({key: "options"});
    }
    
    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background")); // background
        this.add.rectangle(this.x, 50, this.width, 100, colours.get("toolbar")); // header bar
        this.add.text(this.x, 50, 'Options', fonts.get("h2")).setOrigin(0.5);

        new CenterButton(this, 0.6, "Option A", () => { alert("Coming soon...")});
        new CenterButton(this, 0.8, "Option B", () => { alert("Coming soon...")});
        new CenterButton(this, 1.7, "Back to menu", () => this.scene.start('mainMenu'));
    }
}
