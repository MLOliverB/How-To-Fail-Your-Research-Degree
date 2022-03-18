import { CardDiscardBox, ToolbarButton, FacilitatorModeButton, buttonToggle, nextHandler, startHandler, workLateHandler, pickUpCard, displayCardInfo } from "../activity_cards/GameBoard.js";
import { EventCard, ActivityCard, EventBarButton, pickUpEventCard, playHandler, storeHandler, activityStoreHandler, finishHandler, inventoryHandler, actInventoryHandler, flipHandler } from "../event_cards/eventBoard.js";
import { loadActivityCardStack, loadEventCardStack, shuffleCardStack } from "../cards-management.js";
import { colours, fonts } from "../theme.js";

export default class teamToolbar extends Phaser.Scene {
    constructor (gameData) {
		super({key: "teamToolbar"});
        this.gameData = gameData;

		this.lastPlayedCard;								// The CardBox object of the activity card which was most recently played in a stage
		this.isEventRound = false;
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

        this.forceFinish = 0;                 				  // force the event card effect to end once this number reaches 5 (if bugging happens)
        
        this.activityInventoryOpen = false;

		this.isFacilitatorModeActive = false;

        this.timer;
        this.isTimerRunning = false;
        this.currentCard = 0;
		this.currentEventCard = 0;
    }

    preload() {
		// Load work late tile image
		if (!this.gameData.game.textures.exists("workLate")) {
            this.load.image("workLate", "./assets/cards/worklate.png");
        }
		let preloader = this;
		// Load all other card images
        this.gameData.cardMap.forEach(async function(card, id) {
            if (card != null && !preloader.gameData.game.textures.exists(id)) {
                preloader.load.image(id, "./assets/cards/".concat(card.image));
            }
        });

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
        // TODO: Adjust these parameters
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.add.rectangle(this.x, this.y*1.95, this.width, this.height*0.2, 0x023047); // Toolbar background


        // TODOL Adjust coordinates and scaling
        this.currentCardBox = this.add.rectangle(this.x, this.y*1.76, this.width, this.height, 0xe76f51).setScale(0.162, 0.204);	// card the player is holding
		this.currentCardBox.on("pointerover", () => {
			if (this.currentCard == 0) {
				this.currentCardBox.setFillStyle(0xb6563e);
			}
		});
		this.currentCardBox.on("pointerout", () => {
			this.currentCardBox.setFillStyle(0xe76f51);
		});
		this.currentCardBox.on("pointerup", () => {
			if (this.currentCard == 0) {
				pickUpCard(this);
				this.currentCardBox.setFillStyle(0xe76f51);
			}
		});
		this.currentCardText = this.add.text(this.x, this.y*1.76, "+", {color: "0x000000"}).setOrigin(0.5).setFontSize(32);	// text displayed on the box for the card the player is holding
		this.currentCardImage = this.add.image(this.x, this.y*1.76, 2).setScale(0.3).setVisible(false);						// image displayed on the current card box
		
		this.workLateImage = this.add.image(this.x*0.7, this.y*1.63, "workLate").setScale(0.12).setVisible(false);				// image displayed of the work late tile
		
		this.currentStageText = this.add.text(this.x, this.y*0.09, "Stage: 1", {color: "0x000000"}).setOrigin(0.5).setFontSize(28);
		this.currentTeamText = this.add.text(this.x, this.y*0.18, "Team: 1", {color: "0x000000"}).setOrigin(0.5).setFontSize(28);
		this.timerText = this.add.text(this.x*0.3, this.y*0.13, "Time Remaining: "+this.gameData.roundLength+"s", {color: "0x000000"}).setOrigin(0.5).setFontSize(20);
		
		this.toolbarNext = new ToolbarButton(this, 0.15, 0.14, "Next Player", nextHandler, undefined, undefined);		// button to move to next player/stage
		this.toolbarStart = new ToolbarButton(this, 0.43, 0.12, "Start", startHandler, undefined, undefined);			// button to start the game
		this.toolbarWorkLate = new ToolbarButton(this, 0.7, 0.12, "Work Late\nTiles: "+this.gameData.teams[this.gameData.currentTeam].workLateTiles, workLateHandler, undefined, undefined);	// button to use work late tiles
		this.toolbarDiscard = new CardDiscardBox(this, 1.33, 1.875, 0.15, 0.1);	// button for discarding the currently held card (Only possible to discard cards that are impossible to play)
		if (this.numberOfTeams == 0) this.toolbarNext.buttonText.setText("Next Round");
		
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
		this.activityCards = [[], [], [], []];
		for (let s = 1; s < 5; s++) {
			loadActivityCardStack(s, (cards) => {
				let stageIX = cards[0].stage - 1;
				this.activityCards[stageIX] = shuffleCardStack(cards);
				let complete = true;
				for (let i = 0; i < this.activityCards.length; i++) {
					if (this.activityCards[i].length == 0) {
						complete = false;
						break;
					}
				}
				if (complete) { // Once all stacks have been loaded, enable the game to be played (by pressing the timer start button)
					buttonToggle(this.toolbarStart, 0, true);
				}
			});
		}


		//// EVENT CARDS ////
		this.eventStack = this.add.image(this.x*1.81, this.y*1.55, 'e1').setScale(0.47).setInteractive().setVisible(false);
		this.eventStack.setDepth(20);
		this.eventStack.on("pointerup", () => {
			console.log("Clicked on Event stack");
			if (this.isFacilitatorModeActive) {
				let id = this.currentEventCard;
				if (id != 0) { displayCardInfo(this, id) }
			} else if (this.eventCardsRemaining <= 0) {
				console.log("Error: no more event cards to be picked up this round");
            } else if (this.currentEventCard == 0) {
                try {
					pickUpEventCard(this);
					this.gameData.eventCardsRemaining--;
                }
                catch (error) {
                    if (this.gameData.stage == 0) {
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

		this.scene.bringToTop(this);
    }

    update() {

    }
}