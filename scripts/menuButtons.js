import { colours, fonts } from "./theme.js"

class SidebarButton {
    /**
     * Creates a button on the sidebar
     * @param {*} scene 
     * @param {*} y Vertical position on sidebar
     * @param {*} text Text displayed on button
     * @param {*} click Function to carry out when clicked
     */
    constructor(scene, y, text, click) {
        this.button = scene.add.rectangle(scene.x*2-scene.x*0.5/2, scene.y*y, scene.x*0.35, scene.height*0.09, colours.get("button")).setInteractive();
        this.button.on("pointerover", () => { this.button.setFillStyle(colours.get("buttonHover")); });
        this.button.on("pointerout", () => { this.button.setFillStyle(colours.get("button")); });
        this.button.on("pointerup", () => { click(); });
        this.buttonText = scene.add.text(scene.x*2-scene.x*0.5/2, scene.y*y, text, fonts.get("h3")).setOrigin(0.5);
    }
}



class CenterButton {
    /**
     * Creates a button on the sidebar
     * @param {*} scene 
     * @param {*} y Vertical position on sidebar
     * @param {*} text Text displayed on button
     * @param {*} click Function to carry out when clicked
     */
    constructor(scene, y, text, click) {
        this.button = scene.add.rectangle(scene.x, scene.y*y, scene.x*0.4, scene.height*0.09, colours.get("buttonEvent")).setInteractive();
        this.button.on("pointerover", () => { this.button.setFillStyle(colours.get("buttonEventHover")); });
        this.button.on("pointerout", () => { this.button.setFillStyle(colours.get("buttonEvent")); });
        this.button.on("pointerup", () => { click(); });
        this.buttonText = scene.add.text(scene.x, scene.y*y, text, fonts.get("h3Light")).setOrigin(0.5);
    }
}




export { SidebarButton, CenterButton }