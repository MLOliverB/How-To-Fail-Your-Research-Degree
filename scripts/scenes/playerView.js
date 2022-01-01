import { CardPlacementBox, AddCardPlacementBox, CardDiscardBox, goToNextStage } from "../activity_cards/GameBoard.js";

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
        this.add.rectangle(this.x, this.y, this.width, this.height, 0xede0d4);    //background
        this.add.rectangle(this.x, this.y*0.77, this.width, this.height, 0xf4a261).setScale(0.98, 0.75);  //playing board
        this.add.rectangle(this.x, this.y*1.95, this.width, this.height, 0x023047).setScale(1, 0.2); //toolbar
        this.add.rectangle(this.x, this.y*1.76, this.width, this.height, 0xe76f51).setScale(0.162, 0.204); //card

        // Activity Cards
        this.cards = [];	//a 2D array of stages of cards, e.g. cards[0] will return the array of card IDs used in the first stage
        this.stage = 0;	//Stages: 0=Plan, 1=Context, 2=Implementation, 3=Write Up
        this.cards.push([0]);	//start with 1 empty card placement box
        this.playerHoldingCard = 1;  //id of the card the player is olding - set to 0 if player is not holding a card

        new CardPlacementBox(this, 0, 0);
        new CardDiscardBox(this, 0.175, 0.125, 0.15, 0.1)
        
        
        
        //store cards in 2D array of arrays of cards (each array of cards is one stage)
        //on first stage:
        //begin with one location in the middle
        //once a card is added, display two empty locations on the outside edges
        //once another card is added, display button to add location between the cards
        
        //when the card is added, update the value at the position with the id of the card being added
        //locations need to store their index in the array
        //empty locations are represented by "0" in the array since indexing for cards starts at 1
        //
    }
    
    update() {
        
    }
}
