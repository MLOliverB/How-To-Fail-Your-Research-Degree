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
		
		console.log(this.distanceFromMiddle)
		this.placementBox = this.scene.add.rectangle(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.stage))), this.scene.width, this.scene.height, 0xb1cfe0).setScale(0.108, 0.136).setInteractive();
		//this.placementBox = this.scene.add.rectangle(this.scene.x*(1+0.28*(-1)), this.scene.y*(1.33-(0.31*(1))), this.scene.width, this.scene.height, 0xb1cfe0).setScale(0.108, 0.136).setInteractive();
		this.placementBox.on("pointerover", () => { this.placementBox.setFillStyle(0x6c95b7); });
		this.placementBox.on("pointerout", () => { this.placementBox.setFillStyle(0xb1cfe0); });
		this.placementBox.on("pointerup", () => { this.updateCardBox(); });
		this.cardName = this.scene.add.text(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.stage))), "Place Card", {color: "0x000000"}).setOrigin(0.5).setFontSize(15);
		this.cardImage = this.scene.add.image(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.stage))), 2).setVisible(false).setScale(0.2);
	}
	
	/**
	 * Either places a card or moves a card when a card box is clicked
	*/
	updateCardBox() {
		var isPlayerHoldingCard = true;
		if (this.scene.currentCard == 0) {
			isPlayerHoldingCard = false;
		}
		
		// a card can only be placed if the player is holding a card and the card box is empty
		if (isPlayerHoldingCard && this.cardId == 0) {
			console.log("Place a card");
			this.cardId = this.scene.currentCard;
			this.scene.currentCard = 0;
			
			this.cardName.setText(this.cardId);
			this.scene.currentCardBox.setText("+");
			this.scene.currentCardImage.setVisible(false);
			this.cardImage.setVisible(true).setTexture(this.cardId);
		}
		
		// a card can only be picked up if the player is not holding a card and the card box has a card
		else if (!isPlayerHoldingCard && this.cardId != 0) {
			console.log("Pick up the card");
			this.scene.currentCard = this.cardId;
			this.cardId = 0;
			
			this.cardName.setText("Place Card");
			this.scene.currentCardBox.setText(this.scene.currentCard);
			this.scene.currentCardImage.setVisible(true).setTexture(this.scene.currentCard);
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
		this.scene.addCardBoxes.push(this);
		
		// the first box on the "right" does not need a multiplier
		var distanceMultiplier = this.distanceFromMiddle;
		if (this.distanceFromMiddle > 0) {
			distanceMultiplier--;
		}
		
		this.buttonBox = this.scene.add.rectangle(this.scene.x+this.scene.x*(0.14+0.28*distanceMultiplier), this.scene.y*(1.33-(0.31*(this.scene.stage))), this.scene.width, this.scene.height,0xb1cfe0).setScale(0.023, 0.136).setInteractive();
		this.buttonBox.on("pointerover", () => {this.buttonBox.setFillStyle(0x6c95b7);});
		this.buttonBox.on("pointerout", () => {this.buttonBox.setFillStyle(0xb1cfe0);});
		this.buttonBox.on("pointerup", () => this.addBox());
		this.boxText = this.scene.add.text(this.scene.x+this.scene.x*(0.14+0.28*distanceMultiplier), this.scene.y*(1.33-(0.31*(this.scene.stage))), '+', {color: "0x000000"}).setOrigin(0.5);
	}
	
	/**
	 * Adds a new card box in the correct positions
	*/
	addBox() {
		console.log("Add a card box");
		console.log(this.distanceFromMiddle)
		
		// disable this box if it's any stage other than the first stage since cards can't be moved once they're placed on the other stages
		if (this.scene.stage != 0) {
			this.buttonBox.disableInteractive().setVisible(false);
			this.boxText.setVisible(false);
		}
		
		// different code is needed depending on if the card is being added to the left or right of the centre card due how the rendering positions are calculated
		if (this.distanceFromMiddle < 0) {
			// adds new boxes at the furthest left edge
			let newBox = new CardBox(this.scene, this.scene.leftEdge-1);
			new AddCardBox(this.scene, this.scene.leftEdge-2);
			this.scene.leftEdge--;
			
			// updating cards array and related variables
			let position = this.scene.middlePosition+this.distanceFromMiddle+1;
			this.scene.cards[this.scene.stage].unshift(newBox);		//adding empty box to start of the array, the card ids will be shifted later
			this.scene.middlePosition++;
			
			
			// the distanceFromMiddle values of card boxes don't need to be updated if we only add at the start of the array
			if (position != 0) {
				let previousCardId = 0;
				for (let i = position; i >= 0; i--) {
					let currentCardId = this.scene.cards[this.scene.stage][i].cardId;
					this.scene.cards[this.scene.stage][i].cardId = previousCardId
					if (previousCardId == 0) {
						this.scene.cards[this.scene.stage][i].cardImage.setVisible(false);
						this.scene.cards[this.scene.stage][i].cardName.text = "Place Card";
					} else {
						this.scene.cards[this.scene.stage][i].cardImage.setVisible(true).setTexture(previousCardId);
						this.scene.cards[this.scene.stage][i].cardName.text = previousCardId;
					}
					previousCardId = currentCardId;
				}
			}
		} else {
			// adds new boxes at the furthest right edge
			let newBox = new CardBox(this.scene, this.scene.rightEdge+1);
			new AddCardBox(this.scene, this.scene.rightEdge+2);
			this.scene.rightEdge++;
			
			// updating cards array and related variables
			let position = this.scene.middlePosition+this.distanceFromMiddle;
			this.scene.cards[this.scene.stage].push(newBox);		//adding empty box to end of the array, the card ids will be shifted later
			
			// the distanceFromMiddle values of card boxes don't need to be updated if we only add at the end of the array
			if (position != this.scene.cards[this.scene.stage].length-1) {
				let previousCardId = 0;
				for (let i = position; i < this.scene.cards[this.scene.stage].length; i++) {
					let currentCardId = this.scene.cards[this.scene.stage][i].cardId;
					this.scene.cards[this.scene.stage][i].cardId = previousCardId
					this.scene.cards[this.scene.stage][i].cardName.text = previousCardId;
					if (previousCardId == 0) {
						this.scene.cards[this.scene.stage][i].cardImage.setVisible(false);
						this.scene.cards[this.scene.stage][i].cardName.text = "Place Card";
					} else {
						this.scene.cards[this.scene.stage][i].cardImage.setVisible(true).setTexture(previousCardId);
						this.scene.cards[this.scene.stage][i].cardName.text = previousCardId;
					}
					previousCardId = currentCardId;
				}
			}
		}
		
		var out = "";
		for (let i = 0; i < this.scene.cards[this.scene.stage].length; i++) {
			out += this.scene.cards[this.scene.stage][i].cardId+", ";
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

		// Draw the Button and button text on the scene
		this.buttonBox = this.scene.add.rectangle(this.scene.x * relativeX, this.scene.y * relativeY, this.scene.width * relativeWidth, this.scene.height * relativeHeight, this.colorIdle)
		this.buttonBox.setInteractive();
		this.buttonText = this.scene.add.text(this.scene.x * relativeX, this.scene.y * relativeY, "Discard", {color: "0x000000"});
		this.buttonText.setOrigin(0.5);

		// On hovering, we check whether the currently held card is playable
		this.buttonBox.on("pointerover", () => {
			console.log("Checking if current card can be discarded...");
			
			let isDiscardable = true;
			let currentCard = this.scene.cardMap.get(this.scene.currentCard);
			let freePositions = []

			if (this.scene.stage == 0 || currentCard == null) {
				isDiscardable = false;
			} else {
				// record all indexes in the grid where a card could be placed
				freePositions.push(-1);
				for (let i = 0; i < this.scene.cards[this.scene.stage].length; i++) {
					if (this.scene.cards[this.scene.stage][i].cardId == 0) {
						freePositions.push(i);
					}
				}
				freePositions.push(this.scene.cards[this.scene.stage].length);
			}

			// Check every possible free position to check whether card would be legal to place there
			while (freePositions.length > 0) {
				let ix = freePositions.pop();
				let leftCardId = (ix <= 0) ? 0 : this.scene.cards[this.scene.stage][ix-1].cardId;
				let leftCard = this.scene.cardMap.get(leftCardId);
				let rightCardId = (ix >= this.scene.cards[this.scene.stage].length-1) ? 0 : this.scene.cards[this.scene.stage][ix+1].cardId;
				let rightCard = this.scene.cardMap.get(rightCardId);
				// TODO The arrays of the different stages become misaligned when expanding to the left in any stage other than the first one
				let bottomCardId = ((ix < 0) || (ix > this.scene.cards[this.scene.stage].length-1)) ? 0 : this.scene.cards[this.scene.stage-1][ix].cardId;
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

				console.log(`Position (${this.scene.stage}, ${ix})`);
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
				this.buttonBox.alpha = 1;
				this.buttonText.alpha = 1;
				this.buttonText.text = "  Can\nDiscard";
				this.buttonBox.setFillStyle(this.colorAction);
				this.canBeDiscarded = true;
			} else {
				console.log("Card can be played");
				this.buttonBox.alpha = 0.5;
				this.buttonText.alpha = 1;
				this.buttonText.text = "  Can't\nDiscard";
				this.buttonBox.setFillStyle(this.colorNoAction);
				this.canBeDiscarded = false;
			}
		});

		// Reset the appearance of the button when the mouse stops hovering over it
		this.buttonBox.on("pointerout", () => {
			this.canBeDiscarded = false;
			this.buttonBox.alpha = 1;
			this.buttonText.alpha = 1;
			this.buttonText.text = "Discard";
			this.buttonBox.setFillStyle(this.colorIdle);
		});

		// When attempting to press the button, only discard if the card is impossible to play (computed while hovering)
		this.buttonBox.on("pointerup", () => {
			if (this.canBeDiscarded) {
				this.canBeDiscarded = false;
				console.log("Discarding current card");
				this.scene.currentCard = 0;
				this.scene.currentCardBox.setText("+");
				this.scene.currentCardImage.setVisible(false);
				this.buttonBox.alpha = 1;
				this.buttonText.alpha = 1;
				this.buttonText.text = "Discarded";
				this.buttonBox.setFillStyle(this.colorDiscarded);
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
		this.cardName = this.scene.add.text(this.scene.x*x, this.scene.y*1.875, label, {color: "0x000000"}).setOrigin(0.5).setFontSize(15);
	}
}



/**
 * Updates variables to move to the next stage
*/
function goToNextStage(scene) {
	if (scene.stage > 2) {
		console.log("Error: Unable to go to the next stage\nReason: Already on the final stage");
		return;
	}
	
	console.log("Go to next stage");
	scene.stage += 1;
	
	// disabling all card boxes and add card box buttons from the previous stage
	for (let i in scene.cards[scene.stage-1]) {
		scene.cards[scene.stage-1][i].placementBox.disableInteractive()
	}
	for (let i in scene.addCardBoxes) {
		scene.addCardBoxes[i].buttonBox.disableInteractive().setVisible(false);
		scene.addCardBoxes[i].boxText.setVisible(false);
	}
	scene.addCardBoxes = [];	// resetting this array since the add card box buttons from the previous stage will not be needed again
	
	// setting up the card boxes (and other variables) for the next stage
	// start with the same number of boxes as the previous stage (including boxes without cards)
	scene.cards.push([]);
	for (let i in scene.cards[scene.stage-1]) {
		let distance = scene.cards[scene.stage-1][i].distanceFromMiddle
		scene.cards[scene.stage].push(new CardBox(scene, distance));
	}
	// only start with add card boxes on the outer edges
	scene.addCardBoxes.push(new AddCardBox(scene, scene.leftEdge-1));
	scene.addCardBoxes.push(new AddCardBox(scene, scene.rightEdge+1));
	
	
	// clearing the card the player is holding from the previous stage
	scene.currentCard = 0;
	scene.currentCardImage.setVisible(false);
	scene.currentCardBox.setText("+");
}



/**
 * Removes the top card from the stack and sets the id to the card the player is currently holding
*/
function pickUpCard(scene) {
	console.log("Pick up a card");
	if (scene.currentCard == 0) {
		scene.currentCard = scene.activityCards[scene.stage].pop().id;
		
		scene.currentCardBox.setText(scene.currentCard);
		scene.currentCardImage.setVisible(true).setTexture(scene.currentCard);
	}
}

export { CardBox, AddCardBox, CardDiscardBox, ToolbarButton, goToNextStage, pickUpCard };
