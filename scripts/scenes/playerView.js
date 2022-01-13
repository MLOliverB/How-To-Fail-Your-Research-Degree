import { CardBox, AddCardBox, CardDiscardBox, ToolbarButton, goToNextStage, pickUpCard, activityImageName, eventImageName } from "../activity_cards/GameBoard.js";
import { loadActivityCardStack, shuffleCardStack } from "../cards-management.js";

/**
 * The scene where the player plays the game
 * Entry points: numberOfTeams, facilitatorDiscussion
 * Exit points: facilitatorDiscussion
*/
export default class playerView extends Phaser.Scene {
    constructor() {
        super({key: "playerView"});
    }
	
	preload() {
		// loading all card images
		let img;
		this.load.image("ï»¿1", "../../assets/cards/"+"act-CONTEXT-discusexperts-5.png");
		for (let i = 2; i <= 123; i++) {
			img = "act-CONTEXT-greatrefs-5.png";	//TODO: get the image name
			this.load.image(i, "../../assets/cards/"+img);
		}
	}
    
    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;
        
		
        // setting up the game board
        this.add.rectangle(this.x, this.y, this.width, this.height, 0xede0d4);    											// background
        this.add.rectangle(this.x, this.y*0.77, this.width, this.height, 0xf4a261).setScale(0.98, 0.75);					// playing board
        this.add.rectangle(this.x, this.y*1.95, this.width, this.height, 0x023047).setScale(1, 0.2);						// toolbar
        this.cardBox = this.add.rectangle(this.x, this.y*1.76, this.width, this.height, 0xe76f51).setScale(0.162, 0.204);	// card the player is holding
        this.cardBox.on("pointerover", () => {
            if (this.currentCard == 0) {
				this.cardBox.setFillStyle(0xb6563e);
			}
		});
        this.cardBox.on("pointerout", () => {
            this.cardBox.setFillStyle(0xe76f51);
		});
        this.cardBox.on("pointerup", () => {
			if (this.currentCard == 0) {
				pickUpCard(this);
                this.cardBox.setFillStyle(0xe76f51);
			}
		});
        this.currentCardBox = this.add.text(this.x, this.y*1.76, '+', {color: "0x000000"}).setOrigin(0.5).setFontSize(32);	// text displayed on the box for the card the player is holding
		this.currentCardImage = this.add.image(this.x, this.y*1.76, 2).setScale(0.3).setVisible(false);					//image displayed on the current card box
		


        // setting up the activity cards
        this.currentCard = 0;       // id of the card the player is holding - set to 0 if player is not holding a card
        this.middlePosition = 0;    // the position of the card that is rendered in the middle - only updated during stage 1
        this.leftEdge = 0;          // the position of the card furthest to the left
        this.rightEdge = 0;         // the position of the card furthest to the right
        this.cards = [];            // a 2D array of stages of card boxes, e.g. cards[0] will return the array of card boxes used in the first stage
        this.stage = 0;             // Stages: 0=Plan, 1=Context, 2=Implementation, 3=Write Up, 4=Finished
        
        // start with 1 empty card box and two buttons on either side to add more card boxes
        this.cards.push([new CardBox(this, 0)]);
        new AddCardBox(this, -1);
        new AddCardBox(this, 1);
        new CardDiscardBox(this, 1.33, 1.875, 0.15, 0.1); // Button for discarding the currently held card (Only possible to discard cards that are impossible to play)
        
		
		
		// a button to pick up a card from the stack
        this.activityCards = [];
        for (let s = 1; s < 5; s++) {
            loadActivityCardStack(s, (cards) => {
                this.activityCards.push(shuffleCardStack(cards));
                if (s == 4) { // Once all stacks have been loaded, the create the "pick up card" button
                    this.cardBox.setInteractive();
                }
            });
        }
		
		
		
		// button to move to next player/stage
		new ToolbarButton(this, 0.19, 0.18, "Next Player", goToNextStage, undefined, undefined);
		
        
        // setting up the board scrolling
        //var cardCamera = this.cameras.add(400, 30, this.width*0.98, this.height*0.75)
        //cardCamera.setBounds(this.width*0.01, this.height*0.01, 400, 300);
		
		//var img = eventImageName(1);
		//console.log(img);
    }
    
    update() {
        
    }
}
