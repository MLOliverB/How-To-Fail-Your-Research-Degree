import { CardBox, AddCardBox, goToNextStage, pickUpCard } from "../activity_cards/GameBoard.js";

/**
 * The scene where the player plays the game
 * Entry points: numberOfTeams, facilitatorDiscussion
 * Exit points: facilitatorDiscussion
*/
export default class playerView extends Phaser.Scene {
    constructor() {
        super({key: "playerView"});
    }
    
    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;
        
        // Game board components
        this.add.rectangle(this.x, this.y, this.width, this.height, 0xede0d4);    // background
        this.add.rectangle(this.x, this.y*0.77, this.width, this.height, 0xf4a261).setScale(0.98, 0.75);  // playing board
        this.add.rectangle(this.x, this.y*1.95, this.width, this.height, 0x023047).setScale(1, 0.2); // toolbar
        this.add.rectangle(this.x, this.y*1.76, this.width, this.height, 0xe76f51).setScale(0.162, 0.204); // card the player is holding
        this.currentCardBox = this.add.text(this.x, this.y*1.76, '0', {color: "0x000000"}).setOrigin(0.5);

        // Activity Cards
        this.currentCard = 0;       // id of the card the player is holding - set to 0 if player is not holding a card
        this.middlePosition = 0;    // the position of the card that is rendered in the middle - only updated during stage 1
        this.cards = [];            // a 2D array of stages of card boxes, e.g. cards[0] will return the array of card boxes used in the first stage
        this.stage = 0;             // Stages: 0=Plan, 1=Context, 2=Implementation, 3=Write Up, 4=Finished
        
        // start with 1 empty card box and two buttons on either side to add more card boxes
        this.cards.push([new CardBox(this, 0)]);
        new AddCardBox(this, -1);
        new AddCardBox(this, 1);
        
        pickUpCard(this);
    }
    
    update() {
        
    }
}
