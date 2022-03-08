import { CardDiscardBox, ToolbarButton, buttonToggle, nextHandler, startHandler, workLateHandler, pickUpCard } from "../activity_cards/GameBoard";
import { loadActivityCardStack, shuffleCardStack } from "../cards-management";

export default class teamToolbar extends Phaser.Scene {
    constructor (config, gameData) {
        this.gameData = gameData;
        super(config);
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
        // TODO: Adjust these parameters
        this.x = this.cameras.main.centerX;
        this.y = this.cameras.main.centerY;
        this.width = this.cameras.main.displayWidth;
        this.height = this.cameras.main.displayHeight;

        this.add.rectangle(this.x, this.y, this.width, this.height, 0x023047); // Toolbar background


        // TODOL Adjust coordinates and scaling
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
    }

    update() {

    }
}