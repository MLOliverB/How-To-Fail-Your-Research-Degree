import { CardBox, AddCardBox, CardDiscardBox, ToolbarButton, buttonToggle, nextHandler, startHandler, workLateHandler, pickUpCard } from "../activity_cards/GameBoard.js";
import { loadActivityCardStack, loadAllCardsPromise, shuffleCardStack } from "../cards-management.js";

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
        // Creating a mapping from card id to card object
        this.cardMap = new Map();
        this.cardMap.set(0, null);
		// loading all card images
        // Reference: async loader code taken from https://pablo.gg/en/blog/games/how-to-load-assets-asynchronously-with-phaser-3/
        const asyncLoader = (loaderPlugin) => new Promise((resolve, reject) => {
            loaderPlugin.on('filecomplete', resolve).on('loaderror', reject);
            loaderPlugin.start();
        });
        const preloadCards = async () => {
            let cardsPromise = await loadAllCardsPromise();
            for (let i = 0; i < cardsPromise.length; i++) {
                this.cardMap.set(cardsPromise[i].id, cardsPromise[i]);
                await asyncLoader(this.load.image(cardsPromise[i].id, "./assets/cards/".concat(cardsPromise[i].image)));
            }
        };
        preloadCards();
		
		//loading the work late tile image
		this.load.image("workLate", "./assets/cards/worklate.png");
	}
    
    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;
		
		
		
		/// GUI (part 1) ////
		// gui is split up to prevent the background images from covering up the cards
        this.add.rectangle(this.x, this.y, this.width, this.height, 0xede0d4);    							// background
		this.add.rectangle(this.x, this.y*0.77, this.width, this.height, 0xf4a261).setScale(0.98, 0.75);	// playing board
		this.add.rectangle(this.x, this.y*1.95, this.width, this.height, 0x023047).setScale(1, 0.2);		// toolbar
		
		
		
		//// TEAMS ////
		this.stage = 0;							// Stages: (-1)=Pre-game, 0=Plan, 1=Context, 2=Implementation, 3=Write Up
		this.numberOfTeams = 2;					// TODO: get this to recieve numberOfTeams from start menu!
		this.currentTeam = -1;
		
		this.roundLength = 30;					// The maximum length of each round in seconds (TODO: get this from menu)
		this.timer;
		this.isTimerRunning = false;
		
		let totalWorkLate = 4;					// The number of work late tiles each team starts with (TODO: get number of work late tiles from menu)
		this.isPlayerHoldingWorkLate = false;	// Whether or not the player is currently holding a work late tile
		
		this.teams = []
		// creating a new map for each team - the map contains the variables for that team
		for (let i = 0; i < this.numberOfTeams; i++) {
			this.currentTeam++;
			let team = new Map([
				["currentCard", 0],					// id of the card the player is holding - set to 0 if player is not holding a card
				["middlePosition", 0],				// the position of the card that is rendered in the middle - only updated during stage 1
				["leftEdge", 0],					// the position of the card furthest to the left
				["rightEdge", 0],					// the position of the card furthest to the right
				["cards", []],						// a 2D array of stages of card boxes, e.g. cards[0] will return the array of card boxes used in the first stage
				["addCardBoxes", []],				// a 1D array of the current set of add card box buttons (not in order) - this is reset after every stage
				["workLateTiles", totalWorkLate]	// the number of work late tiles the team has remaining in their inventory
			]);
			this.teams.push(team);
		}
		this.currentTeam = -1;
		
		// in a separate loop from the one making the map since the constructor references values in this.teams
		for (let i = 0; i < this.numberOfTeams; i++) {
			this.currentTeam++;
			var card = new CardBox(this, 0);
			this.teams[i].get("cards").push([card]);
			card.setVisible(false);
			var card = new AddCardBox(this, -1);
			card.setVisible(false);
			var card = new AddCardBox(this, 1);
			card.setVisible(false);
		}
		this.currentTeam = 0;
		
		
		
		//// GUI (part 2) ////
		this.currentCardBox = this.add.rectangle(this.x, this.y*1.76, this.width, this.height, 0xe76f51).setScale(0.162, 0.204);	// card the player is holding
		this.currentCardBox.on("pointerover", () => {
			if (this.teams[this.currentTeam].get("currentCard") == 0) {
				this.currentCardBox.setFillStyle(0xb6563e);
			}
		});
		this.currentCardBox.on("pointerout", () => {
			this.currentCardBox.setFillStyle(0xe76f51);
		});
		this.currentCardBox.on("pointerup", () => {
			if (this.teams[this.currentTeam].get("currentCard") == 0) {
				pickUpCard(this);
				this.currentCardBox.setFillStyle(0xe76f51);
			}
		});
		this.currentCardText = this.add.text(this.x, this.y*1.76, "+", {color: "0x000000"}).setOrigin(0.5).setFontSize(32);	// text displayed on the box for the card the player is holding
		this.currentCardImage = this.add.image(this.x, this.y*1.76, 2).setScale(0.3).setVisible(false);						// image displayed on the current card box
		
		this.workLateImage = this.add.image(this.x*0.7, this.y*1.63, "workLate").setScale(0.12).setVisible(false);				// image displayed of the work late tile
		
		this.currentStageText = this.add.text(this.x, this.y*0.09, "Stage: 1", {color: "0x000000"}).setOrigin(0.5).setFontSize(28);
		this.currentTeamText = this.add.text(this.x, this.y*0.18, "Team: 1", {color: "0x000000"}).setOrigin(0.5).setFontSize(28);
		this.timerText = this.add.text(this.x*0.3, this.y*0.13, "Time Remaining: "+this.roundLength+"s", {color: "0x000000"}).setOrigin(0.5).setFontSize(20);
		
		this.toolbarNext = new ToolbarButton(this, 0.15, 0.14, "Next Player", nextHandler, undefined, undefined);		// button to move to next player/stage
		this.toolbarStart = new ToolbarButton(this, 0.43, 0.12, "Start", startHandler, undefined, undefined);			// button to start the game
		this.toolbarWorkLate = new ToolbarButton(this, 0.7, 0.12, "Work Late\nTiles: "+totalWorkLate, workLateHandler, undefined, undefined);	// button to use work late tiles
		this.toolbarDiscard = new CardDiscardBox(this, 1.33, 1.875, 0.15, 0.1);	// button for discarding the currently held card (Only possible to discard cards that are impossible to play)
		
		buttonToggle(this.toolbarNext.button, 0, false);
		buttonToggle(this.toolbarStart.button, 0, false);
		buttonToggle(this.toolbarWorkLate.button, 0, false);
		buttonToggle(this.toolbarDiscard.button, 0, false);
		buttonToggle(this.currentCardBox, 1, false);
		
		// creating a button to pick up a card from the stack
		this.activityCards = [];
		for (let s = 1; s < 5; s++) {
			loadActivityCardStack(s, (cards) => {
				this.activityCards.push(shuffleCardStack(cards));
				if (s == 4) { // Once all stacks have been loaded, enable the game to be played (by pressing the timer start button)
					buttonToggle(this.toolbarStart.button, 0, true);
				}
			});
		}
		
		
		
		//// OTHER ////
		this.isTimerRunning = false;
    }
    
    update() {
        
    }
}
