import { colours, fonts } from "../theme.js";
import { CenterButton } from "../menuButtons.js";

export default class numberOfTeams extends Phaser.Scene {
    constructor() {
        super({key: "numberOfTeams"});
    }
    
    create(data) {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background")); // background
        this.add.rectangle(this.x, this.y*0.17, this.width, this.y*0.35, colours.get("toolbar")); // header bar
        this.add.text(this.x, this.y*0.17, 'Number of Teams', fonts.get("h2")).setOrigin(0.5);

        new CenterButton(this, 0.6, "One Team", () => { 
            data.push(1);
            this.scene.start('playerView', data)
        });
        new CenterButton(this, 0.8, "Two Teams", () => { 
            data.push(2);
            this.scene.start('playerView', data)
        });
        new CenterButton(this, 1.0, "Three Teams", () => { 
            data.push(3);
            this.scene.start('playerView', data)
        });
        new CenterButton(this, 1.2, "Four Teams", () => { 
            data.push(4);
            this.scene.start('playerView', data)
        });

        new CenterButton(this, 1.7, "Back to menu", () => this.scene.start('mainMenu', data));
    }
}
