import { loadActivityCard } from "../cards-management.js";

// Class for the rectangle which can be clicked to place a card on the rectangle
class CardPlacementBox {
	constructor(scene, position, distanceFromMiddle) {
		this.scene = scene;
		this.position = position;
		this.distanceFromMiddle = distanceFromMiddle;
		this.hasCard = false;
		
		this.placementBox = this.scene.add.rectangle(this.scene.x*(1+0.42*this.distanceFromMiddle), this.scene.y*(1.2-(0.38*(this.scene.stage))), this.scene.width, this.scene.height, 0xb1cfe0).setScale(0.162, 0.204).setInteractive();
		this.placementBox.on("pointerover", () => {this.placementBox.setFillStyle(0x6c95b7);});
		this.placementBox.on("pointerout", () => {this.placementBox.setFillStyle(0xb1cfe0);});
		this.placementBox.on("pointerup", () => this.moveCard());
		this.cardName = this.scene.add.text(this.scene.x*(1+0.42*this.distanceFromMiddle), this.scene.y*(1.2-(0.38*(this.scene.stage))), 'Place Card', {color: "0x000000"}).setOrigin(0.5);
	}
	
	moveCard() {
		var isPlayerHoldingCard = true;
		if (this.scene.playerHoldingCard == 0) {
			isPlayerHoldingCard = false;
		}
		
		if (this.hasCard && !isPlayerHoldingCard) {
			console.log("Pick up card "+this.position);
			this.hasCard = false;
			this.cardName.setText(0);
			//this.scene.playerHoldingCard = this.scene.cards[scene.stage][this.position];
			this.scene.playerHoldingCard = 1;	//TODO: replace "1" with the card that is being picked up
			return;
		}
		if (!isPlayerHoldingCard || this.scene.cards[this.scene.stage][this.position] != 0) {
			return;
		}
		
		console.log("Place card "+this.position);
		this.hasCard = true;
		this.scene.playerHoldingCard = 0;
		
		let id = this.scene.playerHoldingCard;
		this.scene.cards[this.scene.stage][this.position] = id;	//inserts card id into the array of cards
		
		// if current card is at start of list, add new card to left
		var isLeftAdded = 0;
		if (this.position == 0) {
			isLeftAdded = 1;
			this.scene.cards[this.scene.stage].unshift(0);
			new CardPlacementBox(this.scene, 0, this.distanceFromMiddle-1);
			new AddCardPlacementBox(this.scene, 0, this.distanceFromMiddle-1);
		}
		// if current card is at end of list, add new card to the right
		if (this.position == this.scene.cards[this.scene.stage].length-1-isLeftAdded) {
			this.scene.cards[this.scene.stage].push(0);
			new CardPlacementBox(this.scene, this.scene.cards[this.scene.stage].length-1, this.distanceFromMiddle+1);
			new AddCardPlacementBox(this.scene, this.scene.cards[this.scene.stage].length-1, this.distanceFromMiddle+1);
		}
		
		//TODO - replace the next two lines with adding the card image
		this.placementBox.setFillStyle(0xed5e5e);
		this.cardName.setText(id);
		
		console.log(this.scene.cards[this.scene.stage]);
	}
}



// Class for the button which can be pressed to add a new location where a card can be placed
class AddCardPlacementBox {
	constructor(scene, position, distanceFromMiddle) {
		this.scene = scene;
		this.position = position;
		this.distanceFromMiddle = distanceFromMiddle;
		var distanceMultiplier = this.distanceFromMiddle;
		if (this.distanceFromMiddle > 0) {
			distanceMultiplier--;
		}
		
		this.buttonBox = this.scene.add.rectangle(this.scene.x+this.scene.x*(0.21+0.42*distanceMultiplier), this.scene.y*(1.2-(0.38*(this.scene.stage))), this.scene.width, this.scene.height,0xb1cfe0).setScale(0.035, 0.204).setInteractive();
		this.buttonBox.on("pointerover", () => {this.buttonBox.setFillStyle(0x6c95b7);});
		this.buttonBox.on("pointerout", () => {this.buttonBox.setFillStyle(0xb1cfe0);});
		this.buttonBox.on("pointerup", () => this.addBox());
		this.scene.add.text(this.scene.x+this.scene.x*(0.21+0.42*distanceMultiplier), this.scene.y*(1.2-(0.38*(this.scene.stage))), '+', {color: "0x000000"}).setOrigin(0.5);
	}
	
	addBox() {
		console.log("Add a card button");

		//TODO: make a new CardPlacementBox object and update the cards array with a new "empty" (0) value
			//this may require for the index position of this button to be stored
	}
}


// TODO Implement the actual discard action - i.e. discarding the currently held card and drawing a new one from the card stack
// Class for the button which can be pressed to discard the current card (there is a check whether it can be played beforehand)
class CardDiscardBox {
	constructor(scene, relativeX, relativeY, relativeWidth, relativeHeight) {
		this.scene = scene;
		this.colorIdle = 0xb1cfe0
		this.colorNoAction = 0x9cacb8;
		this.colorAction = 0x6c95b7;
		this.colorDiscarded = 0xf82f2f;

		this.buttonBox = this.scene.add.rectangle(this.scene.x * relativeX, this.scene.y * relativeY, this.scene.width * relativeWidth, this.scene.height * relativeHeight, this.colorIdle)
		this.buttonBox.setInteractive();
		this.buttonText = this.scene.add.text(this.scene.x * relativeX, this.scene.y * relativeY, "Discard", {color: "0x000000"});
		this.buttonText.setOrigin(0.5);

		this.buttonBox.on("pointerover", () => {
			loadActivityCard(5, (card) => {
				console.log(card);
			})
			console.log("Checking if current card can be discarded...");

			function discardable(cardDiscardBox) {
				console.log("Card can't be played");
				cardDiscardBox.buttonBox.alpha = 1;
				cardDiscardBox.buttonText.alpha = 1;
				cardDiscardBox.buttonText.text = "  Can\nDiscard";
				cardDiscardBox.buttonBox.setFillStyle(cardDiscardBox.colorAction);
			}
			function undiscardable (cardDiscardBox) {
				console.log("Card can be played");
				cardDiscardBox.buttonBox.alpha = 0.5;
				cardDiscardBox.buttonText.alpha = 1;
				cardDiscardBox.buttonText.text = "  Can't\nDiscard";
				cardDiscardBox.buttonBox.setFillStyle(cardDiscardBox.colorNoAction);
			}
			
			// TODO: Check if the card can be played on the game board
			if (this.scene.stage != 0) { // All planning stage cards are connected to each other, so no worries there :)
				freePositions = []
				for (let i = 0; i < this.scene.cards[this.scene.stage].length; i++) {
					if (this.scene.cards[this.scene.stage][i] == 0) {
						freePositions.push(i);
					}
				}
				function checkPlacements(currentCard, freePositions, discardable, undiscardable, cardDiscardBox) {
					console.log(freePositions.length);
					if (freePositions.length == 0) {
						discardable(cardDiscardBox);
					} else {
						ix = freePositions.pop();
						console.log(ix);
						loadActivityCard((ix == 0) ? 0 : cardDiscardBox.scene.cards[cardDiscardBox.scene.stage][ix-1], (leftCard) => {
							loadActivityCard((ix == cardDiscardBox.scene.cards[cardDiscardBox.scene.stage].length) ? 0 : cardDiscardBox.scene.cards[cardDiscardBox.scene.stage][ix+1], (rightCard) => {
								loadActivityCard(cardDiscardBox.scene.cards[cardDiscardBox.scene.stage-1][ix], (bottomCard) => {
									loadActivityCard(cardDiscardBox.scene.cards[cardDiscardBox.scene.stage-1][ix], (bottomCard) => {
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
										if (leftAligned && rightAligned && bottomAligned && (leftConnected || rightConnected || bottomConnected)) {
											undiscardable(cardDiscardBox);
										} else {
											checkPlacements(currentCard, freePositions, discardable, undiscardable, cardDiscardBox)
										}
									});
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

		this.buttonBox.on("pointerout", () => {
			this.buttonBox.alpha = 1;
			this.buttonText.alpha = 1;
			this.buttonText.text = "Discard";
			this.buttonBox.setFillStyle(this.colorIdle);
		});

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






// Call this function when the button to move to the next stage is pressed
function goToNextStage() {
	this.scene.cards.push(new Array(this.scene.cards[this.scene.stage-1].length).fill(0));	//add array the length of the previous array
	this.scene.stage += 1;
}

export { CardPlacementBox, AddCardPlacementBox, CardDiscardBox, goToNextStage };
