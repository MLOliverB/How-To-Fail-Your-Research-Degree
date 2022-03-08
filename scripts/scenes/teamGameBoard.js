import { AddCardBox, CardBox } from "../activity_cards/GameBoard";

export default class teamGameBoard extends Phaser.Scene {
    constructor (config, gameData) {
        this.gameData = gameData;
        super(config);

        this.middlePosition = 0;
        this.leftEdge = 0;
        this.rightEdge = 0;
        this.isPlayerHoldingWorkLate = false;
        this.cards = [];
        this.addCardBoxes = [];
        this.workLateTiles = gameData.totalWorkLateTiles;
    }

    preload() {
        // Preload card images
        for (let id in this.gameData.cardMap) {
            this.load.image(this.gameData.cardMap[id], "./assets/cards/".concat(this.gameData.cardMap[id].image)).start();
        }

        // Preload work late tile image separately
        this.load.image("workLate", "./assets/cards/worklate.png").start();
    }

    create() {
        // TODO adjust the camera settings
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;


        
        // TODO adjust the size
        this.add.rectangle(this.x, this.y, this.width, this.height, 0xf4a261); // playing Board


        for (let i = 0; i < this.gameData.numberOfTeams; i++) {
            var card = new CardBox(this, 0);
            this.cards.push([card]);
            card.setVisible(false);
            var card = new AddCardBox(this, -1);
            card.setVisible(false);
            var card = new AddCardBox(this, 1);
            card.setVisible(false);
        }

    }

    update() {

    }
}