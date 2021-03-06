import { colours, fonts } from "../theme.js";
import { SidebarButton } from "../menuButtons.js";

export default class mainMenu extends Phaser.Scene {
    constructor() {
        super({key: "mainMenu"});
    }
    
    create(data) {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background")); // background
        this.add.rectangle(this.x*2-this.x*0.5/2, this.y, this.x*0.5, this.height, colours.get("toolbar")); // sidebar
        this.add.text(this.x-this.x*0.5/2, this.y, "How to Fail Your\nResearch Degree", fonts.get("h1")).setOrigin(0.5);
        this.events.on('shutdown', this.shutdown, this);

        if (data[0] == undefined) {
            data = [30, 3, 4];
        }

        new SidebarButton(this, 0.68, "Start Game", () => this.scene.start("numberOfTeams", data));
        new SidebarButton(this, 0.68*2, "Options", () => this.scene.start("options", data));
    }
    
    shutdown() {
        //  We need to clear keyboard events, or they'll stack up when the mainMenu is re-run
        this.input.keyboard.shutdown();
    }
}