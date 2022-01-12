import { loadActivityCard } from "../cards-management.js";

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
		
		this.placementBox = this.scene.add.rectangle(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.stage))), this.scene.width, this.scene.height, 0xb1cfe0).setScale(0.108, 0.136).setInteractive();
		this.placementBox.on("pointerover", () => { this.placementBox.setFillStyle(0x6c95b7); });
		this.placementBox.on("pointerout", () => { this.placementBox.setFillStyle(0xb1cfe0); });
		this.placementBox.on("pointerup", () => { this.updateCardBox(); });
		this.cardName = this.scene.add.text(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.stage))), '0', {color: "0x000000"}).setOrigin(0.5);
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
			//TODO - replace the next 2 lines with adding the card images
			this.cardName.setText(this.cardId);
			this.scene.currentCardBox.setText(0);
		}
		
		// a card can only be picked up if the player is not holding a card and the card box has a card
		else if (!isPlayerHoldingCard && this.cardId != 0) {
			console.log("Pick up the card");
			this.scene.currentCard = this.cardId;
			this.cardId = 0;
			//TODO - replace the next 2 lines with removing the card images
			this.cardName.setText(0);
			this.scene.currentCardBox.setText(this.scene.currentCard);
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
		
		// the first box on the "right" does not need a multiplier
		var distanceMultiplier = this.distanceFromMiddle;
		if (this.distanceFromMiddle > 0) {
			distanceMultiplier--;
		}
		
		this.buttonBox = this.scene.add.rectangle(this.scene.x+this.scene.x*(0.14+0.28*distanceMultiplier), this.scene.y*(1.33-(0.31*(this.scene.stage))), this.scene.width, this.scene.height,0xb1cfe0).setScale(0.023, 0.136).setInteractive();
		this.buttonBox.on("pointerover", () => {this.buttonBox.setFillStyle(0x6c95b7);});
		this.buttonBox.on("pointerout", () => {this.buttonBox.setFillStyle(0xb1cfe0);});
		this.buttonBox.on("pointerup", () => this.addBox());
		this.scene.add.text(this.scene.x+this.scene.x*(0.14+0.28*distanceMultiplier), this.scene.y*(1.33-(0.31*(this.scene.stage))), '+', {color: "0x000000"}).setOrigin(0.5);
	}
	
	/**
	 * Adds a new card box in the correct positions
	*/
	addBox() {
		console.log("Add a card box");
		
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
					this.scene.cards[this.scene.stage][i].cardName.text = previousCardId;	//TODO replace this with moving the image instead
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
					this.scene.cards[this.scene.stage][i].cardName.text = previousCardId;	//TODO replace this with moving the image instead
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

			function discardable(cardDiscardBox) {
				console.log("Card can't be played");
				cardDiscardBox.buttonBox.alpha = 1;
				cardDiscardBox.buttonText.alpha = 1;
				cardDiscardBox.buttonText.text = "  Can\nDiscard";
				cardDiscardBox.buttonBox.setFillStyle(cardDiscardBox.colorAction);
				cardDiscardBox.canBeDiscarded = true;
			}
			function undiscardable (cardDiscardBox) {
				console.log("Card can be played");
				cardDiscardBox.buttonBox.alpha = 0.5;
				cardDiscardBox.buttonText.alpha = 1;
				cardDiscardBox.buttonText.text = "  Can't\nDiscard";
				cardDiscardBox.buttonBox.setFillStyle(cardDiscardBox.colorNoAction);
				cardDiscardBox.canBeDiscarded = false;
			}
			
			if (this.scene.stage != 0) { // All planning stage cards are connected to each other, so we only need to worry about the other stages
				// record all indexes in the grid where a card could be placed
				freePositions = []
				for (let i = 0; i < this.scene.cards[this.scene.stage].length; i++) {
					if (this.scene.cards[this.scene.stage][i] == 0) {
						freePositions.push(i);
					}
				}
				// Recursive callback loop function to check whether the current card is legal to place at any of the free positions
				function checkPlacements(currentCard, freePositions, discardable, undiscardable, cardDiscardBox) {
					console.log(freePositions.length);
					if (freePositions.length == 0) { // If there are no free positions, the current card can't be played
						discardable(cardDiscardBox);
					} else {
						ix = freePositions.pop();
						console.log(ix);
						// Load the cards the left, the right, and the bottom of the current free position
						loadActivityCard((ix == 0) ? 0 : cardDiscardBox.scene.cards[cardDiscardBox.scene.stage][ix-1], (leftCard) => {
							loadActivityCard((ix == cardDiscardBox.scene.cards[cardDiscardBox.scene.stage].length-1) ? 0 : cardDiscardBox.scene.cards[cardDiscardBox.scene.stage][ix+1], (rightCard) => {
								loadActivityCard(cardDiscardBox.scene.cards[cardDiscardBox.scene.stage-1][ix], (bottomCard) => {
									// A card is legal to place if it is connected to at least one card and if the edges of adjacent cards are the same
									let leftAligned = false;
									let leftConnected = false;
									let rightAligned = false;
									let rightConnected = false;
									let bottomAligned = false;
									let bottomConnected = false;
									let currentCardPlacements = currentCard.placement.split(",");
									let leftCardPlacements = leftCard.placement.split(",");
									let rightCardPlacements = rightCard.placement.split(",");
									let bottomCardPlacements = bottomCard.placement.split(",");
									if (leftCard != null) {
										leftAligned = (leftCardPlacements[1] == currentCardPlacements[0]);
										leftConnected = (leftCardPlacements[1] == '1');
									} else {
										leftAligned = true;
										leftConnected = false;
									}
									if (rightCard != null) {
										rightAligned = (rightCardPlacements[0] == currentCardPlacements[1]);
										rightConnected = (rightCardPlacements[0] == '1');
									} else {
										rightAligned = true;
										rightConnected = false;
									}
									if (bottomCard != null) {
										bottomAligned = (bottomCardPlacements[2] == currentCardPlacements[3]);
										bottomConnected = (bottomCardPlacements[2] == '1');
									} else {
										bottomAligned = true;
										bottomConnected = false;
									}
									// If the card is placable in the current position, the user is not allowed to discard it
									// Else we check the next placement
									if (leftAligned && rightAligned && bottomAligned && (leftConnected || rightConnected || bottomConnected)) {
										undiscardable(cardDiscardBox);
									} else {
										checkPlacements(currentCard, freePositions, discardable, undiscardable, cardDiscardBox)
									}
								});
							});
						});
					}
				}
				loadActivityCard(this.scene.playerHoldingCard, (currentCard) => {
					if (currentCard != null) {
						checkPlacements(currentCard, freePositions, discardable, undiscardable, this);
					} else {
						undiscardable(this);
					}
				});
			} else {
				undiscardable(this);
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
				this.buttonBox.alpha = 1;
				this.buttonText.alpha = 1;
				this.buttonText.text = "Discarded";
				this.buttonBox.setFillStyle(this.colorDiscarded);
			}
		});
	}
}



/**
* Updates variables to move to the next scene
*/
function goToNextStage(scene) {
	console.log("Go to next stage");
	scene.cards.push(new Array(this.scene.cards[this.scene.stage-1].length).fill(0));	//add array the length of the previous array
	scene.stage += 1;
}



/**
* Removes the top card from the stack and sets the id to the card the player is currently holding
*/
function pickUpCard(scene) {
	console.log("Pick up a card");
	if (scene.currentCard == 0) {
		//TODO update scene.currentCard so that it actually picks up a card, and remove the card that is picked up from the stack (issue #31)
		scene.currentCard = scene.activityCards[scene.stage].pop().id;
		
		scene.currentCardBox.setText(scene.currentCard);
		
		
		//TODO add something to actually check if the stack is empty (issue #31)
		var stackIsEmpty = false;
		if (stackIsEmpty) {
			goToNextStage(scene);
		}
	}
}

/**
 * Take an id for an activity card and return the associated image filename
 */
function activityImageName(id) {
	return loadActivityCard(id).image;
}

/**
 * Take an id for an event card and return the associated image filename
 */
function eventImageName(id) {
	return loadEventCard(id).image;
}

export { CardBox, AddCardBox, CardDiscardBox, goToNextStage, pickUpCard };