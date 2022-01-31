import { loadActivityCard, loadEventCard } from "../cards-management.js";

/**
 * Class for the rectangle which can be clicked to place a card on the rectangle
 */
class CardBox {
	/**
	 * @param {Phaser.Scene} scene The scene which this box should be displayed on
	 * @param {number} distanceFromMiddle The distance from the middle of the array that this card is (0 = middle, <0 = left, >0 = right)
	*/
	constructor(scene, distanceFromMiddle) {
		this.scene = scene;
		this.distanceFromMiddle = distanceFromMiddle;
		this.cardId = 0;
		
		console.log(this.scene.teams[1].get());
		this.placementBox = this.scene.add.rectangle(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.teams[this.scene.currentTeam].get("stage")))), this.scene.width, this.scene.height, 0xb1cfe0).setScale(0.108, 0.136).setInteractive();
		this.placementBox.on("pointerover", () => { this.placementBox.setFillStyle(0x6c95b7); });
		this.placementBox.on("pointerout", () => { this.placementBox.setFillStyle(0xb1cfe0); });
		this.placementBox.on("pointerup", () => { this.updateCardBox(); });
		this.cardText = this.scene.add.text(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.teams[this.scene.currentTeam].get("stage")))), "Place Card", {color: "0x000000"}).setOrigin(0.5).setFontSize(15);
		this.cardImage = this.scene.add.image(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.teams[this.scene.currentTeam].get("stage")))), 2).setVisible(false).setScale(0.2);
	}
	
	/**
	 * Either places a card or moves a card when a card box is clicked
	*/
	updateCardBox() {
		let variables = this.scene.teams[this.scene.currentTeam];
		
		var isPlayerHoldingCard = true;
		if (this.scene.teams[this.scene.currentTeam].get("currentCard") == 0) {
			isPlayerHoldingCard = false;
		}
		
		// a card can only be placed if the player is holding a card and the card box is empty
		if (isPlayerHoldingCard && this.cardId == 0) {
			console.log("Place a card");
			this.cardId = variables.get("currentCard");
			variables.set("currentCard", 0);
			
			this.cardText.setText(this.cardId);
			this.scene.currentCardText.setText("+");
			this.scene.currentCardImage.setVisible(false);
			this.cardImage.setVisible(true).setTexture(this.cardId);
		}
		
		// a card can only be picked up if the player is not holding a card and the card box has a card
		else if (!isPlayerHoldingCard && this.cardId != 0) {
			console.log("Pick up the card");
			variables.set("currentCard", this.cardId);
			this.cardId = 0;
			
			this.cardText.setText("Place Card");
			this.scene.currentCardText.setText(variables.get("currentCard"));
			this.scene.currentCardImage.setVisible(true).setTexture(variables.get("currentCard"));
			this.cardImage.setVisible(false);
		}
	}
}



/**
 * Class for the button which can be pressed to add a new location where a card can be placed
 */
class AddCardBox {
	/**
	 * @param {Phaser.Scene} scene The scene which this box should be displayed on
	 * @param {number} distanceFromMiddle The distance from the middle of the array that this add button is (<0 = left, >0 = right)
	*/
	constructor(scene, distanceFromMiddle) {
		this.scene = scene;
		this.distanceFromMiddle = distanceFromMiddle;
		this.scene.teams[this.scene.currentTeam].get("addCardBoxes").push(this);
		
		// the first box on the "right" does not need a multiplier
		var distanceMultiplier = this.distanceFromMiddle;
		if (this.distanceFromMiddle > 0) {
			distanceMultiplier--;
		}
		
		this.buttonBox = this.scene.add.rectangle(this.scene.x+this.scene.x*(0.14+0.28*distanceMultiplier), this.scene.y*(1.33-(0.31*(this.scene.teams[this.scene.currentTeam].get("stage")))), this.scene.width, this.scene.height,0xb1cfe0).setScale(0.023, 0.136).setInteractive();
		this.buttonBox.on("pointerover", () => {this.buttonBox.setFillStyle(0x6c95b7);});
		this.buttonBox.on("pointerout", () => {this.buttonBox.setFillStyle(0xb1cfe0);});
		this.buttonBox.on("pointerup", () => this.addBox());
		this.boxText = this.scene.add.text(this.scene.x+this.scene.x*(0.14+0.28*distanceMultiplier), this.scene.y*(1.33-(0.31*(this.scene.teams[this.scene.currentTeam].get("stage")))), '+', {color: "0x000000"}).setOrigin(0.5);
	}
	
	/**
	 * Adds a new card box in the correct positions
	*/
	addBox() {
		let variables = this.scene.teams[this.scene.currentTeam];
		let cards = variables.get("cards")[variables.get("stage")];
		
		console.log("Add a card box");
		
		// disable this box if it's any stage other than the first stage since cards can't be moved once they're placed on the other stages
		if (variables.get("stage") != 0) {
			this.buttonBox.disableInteractive().setVisible(false);
			this.boxText.setVisible(false);
		}
		
		// different code is needed depending on if the card is being added to the left or right of the centre card due how the rendering positions are calculated
		if (this.distanceFromMiddle < 0) {
			// adds new boxes at the furthest left edge
			let newBox = new CardBox(this.scene, variables.get("leftEdge")-1);
			new AddCardBox(this.scene, variables.get("leftEdge")-2);
			variables.set("leftEdge", variables.get("leftEdge") - 1);
			
			// updating cards array and related variables
			let position = variables.get("middlePosition")+this.distanceFromMiddle+1;
			cards.unshift(newBox);		//adding empty box to start of the array, the card ids will be shifted later
			variables.set("middlePosition", variables.get("middlePosition") + 1);
			
			
			// the distanceFromMiddle values of card boxes don't need to be updated if we only add at the start of the array
			if (position != 0) {
				let previousCardId = 0;
				for (let i = position; i >= 0; i--) {
					let currentCardId = cards[i].cardId;
					cards[i].cardId = previousCardId;
					if (previousCardId == 0) {
						cards[i].cardImage.setVisible(false);
						cards[i].cardText.text = "Place Card";
					} else {
						cards[i].cardImage.setVisible(true).setTexture(previousCardId);
						cards[i].cardText.text = previousCardId;
					}
					previousCardId = currentCardId;
				}
			}
		} else {
			// adds new boxes at the furthest right edge
			let newBox = new CardBox(this.scene, variables.get("rightEdge")+1);
			new AddCardBox(this.scene, variables.get("rightEdge")+2);
			variables.set("rightEdge", variables.get("rightEdge")+1);
			
			// updating cards array and related variables
			let position = variables.get("middlePosition")+this.distanceFromMiddle;
			cards.push(newBox);		//adding empty box to end of the array, the card ids will be shifted later
			
			// the distanceFromMiddle values of card boxes don't need to be updated if we only add at the end of the array
			if (position != cards.length-1) {
				let previousCardId = 0;
				for (let i = position; i < cards.length; i++) {
					let currentCardId = cards[i].cardId;
					cards[i].cardId = previousCardId
					cards[i].cardText.text = previousCardId;
					if (previousCardId == 0) {
						cards[i].cardImage.setVisible(false);
						cards[i].cardText.text = "Place Card";
					} else {
						cards[i].cardImage.setVisible(true).setTexture(previousCardId);
						cards[i].cardText.text = previousCardId;
					}
					previousCardId = currentCardId;
				}
			}
		}
		
		var out = "";
		for (let i = 0; i < cards.length; i++) {
			out += cards[i].cardId+", ";
		}
		console.log(out);
	}
}



/**
 * Class for the discard button. The button only works for cards which cannot be played on the current game board.
 */
class CardDiscardBox {

	/**
	 *
	 * @param {Phaser.scene} scene The scene which this box should be displayed on
	 * @param {number} relativeX X position of the discard button relative to the scene in range [0, 1]
	 * @param {number} relativeY Y position of the discard button relative to the scene in range [0, 1]
	 * @param {number} relativeWidth Width of the discard button relative to the scene in range [0, 1]
	 * @param {number} relativeHeight Height of the discard button relative to the scene in range [0, 1]
	 */
	constructor(scene, relativeX, relativeY, relativeWidth, relativeHeight) {
		this.scene = scene;
		this.canBeDiscarded = false;
		this.colorIdle = 0xb1cfe0
		this.colorNoAction = 0x9cacb8;
		this.colorAction = 0x6c95b7;
		this.colorDiscarded = 0xf82f2f;
		let variables = this.scene.teams[this.scene.currentTeam];
		let cards = variables.get("cards")[variables.get("stage")];

		// Draw the Button and button text on the scene
		this.button = this.scene.add.rectangle(this.scene.x * relativeX, this.scene.y * relativeY, this.scene.width * relativeWidth, this.scene.height * relativeHeight, this.colorIdle)
		this.buttonText = this.scene.add.text(this.scene.x * relativeX, this.scene.y * relativeY, "Discard", {color: "0x000000"});
		this.buttonText.setOrigin(0.5);

		// On hovering, we check whether the currently held card is playable
		this.button.on("pointerover", () => {
			console.log("Checking if current card can be discarded...");
			
			let isDiscardable = true;
			let currentCard = this.scene.cardMap.get(this.scene.currentCard);
			let freePositions = []

			if (variables.get("stage") == 0 || currentCard == null) {
				isDiscardable = false;
			} else {
				// record all indexes in the grid where a card could be placed
				freePositions.push(-1);
				for (let i = 0; i < cards.length; i++) {
					if (cards[i].cardId == 0) {
						freePositions.push(i);
					}
				}
				freePositions.push(cards.length);
			}

			// Check every possible free position to check whether card would be legal to place there
			while (freePositions.length > 0) {
				let ix = freePositions.pop();
				let leftCardId = (ix <= 0) ? 0 : cards[ix-1].cardId;
				let leftCard = this.scene.cardMap.get(leftCardId);
				let rightCardId = (ix >= cards.length-1) ? 0 : cards[ix+1].cardId;
				let rightCard = this.scene.cardMap.get(rightCardId);
				let bottomCardIx = ix + (cards[0].distanceFromMiddle - variables.get("cards")[variables.get("stage")-1][0].distanceFromMiddle);
				let bottomCardId = ((bottomCardIx < 0) || (bottomCardIx > variables.get("cards")[variables.get("stage")-1].length-1)) ? 0 : variables.get("cards")[variables.get("stage")-1][bottomCardIx].cardId;
				let bottomCard = this.scene.cardMap.get(bottomCardId);

				// A card is legal to place if it is connected to at least one card and if the edges of adjacent cards are the same
				let currentCardPlacements = currentCard.placement.split(",");
				let leftCardPlacements = (leftCard == null) ? ['1', '1', '1', '1'] : leftCard.placement.split(",");
				let rightCardPlacements = (rightCard == null) ? ['1', '1', '1', '1'] : rightCard.placement.split(",");
				let bottomCardPlacements = (bottomCard == null) ? ['1', '1', '1', '1'] : bottomCard.placement.split(",");

				let leftAligned = (leftCard == null) ? true : (leftCardPlacements[1] == currentCardPlacements[0]);
				let rightAligned = (rightCard == null) ? true : (rightCardPlacements[0] == currentCardPlacements[1]);
				let bottomAligned = (bottomCard == null) ? true : (bottomCardPlacements[2] == currentCardPlacements[3]);

				let leftConnected = (leftCard == null) ? false : (leftCardPlacements[1] == '1' && currentCardPlacements[0] == '1');
				let rightConnected = (rightCard == null) ? false : (rightCardPlacements[0] == '1' && currentCardPlacements[1] == '1');
				let bottomConnected = (bottomCard == null) ? false : (bottomCardPlacements[2] == '1' && currentCardPlacements[3] == '1');

				console.log(`Position (${variables.get("stage")}, ${ix})`);
				console.log(`Alignment - Left ${leftAligned}, Right ${rightAligned}, Bottom ${bottomAligned}`);
				console.log(`Connectivity - Left ${leftConnected}, Right ${rightConnected}, Bottom ${bottomConnected}`);
				// If the card is placable in the current position, the user is not allowed to discard it
				// Else we check the next placement
				if (leftAligned && rightAligned && bottomAligned && (leftConnected || rightConnected || bottomConnected)) {
					isDiscardable = false;
					break;
				}
			}


			if (isDiscardable) {
				console.log("Card can't be played");
				this.button.alpha = 1;
				this.buttonText.alpha = 1;
				this.buttonText.text = "  Can\nDiscard";
				this.button.setFillStyle(this.colorAction);
				this.canBeDiscarded = true;
			} else {
				console.log("Card can be played");
				this.button.alpha = 0.5;
				this.buttonText.alpha = 1;
				this.buttonText.text = "  Can't\nDiscard";
				this.button.setFillStyle(this.colorNoAction);
				this.canBeDiscarded = false;
			}
		});

		// Reset the appearance of the button when the mouse stops hovering over it
		this.button.on("pointerout", () => {
			this.canBeDiscarded = false;
			this.button.alpha = 1;
			this.buttonText.alpha = 1;
			this.buttonText.text = "Discard";
			this.button.setFillStyle(this.colorIdle);
		});

		// When attempting to press the button, only discard if the card is impossible to play (computed while hovering)
		this.button.on("pointerup", () => {
			if (this.canBeDiscarded) {
				this.canBeDiscarded = false;
				console.log("Discarding current card");
				this.scene.currentCard = 0;
				this.scene.currentCardText.setText("+");
				this.scene.currentCardImage.setVisible(false);
				this.button.alpha = 1;
				this.buttonText.alpha = 1;
				this.buttonText.text = "Discarded";
				this.button.setFillStyle(this.colorDiscarded);
			}
		});
	}
}



/**
 * A class for adding buttons on the toolbar
 */
class ToolbarButton {
	/**
	 * @param {Phaser.scene} scene The scene which this button will appear on
	 * @param {number} x The horizontal position of the button (from 0-1)
	 * @param {number} width The width of the button (from 0-1 as a fraction of the width of the screen)
	 * @param {text} label The text that will appear on the button
	 * @param {function} onClick The function that runs when the button is clicked (pass "undefined" for no action)
	 * @param {function} onOver The function that runs when the cursor is hovering over the button (pass "undefined" for no action)
	 * @param {function} onOut The function that runs when the cursor moves away from the button (pass "undefined" for no action)
	*/
	constructor(scene, x, width, label, onClick, onOver, onOut) {
		this.scene = scene;
		
		this.button = this.scene.add.rectangle(this.scene.x*x, this.scene.y*1.875, this.scene.width, this.scene.height, 0xb1cfe0).setScale(width, 0.10).setInteractive();
		if (onOver != undefined) {
			this.button.on("pointerover", () => { onOver(this.scene) });
		} else {
			this.button.on("pointerover", () => { this.button.setFillStyle(0x6c95b7); });
		}
		if (onOut!= undefined) {
			this.button.on("pointerout", () => { onOut(this.scene) });
		} else {
			this.button.on("pointerout", () => { this.button.setFillStyle(0xb1cfe0); });
		}
		if (onClick != undefined) {
			this.button.on("pointerup", () => { onClick(this.scene) });
		}
		this.buttonText = this.scene.add.text(this.scene.x*x, this.scene.y*1.875, label, {color: "0x000000"}).setOrigin(0.5).setFontSize(15);
	}
}



/**
 * Buttons turn grey when disabled
 * @param {Phaser.rectangle} button The button rectangle object which is to be enabled/disabled
 * @param {Integer} type The type of button (0 = ToolbarButton/CardDiscardBox, 1 = Pick up card button)
 * @param {Boolean} enable true = enable the button, false = disable the button
 */
function buttonToggle(button, type, enable) {
	// ToolbarButton or CardDiscardBox
	if (type == 0) {
		if (enable == true) {	// enabling the button
			button.setInteractive();
			button.setFillStyle(0xb1cfe0);
		} else {	// disabling the button
			button.disableInteractive();
			button.setFillStyle(0x939393);
		}
	}
	// Pick up card button
	else if (type == 1) {
		if (enable == true) {	// enabling the button
			button.setInteractive();
			button.setFillStyle(0xe76f51);
		} else {	// disabling the button
			button.disableInteractive();
			button.setFillStyle(0x939393);
		}
	}
}


/**
 * Decides whether to move to the next team or the next stage after the next button is pressed
 */
function nextHandler(scene) {
	console.log("Next Handler")
}



/**
 * Called when the Start Button timer is pressed
 * Runs the code to start (and end) a round of the game
 */
function startHandler(scene) {
	// the game was running when the button was pressed
	if (scene.isTimerRunning) {
		// TODO: stop the timer
		stopHandler(scene);
	}
	// the game was paused when the button was pressed
	else {
		// TODO: start the timer - run stopHandler(scene); once the timer is up
		scene.toolbarStart.buttonText.setText("Stop Timer")
		scene.isTimerRunning = true;
		
		buttonToggle(scene.toolbarNext.button, 0, false);
		buttonToggle(scene.toolbarDiscard.button, 0, true);
		buttonToggle(scene.currentCardBox, 1, true);
		
		//TODO: make cards for current round visible
	}
	
	
	/**
	 * Stops the timer and ends the current round
	 */
	function stopHandler(scene) {
		scene.isTimerRunning = false;
		scene.toolbarStart.buttonText.setText("Start Timer")
		
		buttonToggle(scene.toolbarNext.button, 0, true);
		buttonToggle(scene.toolbarStart.button, 0, false);
		buttonToggle(scene.toolbarDiscard.button, 0, false);
		buttonToggle(scene.currentCardBox, 1, false);
		
		//TODO: delete add card buttons from current round
	}
}



/**
 * Sets all the card boxes and add card boxes for the current player to be visible or invisible
 * @param {boolean} isVisible True = set to visible, False = set to invisible
 */
function toggleTeamVisibility(scene, isVisible) {
	//console.log(scene.stage);
	//console.log(isVisible + " " + scene.currentTeam);
	let variables = scene.teams[scene.currentTeam];
	
	for (let stage = 0; stage < scene.stage+1; stage++) {
		for (let card = 0; card < scene.cards[stage].length; card++) {
			variables.get("cards")[stage][card].placementBox.setVisible(isVisible);
			variables.get("cards")[stage][card].cardText.setVisible(isVisible);
			variables.get("cards")[stage][card].cardImage.setVisible(isVisible);
		}
		for (let button = 0; button < scene.addCardBoxes.length; button++) {
			variables.get("addCardBoxes")[button].buttonBox.setVisible(isVisible);
			variables.get("addCardBoxes")[button].boxText.setVisible(isVisible);
		}
	}
}



/**
 * Removes the top card from the stack and sets the id to the card the player is currently holding
 */
function pickUpCard(scene) {
	console.log("Pick up a card");
	let variables = scene.teams[scene.currentTeam];
	if (variables.get("currentCard") == 0) {
		variables.set("currentCard", scene.activityCards[variables.get("stage")].pop().id);
		scene.currentCardText.setText(variables.get("currentCard"));
		scene.currentCardImage.setVisible(true).setTexture(variables.get("currentCard"));
	}
}



export { CardBox, AddCardBox, CardDiscardBox, ToolbarButton, buttonToggle, nextHandler, startHandler, pickUpCard };
