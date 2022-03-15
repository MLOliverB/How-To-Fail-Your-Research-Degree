import { CardBox, AddCardBox, CardDiscardBox, ToolbarButton, FacilitatorModeButton, buttonToggle, nextHandler, startHandler, workLateHandler, pickUpCard, displayCardInfo } from "../activity_cards/gameBoard.js";
import { EventCard, ActivityCard, EventBarButton, pickUpEventCard, playHandler, storeHandler, activityStoreHandler, finishHandler, inventoryHandler, actInventoryHandler, flipHandler } from "../event_cards/eventBoard.js";
import { loadActivityCardStack, loadEventCardStack, loadAllCardsPromise, shuffleCardStack } from "../cards-management.js";
import { colours, fonts } from "../theme.js";

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
		
		//loading event card back images
		this.load.image('e1', './assets/cards/event-BACK-CONTEXT.png');
        this.load.image('e2', './assets/cards/event-BACK-IMP.png');
        this.load.image('e3', './assets/cards/event-BACK-WRITE-UP.png');
        
        // loading activity card back images
        this.load.image('a0', './assets/cards/BACK-act-plan.png');
        this.load.image('a1', './assets/cards/BACK-act-context.png');
        this.load.image('a2', './assets/cards/BACK-act-imp.png');
        this.load.image('a3', './assets/cards/BACK-act-write-up.png');
	}
    
    create() {
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;
		
		
		
		/// GUI (part 1) ////
		// gui is split up to prevent the background images from covering up the cards
        this.add.rectangle(this.x, this.y, this.width, this.height, colours.get("background"));    			// background
		this.add.rectangle(this.x, this.y*1.95, this.width, this.height, colours.get("toolbar")).setScale(1, 0.2);		// toolbar
		
		
		
		//// VARIABLES ////
		this.stage = 0;							// Stages: (-1)=Pre-game, 0=Plan, 1=Context, 2=Implementation, 3=Write Up
		this.numberOfTeams = 1;					// TODO: get this to recieve numberOfTeams from start menu!
		this.currentTeam = -1;

		this.lastPlayedCard;					// The CardBox object of the activity card which was most recently played in a stage
		
		this.roundLength = 30;					// The maximum length of each round in seconds (TODO: get this from menu)
		this.timer;
		this.isTimerRunning = false;
		
		this.isEventRound = false;
		this.totalEventCards = 3;							// TODO: get the number of event cards per round from menu
		this.eventCardsRemaining = this.totalEventCards;	// The number of event cards drawn each round
        this.previousCardArray = new Array();               // previous event card array before making changes
        this.blockedOut = false;
        this.numberBlocked = 0;                             // number of card box(es) blocked out
        this.ignored = false;
        this.flipState = false;                             // can flip card on board if set to true
        this.numberFlipped = 0;                             // number of activity card(s) flipped
        this.flipped = false;                               // flipped cards cannot be changed
        this.completeEffect = false;
		this.isInventoryOpen = false;
        
        this.activityInventoryOpen = false;

		this.isFacilitatorModeActive = false;
		
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
				["eventCards", []],					// a 1D array of event card ids that the team has in their inventory
                ["activityCards", []],              // a 1D array of activity card ids that the team has in their inventory
				["addCardBoxes", []],				// a 1D array of the current set of add card box buttons (not in order) - this is reset after every stage
				["workLateTiles", totalWorkLate],	// the number of work late tiles the team has remaining in their inventory
                ["currentEventCard", 0],             // id of event card player is holding
                ["ignoreEff", []],                   // a 1D array of event card ids that can be used to ignore other effect cards (toIgnore)
                ["toIgnore", []],                    // a 1D array of event card ids that can be ignored by other effect cards (ignoreEff)
                ["unusedCards", []]                  // a 1D array of card boxes that are unused/empty (save for event stage use)
			]);
			team.set("eventCards", [new EventCard(this, 0, 0), new EventCard(this, 0, 1), new EventCard(this, 0, 2)]);
            team.set("activityCards", [new ActivityCard(this, 0, null, 0), new ActivityCard(this, 0, null, 1), new ActivityCard(this, 0, null, 2)]);
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
		this.currentCardBox = this.add.rectangle(this.x, this.y*1.76, this.width, this.height, colours.get("cardStack")).setScale(0.162, 0.204);	// card the player is holding
		this.currentCardBox.on("pointerover", () => {
			if (this.teams[this.currentTeam].get("currentCard") == 0) {
				this.currentCardBox.setFillStyle(colours.get("cardStackHover"));
			}
		});
		this.currentCardBox.on("pointerout", () => {
			this.currentCardBox.setFillStyle(colours.get("cardStack"));
		});
		this.currentCardBox.on("pointerup", () => {
			if (this.teams[this.currentTeam].get("currentCard") == 0) {
				pickUpCard(this);
			}
		});
		this.currentCardText = this.add.text(this.x, this.y*1.76, "+", fonts.get("button")).setOrigin(0.5).setFontSize(50);	// text displayed on the box for the card the player is holding
		this.currentCardImage = this.add.image(this.x, this.y*1.76, 2).setScale(0.3).setVisible(false);						// image displayed on the current card box
		
		this.workLateImage = this.add.image(this.x*0.7, this.y*1.63, "workLate").setScale(0.12).setVisible(false);				// image displayed of the work late tile
		
		this.currentStageText = this.add.text(this.x*0.05, this.y*0.04, "Stage: 1", fonts.get("button")).setFontSize(35);
		this.currentTeamText = this.add.text(this.x*0.05, this.y*0.18, "Team: 1", fonts.get("button")).setFontSize(35);
		this.timerText = this.add.text(this.x, this.y*0.13, "Time Remaining: "+this.roundLength+"s", fonts.get("button")).setOrigin(0.5).setFontSize(30);
		
		this.toolbarNext = new ToolbarButton(this, 0.15, 0.14, "Next Team", nextHandler, undefined, undefined);		// button to move to next player/stage
		this.toolbarStart = new ToolbarButton(this, 0.43, 0.12, "Start", startHandler, undefined, undefined);			// button to start the game
		this.toolbarWorkLate = new ToolbarButton(this, 0.7, 0.12, "Work Late\nTiles: "+totalWorkLate, workLateHandler, undefined, undefined);	// button to use work late tiles
		this.toolbarDiscard = new CardDiscardBox(this, 1.33, 1.875, 0.15, 0.1);	// button for discarding the currently held card (Only possible to discard cards that are impossible to play)
		if (this.numberOfTeams == 0) this.toolbarNext.buttonText.setText("Next Round");


		// Button for skipping to review mode - only enable while testing for quick access
		/*
		this.review = this.add.rectangle(this.x*1.69, this.y*0.3, this.width, this.height, 0xb1cfe0).setScale(0.27, 0.07).setInteractive();
		this.review.on("pointerover", () => { this.review.setFillStyle(0x6c95b7); });
		this.review.on("pointerout", () => { this.review.setFillStyle(0xb1cfe0); });
		this.review.on("pointerup", () => {
			let cards = [];
			for (let i = 0; i < this.numberOfTeams; i++) {
				cards.push(this.teams[i].get("cards"));
			}
			this.scene.start("review", [cards, this.numberOfTeams, this.cardMap]);
		});
		this.reviewText = this.add.text(this.x*1.69, this.y*0.3, "Review Mode", {color: "0x000000"}).setOrigin(0.5).setFontSize(15);
		*/


		buttonToggle(this.toolbarNext, 0, false);
		buttonToggle(this.toolbarStart, 0, false);
		buttonToggle(this.toolbarWorkLate, 0, false);
		buttonToggle(this.toolbarDiscard, 0, false);
		buttonToggle(this.currentCardBox, 1, false);
		
		this.eventBarPlay = new EventBarButton(this, 1.5, 1, 0.1, "Play", playHandler, undefined, undefined);						// button to play the event card
		this.eventBarStore = new EventBarButton(this, 1.3, 1, 0.1, "Store\nEvent", storeHandler, undefined, undefined);					// button to store the event card
		this.eventBarFinish = new EventBarButton(this, 1.5, 1, 0.1, "Finish", finishHandler, undefined, undefined);					// button to finish playing the event card
        this.eventBarFlip = new EventBarButton(this, 1.3, 1, 0.1, "Flip Cards", flipHandler, undefined, undefined);	                // button to cause cards to be flipped	
		this.eventBarInventory = new EventBarButton(this, 0.7, 1, 0.12, "Event\nInventory", inventoryHandler, undefined, undefined); 	// button to open/close the event card inventory
        this.eventBarActStore = new EventBarButton(this, 0.43, 1, 0.12, "Store\nActivity", activityStoreHandler, undefined, undefined); // button to store activity card
        this.eventBarActInventory = new EventBarButton(this, 0.15, 1, 0.14, "Activity\nInventory", actInventoryHandler, undefined, undefined); // button to open/close activity card inventory
		this.eventBarPlay.setVisible(false);
		this.eventBarStore.setVisible(false);
		this.eventBarFinish.setVisible(false);
        this.eventBarFlip.setVisible(false);
		this.eventBarInventory.setVisible(false);
        this.eventBarActStore.setVisible(true);
        this.eventBarActInventory.setVisible(true);

		this.facilitatorModeButton = new FacilitatorModeButton(this);

		
		// creating a button to pick up a card from the stack
		this.activityCards = [];
		for (let s = 1; s < 5; s++) {
			loadActivityCardStack(s, (cards) => {
				this.activityCards.push(shuffleCardStack(cards));
				if (s == 4) { // Once all stacks have been loaded, enable the game to be played (by pressing the timer start button)
					buttonToggle(this.toolbarStart, 0, true);
				}
			});
		}
		
		
		
		//// EVENT CARDS ////
		this.eventStack = this.add.image(this.x*1.81, this.y*1.55, 'e1').setScale(0.235).setInteractive().setVisible(false);
		this.eventStack.setDepth(20);
		this.eventStack.on("pointerup", () => {
			if (this.isFacilitatorModeActive) {
				let id = this.teams[this.currentTeam].get("currentEventCard");
				if (id != 0) { displayCardInfo(this, id) }
			} else if (this.eventCardsRemaining <= 0) {
				console.log("Error: no more event cards to be picked up this round");
            } else if (this.teams[this.currentTeam].get("currentEventCard") == 0) {
                try {
					pickUpEventCard(this);
					this.eventCardsRemaining--;
                }
                catch (error) {
                    if (this.stage == 0) {
                        console.log("Error: no event cards\nReason: First stage has no event cards");
                    }
                    else {
                        console.log(error);
                    }
                }
            }
        });

		
		this.eventCards = [[], [], [], []];
        for (let s = 2; s < 5; s++) {
            loadEventCardStack(s, (ecards) => {
				//console.log(ecards)
				let ix = ecards[0].stage - 1;
                this.eventCards[ix] = shuffleCardStack(ecards);
            });
        }
		
		
    }
    
    update() {
        
    }
}
