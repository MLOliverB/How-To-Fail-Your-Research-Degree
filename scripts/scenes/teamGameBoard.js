import { AddCardBox, CardBox } from "../activity_cards/GameBoard.js";
import teamToolbar from "./teamToolbar.js";
import { CardDiscardBox, ToolbarButton, buttonToggle, nextHandler, startHandler, workLateHandler, pickUpCard } from "../activity_cards/GameBoard.js";
import { EventCard, ActivityCard, EventBarButton, pickUpEventCard, playHandler, storeHandler, activityStoreHandler, finishHandler, inventoryHandler, actInventoryHandler, flipHandler } from "../event_cards/eventBoard.js";
import { loadActivityCardStack, shuffleCardStack } from "../cards-management.js";
import { colours, fonts } from "../theme.js";

export default class teamGameBoard extends Phaser.Scene {
    constructor (config, gameData, teamNumber) {
        super(config);
        this.gameData = gameData;
        this.teamNumber = teamNumber;

        this.middlePosition = 0;
        this.leftEdge = 0;
        this.rightEdge = 0;
        // this.isPlayerHoldingWorkLate = false;
        // this.cards = [];
        // this.addCardBoxes = [];
        // this.workLateTiles = gameData.totalWorkLateTiles;
    }

    preload() {
    }

    create() {
        // TODO adjust the camera settings
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;


        
        // TODO adjust the size
        this.background = this.add.rectangle(this.x, this.y, this.width, this.height, 0xf4a261); // playing Board

        var card = new CardBox(this, 0);
        this.gameData.teams[this.teamNumber].cards.push([card, ]);
        card.setVisible(true);
        var card = new AddCardBox(this, -1);
        card.setVisible(true);
        var card = new AddCardBox(this, 1);
        card.setVisible(true);
    }

    update() {

    }
}