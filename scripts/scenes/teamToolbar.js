import { CardDiscardBox, ToolbarButton, buttonToggle, nextHandler, startHandler, workLateHandler, pickUpCard } from "../activity_cards/GameBoard.js";
import { loadActivityCardStack, shuffleCardStack } from "../cards-management.js";

export default class teamToolbar extends Phaser.Scene {
    constructor (gameData) {
		super({key: "teamToolbar"});
        this.gameData = gameData;

        this.timer;
        this.isTimerRunning = false;
        this.currentCard = 0;
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
		
		buttonToggle(this.toolbarNext.button, 0, false);
		buttonToggle(this.toolbarStart.button, 0, false);
		buttonToggle(this.toolbarWorkLate.button, 0, false);
		buttonToggle(this.toolbarDiscard.button, 0, false);
		buttonToggle(this.currentCardBox, 1, false);




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
					buttonToggle(this.toolbarStart.button, 0, true);
				}
			});
		}

		this.scene.bringToTop(this);
    }

    update() {

    }
}