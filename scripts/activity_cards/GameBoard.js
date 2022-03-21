import { closeInventory, closeActInventory, useEffect } from "../event_cards/eventBoard.js";
import { colours, fonts } from "../theme.js";


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
		this.hasWorkLate = false;
        this.stage = this.scene.stage;
        this.testBlock = false;
        this.flip = false;
		
		let xPos;
		if (this.scene.stage == 0) {
			xPos = this.scene.x*(1+0.28*this.distanceFromMiddle);
		} else {
			xPos = this.scene.x*(1+0.225*this.distanceFromMiddle);
		}
		let yPos = this.scene.y*(1.33-(0.31*(this.scene.stage)));

		this.placementBox = this.scene.add.rectangle(xPos, yPos, this.scene.width, this.scene.height, colours.get("card")).setScale(0.108, 0.136).setInteractive();
		this.placementBox.on("pointerover", () => {
            if (this.scene.blockedOut && this.testBlock) { this.placementBox.setFillStyle(0x898989); }
            else { this.placementBox.setFillStyle(colours.get("cardHover")); }
        });
		this.placementBox.on("pointerout", () => { 
            if (this.scene.blockedOut && this.testBlock) { this.placementBox.setFillStyle(0xafafaf); }
            else { this.placementBox.setFillStyle(colours.get("card")); }
        });
		this.placementBox.on("pointerup", () => { 
			if (this.scene.isFacilitatorModeActive) { 
				if (this.cardId != 0 && !this.flip) { displayCardInfo(this.scene, this.cardId) }
			}
            else if (this.scene.blockedOut && this.testBlock) { this.placementBox.removeInteractive(); }
            else if (!this.scene.flipState && this.scene.flipped && this.flip) { this.placementBox.removeInteractive(); }
            else { this.updateCardBox(); } 
        });
		this.cardText = this.scene.add.text(xPos, yPos, "Place Card", fonts.get("button")).setOrigin(0.5);
		this.cardImage = this.scene.add.image(xPos, yPos, 2).setVisible(false).setScale(0.4);
		this.workLateImage = this.scene.add.image(xPos, yPos, "workLate").setVisible(false).setScale(0.34);
        this.backImage = this.scene.add.image(xPos, yPos, "a"+this.scene.stage).setVisible(false).setScale(0.34);
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
		
		// pick up the work late tile if there is one before doing anything else
		if (this.hasWorkLate) {
			if (this.scene.isPlayerHoldingWorkLate) {
				returnWorkLate(this.scene);
			} else {
				this.scene.isPlayerHoldingWorkLate = true;
				this.scene.workLateImage.setVisible(true);
			}
			this.hasWorkLate = false;
			this.workLateImage.setVisible(false);
			workLateCardEnabler(this.scene);
		}
        
        else if (this.scene.flipState && this.cardId != 0) {
            console.log("can flip card");
            let temp_id = this.cardId;
            if (!this.flip) {
                this.flip = true;
                this.cardText.setText("Flipped");
                this.cardImage.setVisible(false);
                this.backImage.setVisible(true);
                this.cardId = 0;
                this.scene.numberFlipped += 1;
            }
            else {
                this.flip = false;
                this.cardText.setText(temp_id);
                this.cardImage.setVisible(true);
                this.backImage.setVisible(false);
                this.cardId = temp_id;
                this.scene.numberFlipped -= 1;
            }
        }
        else if (!this.scene.flipState && this.flip) {
            this.placementBox.disableInteractive();
            this.cardId = 0;
        }
		
		// a work late tile can only be placed if the player is holding a work late tile and there is a card in the card box (and there isn't already a work late tile)
		else if (this.scene.isPlayerHoldingWorkLate && this.cardId != 0 && !this.hasWorkLate) {
			this.hasWorkLate = true;
			this.workLateImage.setVisible(true);
			this.scene.isPlayerHoldingWorkLate = false;
			this.scene.workLateImage.setVisible(false);
			workLateCardDisabler(this.scene);
		}
		
		// a card can only be placed if the player is holding a card and the card box is empty 
		else if (isPlayerHoldingCard && this.cardId == 0) {
			console.log("Place a card");
			
			if (this.scene.isEventRound) {	// need to check if this card box is in the same stage as the card during event round
				let isSameStage = false;
				for (let i = 0; i < this.scene.activityCards[this.stage].length; i++) {
					if (variables.get("currentCard") == this.scene.activityCards[this.stage][i].id) {
						isSameStage = true;
						break;
					}
				}
				if (!isSameStage) {
					alert("Card must be placed on the correct stage");
					return;
				}
			}
			
			this.cardId = variables.get("currentCard");
			variables.set("currentCard", 0);
			
			this.cardText.setText(this.cardId);
			this.scene.currentCardText.setText("+");
			this.scene.currentCardImage.setVisible(false);
			this.cardImage.setVisible(true).setTexture(this.cardId);

			// only the most recently placed card can be picked up on any round other than 0
			if (this.scene.stage != 0) {
				if (this.scene.lastPlayedCard != undefined) {
					this.scene.lastPlayedCard.placementBox.disableInteractive();
				}
				this.scene.lastPlayedCard = this;
			}
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

            // this box can still be played and is removed from the "queue" for disabling
            if (this.scene.stage != 0) {
                this.scene.lastPlayedCard = undefined;
            }
		}
        
        // during event stage, card will be flipped if card box has a card and flipState is set to true, and blocked if empty and allowed
        else if (!isPlayerHoldingCard && this.scene.isEventRound) {
            let wholeEffect = useEffect(this.scene);
            let action = wholeEffect[0];
            if ((action.includes("o") || action.includes("b")) && this.cardId == 0) {
                if (!this.testBlock) {
                    this.cardText.setText("Blocked Out");
                    this.placementBox.setFillStyle(0xafafaf);
                    this.testBlock = true;
                    this.scene.numberBlocked += 1;
                }
                else {
                    this.cardText.setText("Place Card");
                    this.testBlock = false;
                    this.scene.numberBlocked -= 1;
                }
            }
            else if (this.scene.blockedOut) {
                this.placementBox.disableInteractive();
            }
        }
	}
	
	/**
	 * Toggles the visibility of this card object. Also toggles the interactivity since you shouldn't be able to interact with an invisible object.
	 * @param {Boolean} isVisible Whether the card should be set to visible
	 * @param {Boolean} isInteractiveToggle Whether the card should be interactive
	 */
	setVisible(isVisible, isInteractiveToggle) {
		if (isVisible) {
			if (isInteractiveToggle) {
				this.placementBox.setVisible(true).setInteractive();
			} else {
				this.placementBox.setVisible(true).disableInteractive();
			}
			this.cardText.setVisible(true);
			if (this.cardId != 0) {		// image should not be displayed if there is no card
				this.cardImage.setVisible(true);
			}
			if (this.hasWorkLate) {
				this.workLateImage.setVisible(true);
			}
		} else {
			if (isInteractiveToggle) {
				this.placementBox.setVisible(false).disableInteractive();
			} else {
				this.placementBox.setVisible(false);
			}
			this.cardText.setVisible(false);
			this.cardImage.setVisible(false);
			if (this.hasWorkLate) {
				this.workLateImage.setVisible(false);
			}
		}
	}

	/**
	 * Removes the gap between card boxes on stage 0
	 */
	removeGap() {
		let shift = this.scene.x*0.14*0.39*Math.abs(this.distanceFromMiddle);
		if (this.distanceFromMiddle > 0) {
			this.placementBox.x -= shift;
			this.cardText.x -= shift;
			this.cardImage.x -= shift;
			this.workLateImage.x -= shift;
			this.backImage.x -= shift;
		} else if (this.distanceFromMiddle < 0) {
			this.placementBox.x += shift;
			this.cardText.x += shift;
			this.cardImage.x += shift;
			this.workLateImage.x += shift;
			this.backImage.x += shift;
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

		let xPos;
		if (this.scene.stage == 0) {
			xPos = this.scene.x+this.scene.x*(0.14+0.28*distanceMultiplier);
		} else {
			if (this.distanceFromMiddle < 0) {
				xPos = this.scene.x+this.scene.x*(0.085+0.225*distanceMultiplier);
			} else {
				xPos = this.scene.x+this.scene.x*(0.14+0.225*distanceMultiplier);
			}
			
		}
		let yPos = this.scene.y*(1.33-(0.31*(this.scene.stage)));
		
		this.buttonBox = this.scene.add.rectangle(xPos, yPos, this.scene.width, this.scene.height, colours.get("card")).setScale(0.023, 0.136).setInteractive();
		this.buttonBox.on("pointerover", () => {this.buttonBox.setFillStyle(colours.get("cardHover"));});
		this.buttonBox.on("pointerout", () => {this.buttonBox.setFillStyle(colours.get("card"));});
		this.buttonBox.on("pointerup", () => this.addBox());
		this.boxText = this.scene.add.text(xPos, yPos, '+', fonts.get("button")).setOrigin(0.5);
	}
	
	/**
	 * Adds a new card box in the correct positions
	*/
	addBox() {
		let variables = this.scene.teams[this.scene.currentTeam];
		let cards = variables.get("cards")[this.scene.stage];
		
		console.log("Add a card box");
		
		// disable this box if it's any stage other than the first stage since cards can't be moved once they're placed on the other stages
		if (this.scene.stage != 0) {
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
			
			
			// the distanceFromMiddle and workLate values of card boxes don't need to be updated if we only add at the start of the array
			if (position != 0) {
				let previousCardId = 0;
				let previousWorkLate = false;
				for (let i = position; i >= 0; i--) {
					// updating cardId
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

					//updating workLate
					let currentWorkLate = cards[i].hasWorkLate;
					cards[i].hasWorkLate = previousWorkLate;
					cards[i].workLateImage.setVisible(cards[i].hasWorkLate);
					previousWorkLate = currentWorkLate;
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
			
			// the distanceFromMiddle and workLate values of card boxes don't need to be updated if we only add at the end of the array
			if (position != cards.length-1) {
				let previousCardId = 0;
				let previousWorkLate = false;
				for (let i = position; i < cards.length; i++) {
					// updating cardId
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

					//updating workLate
					let currentWorkLate = cards[i].hasWorkLate;
					cards[i].hasWorkLate = previousWorkLate;
					cards[i].workLateImage.setVisible(cards[i].hasWorkLate);
					previousWorkLate = currentWorkLate;
				}
			}
		}
		
		var out = "";
		for (let i = 0; i < cards.length; i++) {
			out += cards[i].cardId+", ";
		}
		console.log(out);
	}
	
	/**
	 * Toggles the visibility of this button object. Also toggles the interactivity since you shouldn't be able to interact with an invisible object.
	 * @param {Boolean} visible Whether the button should be set to visible
	 * @param {Voolean} isInteractiveToggle Whether the button interactivity should be toggled
	 */
	setVisible(isVisible, isInteractiveToggle) {
		if (isVisible) {
			if (isInteractiveToggle) {
				this.buttonBox.setVisible(true).setInteractive();
			} else {
				this.buttonBox.setVisible(true);
			}
			this.boxText.setVisible(true);
		} else {
			if (isInteractiveToggle) {
				this.buttonBox.setVisible(false).disableInteractive();
			} else {
				this.buttonBox.setVisible(false);
			}
			this.boxText.setVisible(false);
		}
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
		this.colorIdle = colours.get("button");
		this.colorNoAction = 0x9cacb8;
		this.colorAction = 0x6c95b7;
		this.colorDiscarded = 0xf82f2f;

		// Draw the Button and button text on the scene
		this.button = this.scene.add.rectangle(this.scene.x * relativeX, this.scene.y * relativeY, this.scene.width * relativeWidth, this.scene.height * relativeHeight, this.colorIdle)
		this.buttonText = this.scene.add.text(this.scene.x * relativeX, this.scene.y * relativeY, "Discard", fonts.get("button"));
		this.buttonText.setOrigin(0.5);

		// On hovering, we check whether the currently held card is playable
		this.button.on("pointerover", () => {
			console.group("Discardability Check");
			console.log("Checking if current card can be discarded...");
			let variables = this.scene.teams[this.scene.currentTeam];
			let cards = variables.get("cards")[this.scene.stage];

			
			let isDiscardable = true;
			let currentCard = this.scene.cardMap.get(variables.get("currentCard"));
			let freePositions = []

			if (this.scene.stage == 0 || currentCard == null) {
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
            if (this.scene.isEventRound){
                isDiscardable = true;
            }
            else {
			// Check every possible free position to check whether card would be legal to place there
                while (freePositions.length > 0) {
                    let ix = freePositions.pop();
                    let leftCardId = (ix <= 0) ? 0 : cards[ix-1].cardId;
                    let leftCard = this.scene.cardMap.get(leftCardId);
                    let rightCardId = (ix >= cards.length-1) ? 0 : cards[ix+1].cardId;
                    let rightCard = this.scene.cardMap.get(rightCardId);
                    let bottomCardIx = ix + (cards[0].distanceFromMiddle - variables.get("cards")[this.scene.stage-1][0].distanceFromMiddle);
                    let bottomCardId = ((bottomCardIx < 0) || (bottomCardIx > variables.get("cards")[this.scene.stage-1].length-1)) ? 0 : variables.get("cards")[this.scene.stage-1][bottomCardIx].cardId;
                    let bottomCard = this.scene.cardMap.get(bottomCardId);

                    // A card is legal to place if it is connected to at least one card and if the edges of adjacent cards are the same
                    let currentCardPlacements = currentCard.placement.split(",");
                    let leftCardPlacements = (leftCard == null) ? ['1', '1', '1', '1'] : leftCard.placement.split(",");
                    let rightCardPlacements = (rightCard == null) ? ['1', '1', '1', '1'] : rightCard.placement.split(",");
                    let bottomCardPlacements = (bottomCard == null) ? ['1', '1', '1', '1'] : bottomCard.placement.split(",");

                    // Check if any adjacent card is overlaid with a work-late tile. If that is the case, the card is connected in all directions
                    leftCardPlacements = (leftCard != null && cards[ix-1].hasWorkLate) ? ['1', '1', '1', '1'] : leftCardPlacements;
                    rightCardPlacements = (rightCard != null && cards[ix+1].hasWorkLate) ? ['1', '1', '1', '1'] : rightCardPlacements;
                    bottomCardPlacements = (bottomCard != null && variables.get("cards")[this.scene.stage-1][bottomCardIx].hasWorkLate) ? ['1', '1', '1', '1'] : bottomCardPlacements;

                    // For each direction (left, right, bottom), check if the connections of the cards line up
                    let leftAligned = (leftCard == null) ? true : (leftCardPlacements[1] == currentCardPlacements[0]);
                    let rightAligned = (rightCard == null) ? true : (rightCardPlacements[0] == currentCardPlacements[1]);
                    let bottomAligned = (bottomCard == null) ? true : (bottomCardPlacements[2] == currentCardPlacements[3]);

                    // For each direction (left, right, bottom), check if the card is actually connected in that direction
                    let leftConnected = (leftCard == null) ? false : (leftCardPlacements[1] == '1' && currentCardPlacements[0] == '1');
                    let rightConnected = (rightCard == null) ? false : (rightCardPlacements[0] == '1' && currentCardPlacements[1] == '1');
                    let bottomConnected = (bottomCard == null) ? false : (bottomCardPlacements[2] == '1' && currentCardPlacements[3] == '1');

                    console.group(`Position (${this.scene.stage}, ${ix})`);
                    console.log(`| ${(leftCardPlacements[2] == '1' ? '^' : 'x')}   ${(currentCardPlacements[2] == '1' ? '^' : 'x')}   ${(rightCardPlacements[2] == '1' ? '^' : 'x')} |${(leftCard != null && cards[ix-1].hasWorkLate) ? ' Left Card Work Late' : (leftCard != null) ? ' Left Card Normal' : ' No Left Card'}\n|${(leftCardPlacements[0] == '1' ? '<' : 'x')}L${(leftCardPlacements[1] == '1' ? '>' : 'x')} ${(currentCardPlacements[0] == '1' ? '<' : 'x')}C${(currentCardPlacements[1] == '1' ? '>' : 'x')} ${(rightCardPlacements[0] == '1' ? '<' : 'x')}R${(rightCardPlacements[1] == '1' ? '>' : 'x')}|${(rightCard != null && cards[ix+1].hasWorkLate) ? ' Right Card Work Late' : (rightCard != null) ? ' Right Card Normal' : ' No Right Card'}\n| ${(leftCardPlacements[3] == '1' ? 'v' : 'x')}   ${(currentCardPlacements[3] == '1' ? 'v' : 'x')}   ${(rightCardPlacements[3] == '1' ? 'v' : 'x')} |${(bottomCard != null && variables.get("cards")[this.scene.stage-1][bottomCardIx].hasWorkLate) ? ' Bottom Card Work Late' : (bottomCard != null) ? ' Bottom Card Normal' : ' No Bottom Card'}\n|     ${(bottomCardPlacements[2] == '1' ? '^' : 'x')}     |\n|    ${(bottomCardPlacements[0] == '1' ? '<' : 'x')}B${(bottomCardPlacements[1] == '1' ? '>' : 'x')}    |\n|     ${(bottomCardPlacements[3] == '1' ? 'v' : 'x')}     |`);
                    console.log(`Alignment - Left ${leftAligned}, Right ${rightAligned}, Bottom ${bottomAligned}`);
                    console.log(`Connectivity - Left ${leftConnected}, Right ${rightConnected}, Bottom ${bottomConnected}`);
                    console.groupEnd();
                    // If the card is placable in the current position, the user is not allowed to discard it
                    // Else we check the next placement
                    if (leftAligned && rightAligned && bottomAligned && (leftConnected || rightConnected || bottomConnected)) {
                        isDiscardable = false;
                        break;
                    }
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
			console.groupEnd();
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

				this.scene.teams[this.scene.currentTeam].set("currentCard", 0);
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
		
		this.button = this.scene.add.rectangle(this.scene.x*x, this.scene.y*1.875, this.scene.width, this.scene.height, colours.get("button")).setScale(width, 0.10).setInteractive();
		this.button.disabled = false;
		if (onOver != undefined) {
			this.button.on("pointerover", () => { onOver(this.scene) });
		} else {
			this.button.on("pointerover", () => { this.button.setFillStyle(colours.get("buttonHover")); });
		}
		if (onOut!= undefined) {
			this.button.on("pointerout", () => { onOut(this.scene) });
		} else {
			this.button.on("pointerout", () => {
				if (this.button.disabled == false) { this.button.setFillStyle(colours.get("button")); }
			});
		}
		if (onClick != undefined) {
			this.button.on("pointerup", () => { onClick(this.scene); });
		}
		this.buttonText = this.scene.add.text(this.scene.x*x, this.scene.y*1.875, label, fonts.get("button")).setOrigin(0.5);
	}
}



/**
 * A button which toggles facilitator mode on/off
 * Disabled by default
 */
class FacilitatorModeButton {
	constructor(scene) {
		this.scene = scene

		this.button = this.scene.add.rectangle(this.scene.x*1.69, this.scene.y*0.12, this.scene.width, this.scene.height, colours.get("button")).setScale(0.27, 0.07).setInteractive();
		this.button.on("pointerover", () => { this.button.setFillStyle(colours.get("buttonHover")); });
		this.button.on("pointerout", () => { this.button.setFillStyle(colours.get("button")); });
		this.button.on("pointerup", () => { this.toggleFacilitatorMode(); });
		this.buttonText = this.scene.add.text(this.scene.x*1.69, this.scene.y*0.12, "Activate Facilitator Mode", fonts.get("button")).setOrigin(0.5).setFontSize(40);

		buttonToggle(this, 0, false);
	}


	toggleFacilitatorMode() {
		if (this.scene.isFacilitatorModeActive) {
			this.disableMode();
		} else {
			this.enableMode();
		}
	}


	disableMode() {
		let variables = this.scene.teams[this.scene.currentTeam];

		console.log("Deactivating facilitator mode");
		this.scene.isFacilitatorModeActive = false;
		this.buttonText.setText("Activate Facilitator Mode");

		// setting cards to be unclickable
		var cards = variables.get("cards");
		for (let i = 0; i < cards.length; i++) {
			for (let j = 0; j < cards[i].length; j++) {
				cards[i][j].placementBox.disableInteractive();
			}
		}

		if (this.scene.isEventRound) {
			buttonToggle(this.scene.eventBarPlay, 1, true);
			buttonToggle(this.scene.eventBarStore, 1, true);
            //buttonToggle(this.scene.eventBarFinish, 1, true);
			//buttonToggle(this.scene.eventBarFlip, 1, true);
			var cards = variables.get("eventCards");
			for (let i = 0; i < cards.length; i++) {
				buttonToggle(cards[i].playButton, 3, true);
			}
		}
	}


	enableMode() {
		let variables = this.scene.teams[this.scene.currentTeam];

		console.log("Activating facilitator mode");
		this.scene.isFacilitatorModeActive = true;
		this.buttonText.setText("Deactivate Facilitator Mode");

		// setting cards to be clickable
		var cards = variables.get("cards");
		for (let i = 0; i < cards.length; i++) {
			for (let j = 0; j < cards[i].length; j++) {
				cards[i][j].placementBox.setInteractive();
			}
		}

		if (this.scene.isEventRound) {
			let ecards = variables.get("eventCards");
			for (let i = 0; i < ecards.length; i++) {
				if (ecards[i].id != 0) {
					ecards[i].card.setInteractive();
				}
			}
			this.scene.eventStack.setInteractive();
		}

		if (this.scene.isEventRound) {
			buttonToggle(this.scene.eventBarPlay, 1, false);
			buttonToggle(this.scene.eventBarStore, 1, false);
            //buttonToggle(this.scene.eventBarFinish, 1, false);
			//buttonToggle(this.scene.eventBarFlip, 1, false);
			var cards = variables.get("eventCards");
			for (let i = 0; i < cards.length; i++) {
				buttonToggle(cards[i].playButton, 3, false);
			}
		}
	}
}



/**
 * Buttons turn grey when disabled
 * @param {Phaser.rectangle} button The button rectangle object which is to be enabled/disabled
 * @param {Integer} type The type of button (0 = ToolbarButton/CardDiscardBox, 1 = Pick up card button, 2 = Activity inventory)
 * @param {Boolean} enable true = enable the button, false = disable the button
 */
function buttonToggle(buttonObject, type, enable) {
	// ToolbarButton or CardDiscardBox
	if (type == 0) {
		let button = buttonObject.button;
		if (enable == true) {	// enabling the button
			button.setInteractive();
			button.setFillStyle(colours.get("button"));
			button.disabled = false;
		} else {	// disabling the button
			button.disableInteractive();
			button.setFillStyle(colours.get("buttonDisabled"));
			button.disabled = true;
		}
	}
	// Pick up card button
	else if (type == 1) {
		let button = buttonObject;
		if (enable == true) {	// enabling the button
			button.setInteractive();
			button.setFillStyle(colours.get("cardStack"));
		} else {	// disabling the button
			button.disableInteractive();
			button.setFillStyle(colours.get("buttonDisabled"));
		}
	}
    // Activity inventory
    else if (type == 2) {
		let button = buttonObject.button;
		let text = buttonObject.buttonText;
        if (enable == true) {   // enabling the button
            button.setInteractive();
            button.setFillStyle(colours.get("buttonEvent"));
        } else {    // disabling the button
            button.disableInteractive();
			button.setFillStyle(colours.get("buttonDisabled"));
        }
    }
	// CardBox + review arrows
	else if (type == 3) {
		let button = buttonObject.playButton;
		if (enable == true) {	// enabling the button
			button.setInteractive();
			button.setFillStyle(colours.get("button"));
			button.disabled = false;
		} else {	// disabling the button
			button.disableInteractive();
			button.setFillStyle(colours.get("buttonDisabled"));
			button.disabled = true;
		}
	}
}



/**
 * Displays facilitator information about a card with the given id
 * @param {int} id 
 */
function displayCardInfo(scene, id) {
	let card = scene.cardMap.get(id);
	alert(card.title+"\n"+card.description);
}



/**
 * Decides whether to move to the next team or the next stage after the next button is pressed
 */
function nextHandler(scene) {
	let variables = scene.teams[scene.currentTeam];

	// Identify all illegally placed cards
	console.log("Illegal Placements Team", scene.currentTeam, "\n", getIllegalPlacements(scene, scene.currentTeam));
	
	buttonToggle(scene.toolbarNext, 0, false);
	buttonToggle(scene.toolbarStart, 0, true);
    buttonToggle(scene.eventBarActInventory, 2, false);
	if (scene.activityInventoryOpen) closeActInventory(scene);
	// switching teams/stages
	if (!scene.isEventRound && scene.stage != 0) {
		moveToEventRound(scene);
	} else {
		// making all the card components for team A invisible
		for (let i = 0; i <= scene.stage; i++) {
			for (let j = 0; j < variables.get("cards")[i].length; j++) {
				variables.get("cards")[i][j].setVisible(false, true);
			}
		}
		
		
		if ((scene.isEventRound || scene.stage == 0) && scene.currentTeam != scene.numberOfTeams - 1) {
			moveToNextTeam(scene);
		} else if ((scene.isEventRound || scene.stage == 0) && scene.currentTeam == scene.numberOfTeams - 1) {
			moveToNextStage(scene);
		}
		
		scene.currentStageText.setText("Stage: "+(scene.stage+1));
		
		
		variables = scene.teams[scene.currentTeam];
		// making new cards for team A the next stage (unless it's the first stage, in which case they were already made)
		if (scene.stage != 0) {
			// start with the same number of boxes as the previous stage (including boxes without cards)
			let cards = variables.get("cards");
			cards.push([]);
			for (let i in cards[scene.stage-1]) {
				let distance = cards[scene.stage-1][i].distanceFromMiddle
				cards[scene.stage].push(new CardBox(scene, distance));
				cards[scene.stage][i].placementBox.disableInteractive();
			}
			
			// only start with add card boxes on the outer edges
			var box = new AddCardBox(scene, variables.get("leftEdge") - 1)
			box.setVisible(false, true);
			variables.get("addCardBoxes").push(box);
			box = new AddCardBox(scene, variables.get("rightEdge") + 1)
			box.setVisible(false, true);
			variables.get("addCardBoxes").push(box);
			
			
			console.log(variables.get("cards")[scene.stage]);
		}
		
		
		// making all the card components for team B visible
		for (let i = 0; i <= scene.stage; i++) {
			for (let j = 0; j < variables.get("cards")[i].length; j++) {
				var card = variables.get("cards")[i][j];
				if (card.cardId != 0) {
					card.setVisible(true, false);
				} else if (scene.stage == 0) {
					card.setVisible(true, false);
				}
			}
		}
		
		scene.toolbarWorkLate.buttonText.setText("Work Late\nTiles: " + variables.get("workLateTiles"));
		scene.timerText.setText("Time Remaining: "+scene.roundLength+"s")
	}
}



/**
 * Updates everything required to change to the event round
 */
function moveToEventRound(scene) {
	console.log("Moving to event round");
	scene.isEventRound = true;
	scene.currentStageText.setText("Stage: Events "+(scene.stage+1));
	buttonToggle(scene.toolbarStart, 0, false);
    buttonToggle(scene.eventBarActInventory, 2, true);
    buttonToggle(scene.eventBarActStore, 2, true);
	scene.eventStack.setTexture("e"+scene.stage).setVisible(true).setInteractive();
	scene.eventBarInventory.setVisible(true);
	if (scene.numberOfTeams > 1) scene.toolbarNext.buttonText.setText("Next Team");
	if (scene.isFacilitatorModeActive) scene.facilitatorModeButton.disableMode();
	removeUnusedCardBoxes(scene);
    scene.blockedOut = false;
    scene.flipped = false;
}



/**
 * Updates everything required to change to the next team
 */
function moveToNextTeam(scene) {
	console.log("Moving to next team");
	scene.isEventRound = false;
	scene.eventCardsRemaining = scene.totalEventCards;

	scene.teams[scene.currentTeam].set("addCardBoxes", [])
	if (scene.stage == 0) {
		squashFirstStage(scene);
		removeUnusedCardBoxes(scene);	// this will have been run at the start of the event round in other stages
	}
	
	scene.currentTeam++;
	scene.currentTeamText.setText("Team: " + (scene.currentTeam + 1));
	scene.eventBarPlay.setVisible(false);
	scene.eventBarStore.setVisible(false);
	scene.eventBarInventory.setVisible(false);
	if (scene.stage != 0) scene.toolbarNext.buttonText.setText("Next Round");
	if (scene.isInventoryOpen) closeInventory(scene);
    if (scene.activityInventoryOpen) closeActInventory(scene);
	if (scene.isFacilitatorModeActive) scene.facilitatorModeButton.disableMode();
    scene.blockedOut = true;
    scene.flipped = true;
}



/**
 * Updates everything required to change to the next stage
 */
function moveToNextStage(scene) {
	console.log("Moving to next stage")
	scene.isEventRound = false;
	scene.eventCardsRemaining = scene.totalEventCards;
	
	scene.eventBarPlay.setVisible(false);
	scene.eventBarStore.setVisible(false);
	scene.eventBarInventory.setVisible(false);
    scene.teams[scene.currentTeam].set("addCardBoxes", []);	//cleared since the old add card buttons will not be needed again

	if (scene.stage == 0) {
		squashFirstStage(scene);
		removeUnusedCardBoxes(scene);	// this will have been run at the start of the event round in other stages
	}
	
	if (scene.stage == 3) {
		// moving to review stage
		buttonToggle(scene.toolbarStart, 0, false);
		let cards = [];
		for (let i = 0; i < scene.numberOfTeams; i++) {
			cards.push(scene.teams[i].get("cards"));
		}
		scene.scene.start("review", [cards, scene.numberOfTeams, scene.cardMap]);
	} else {
		scene.stage++;
		scene.currentStageText.setText("Stage: " + (scene.stage + 1));
		scene.currentTeam = 0;
		scene.currentTeamText.setText("Team: 1");

	}

	scene.toolbarNext.buttonText.setText("Next Round");
	if (scene.isInventoryOpen) closeInventory(scene);
    if (scene.activityInventoryOpen) closeActInventory(scene);
	if (scene.isFacilitatorModeActive) scene.facilitatorModeButton.disableMode();
    scene.blockedOut = true;
    scene.flipped = true;
}



/**
 * Removes the gaps between CardBox objects after the first stage
 */
function squashFirstStage(scene) {
	let variables = scene.teams[scene.currentTeam];
	let cards = variables.get("cards")[0];

	for (let i = 0; i < cards.length; i++) {
		cards[i].removeGap();
	}
}



/**
 * deactivate any CardBox objects which weren't used in the previous stage
 * (doesn't actually remove them, just sets them to be invisible)
 */
function removeUnusedCardBoxes(scene) {
    let variables = scene.teams[scene.currentTeam];
	let cards = variables.get("cards")[scene.stage];
    let unused = variables.get("unusedCards");
    if (unused==undefined) {
        unused = [];
    }
    //console.log(unused)
	console.log(cards)
	for (let i = 0; i < cards.length; i++) {
		if (cards[i].cardId == 0) {
            cards[i].setVisible(false, false);
            unused.push(cards[i]);
		}
	}
    variables.set("unusedCards", unused);
}



function addUnusedCardBoxes(scene) {
    let cards = scene.teams[scene.currentTeam].get("cards")[scene.stage];
    let unusedCards = scene.teams[scene.currentTeam].get("unusedCards");
	console.log(unusedCards);
	for (let i = 0; i < cards.length; i++) {
        if (cards[i].cardId == 0) {
            cards[i].setVisible(true, true);
		}
	}
    for (let j = 0; j < unusedCards.length; j++) {
        unusedCards[j].setVisible(true, true);
    }
    console.log(cards);
    //unusedCards = [];
}



/**
 * Called when the Start button is pressed
 * Runs the code to start (and end) a round of the game
 */
function startHandler(scene) {
	let variables = scene.teams[scene.currentTeam];
	
	// the game was running when the button was pressed (stop the timer)
	if (scene.isTimerRunning) {
		stopHandler(scene);
	}
	// the game was paused when the button was pressed (start the timer)
	else {
		// starting the timer
		scene.timer = scene.time.addEvent({delay: 1000, repeat: scene.roundLength-1, callback: timerUpdater, args: [scene]});
		scene.isTimerRunning = true;
		
		scene.toolbarStart.buttonText.setText("Stop Timer");
		
		buttonToggle(scene.toolbarNext, 0, false);
		buttonToggle(scene.toolbarWorkLate, 0, true);
		buttonToggle(scene.toolbarDiscard, 0, true);
        buttonToggle(scene.eventBarActInventory, 2, true);
        buttonToggle(scene.eventBarActStore, 2, true);
		buttonToggle(scene.currentCardBox, 1, true);
		buttonToggle(scene.facilitatorModeButton, 0, false);
		if (scene.isFacilitatorModeActive) {
			scene.facilitatorModeButton.toggleFacilitatorMode();
		}
		
		// making all the card components visible
		for (let i = 0; i < scene.stage; i++) {
			for (let j = 0; j < variables.get("cards")[i].length; j++) {
				let card = variables.get("cards")[i][j];
				if (card.cardId != 0 || card.stage == scene.stage) {
					card.setVisible(true, false);	// don't make unused boxes from previous stages visible
				}
			}
		}
		// only the newest stage should be interactive
		for (let i = 0; i < variables.get("cards")[scene.stage].length; i++) {
			variables.get("cards")[scene.stage][i].setVisible(true, true);
		}
		

		for (let i = 0; i < variables.get("addCardBoxes").length; i++) {
			variables.get("addCardBoxes")[i].setVisible(true, true);
		}
	}
}



/**
 * Called every 1 second by the timer while a round is playing
 * Updates the timer values
 */
function timerUpdater(scene) {
	let timeRemaining = scene.timer.getOverallRemainingSeconds();
	if (timeRemaining == 0) {
		scene.timerText.setText("Time Remaining: 0s");
		stopHandler(scene);
	} else {
		scene.timerText.setText("Time Remaining: "+timeRemaining+"s");
	}
}



/**
 * Ends the current round
 */
function stopHandler(scene) {
	let variables = scene.teams[scene.currentTeam];
	
	if (scene.timer.getOverallRemainingSeconds() > 0) {
		scene.timer.remove();
	}
	scene.isTimerRunning = false;
	scene.toolbarStart.buttonText.setText("Start Timer")
	
	variables.set("currentCard", 0);
	scene.currentCardText.setText("+");
	scene.currentCardImage.setVisible(false);
	
	buttonToggle(scene.toolbarNext, 0, true);
	buttonToggle(scene.toolbarStart, 0, false);
	buttonToggle(scene.toolbarWorkLate, 0, false);
	buttonToggle(scene.toolbarDiscard, 0, false);
    buttonToggle(scene.eventBarActInventory, 2, false);
    buttonToggle(scene.eventBarActStore, 2, false);
	buttonToggle(scene.currentCardBox, 1, false);
	buttonToggle(scene.facilitatorModeButton, 0, true);

	
	// returning unused work late tiles
	if (scene.isPlayerHoldingWorkLate) {
		returnWorkLate(scene);
		scene.workLateImage.setVisible(false);
		scene.isPlayerHoldingWorkLate = false;
	}
	
	// disabling all the card placement boxes
	for (let i = 0; i < variables.get("cards")[scene.stage].length; i++) {
		variables.get("cards")[scene.stage][i].placementBox.disableInteractive();
	}
	
	// deleting all the add card buttons from the current round
	for (let i = 0; i < variables.get("addCardBoxes").length; i++) {
		variables.get("addCardBoxes")[i].setVisible(false, true);
	}
    
    if (scene.activityInventoryOpen) closeActInventory(scene);
}



/**
 * Called when the Work Late button is pressed
 * Allows the user to use work late tiles
 */
function workLateHandler(scene) {
	let variables = scene.teams[scene.currentTeam];
	
	if (scene.isPlayerHoldingWorkLate) {		// the user is holding a work late tile so they want to put it back
		returnWorkLate(scene);
		scene.isPlayerHoldingWorkLate = false;
		scene.workLateImage.setVisible(false);
		workLateCardDisabler(scene)

	} else if (variables.get("workLateTiles") > 0) {	// can only pick up a tile if there are still any in inventory
		let variables = scene.teams[scene.currentTeam];
		scene.isPlayerHoldingWorkLate = true;
		scene.workLateImage.setVisible(true);
		variables.set("workLateTiles", variables.get("workLateTiles") - 1);
		scene.toolbarWorkLate.buttonText.setText("Work Late\nTiles: " + variables.get("workLateTiles"));
		workLateCardEnabler(scene);
	}
}



/**
 * Making all cards on the current stage clickable
 * Designed to be used after picking up a work late tile
 * @param {*} scene 
 */
function workLateCardEnabler(scene) {
	let variables = scene.teams[scene.currentTeam];
	if (scene.stage != 0) {
		let cards = variables.get("cards")[scene.stage]
		for (let i = 0; i < cards.length; i++) {
			cards[i].placementBox.setInteractive();
		}
	}
}



/**
 * Making all card boxes with cards inside unclickable unless it's the most recent one
 * Designed to be used after placing a work late tile
 * @param {*} scene 
 */
function workLateCardDisabler(scene) {
	let variables = scene.teams[scene.currentTeam];
	if (scene.stage != 0) {
		let cards = variables.get("cards")[scene.stage]
		for (let i = 0; i < cards.length; i++) {
			console.log(cards[i])
			if (cards[i].cardId != 0 && cards[i] != scene.lastPlayedCard) {
				cards[i].placementBox.disableInteractive();
			}
		}
	}
}



/**
 * returns a work late tile
 */
function returnWorkLate(scene) {
	let variables = scene.teams[scene.currentTeam];
	variables.set("workLateTiles", variables.get("workLateTiles") + 1);
	scene.toolbarWorkLate.buttonText.setText("Work Late\nTiles: " + variables.get("workLateTiles"));
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
		for (let card = 0; card < variables.get("cards")[stage].length; card++) {
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
    // during event round, will pick up specified cards
    if (scene.isEventRound && variables.get("currentCard") == 0) {
        console.log("ID: "+variables.get("currentCard").id);
        var wholeEffect = useEffect(scene);
        for (var i = 0; i < wholeEffect.length; i++) {
            var cardId = wholeEffect[i][2];
            if ((wholeEffect[i][0].includes("p") || !scene.completeEffect) && !cardId.includes("0")) {
                for (var j = 0; j < cardId.length; j++) {
                    variables.set("currentCard", cardId[j]);
                    scene.currentCardText.setText(variables.get("currentCard"));
                    scene.currentCardImage.setVisible(true).setTexture(variables.get("currentCard"));
                }
            }
            else {
                variables.set("currentCard", scene.activityCards[scene.stage].pop().id);
                scene.currentCardText.setText(variables.get("currentCard"));
                scene.currentCardImage.setVisible(true).setTexture(variables.get("currentCard"));
            }
        }
    }
    else {
        if (variables.get("currentCard") == 0) {
            variables.set("currentCard", scene.activityCards[scene.stage].pop().id);
            scene.currentCardText.setText(variables.get("currentCard"));
            scene.currentCardImage.setVisible(true).setTexture(variables.get("currentCard"));
        }
    }
}



/**
 * Returns a list of positions (stage, index) of illegally played cards
 */
function getIllegalPlacements(scene, team) {
	class Node {
		constructor(stage, ix, cards) {
			this.stage = stage;
			this.ix = ix;
			this.id = cards[stage][ix].cardId;
			this.adjacencyList = null;
			this.connectivity = [] // [left, right, up, down] (true if can connect, false otherwise)
			if (cards[stage][ix].hasWorkLate) {
				this.connectivity = [true, true, true, true];
			} else {
				let placements = scene.cardMap.get(this.id) == null ? ['1', '1', '1', '1'] : scene.cardMap.get(this.id).placement.split(",");
				for (let i = 0; i < placements.length; i++) {
					this.connectivity.push(placements[i] == '1');
				}
			}
            this.visited = false;
            this.illegal = false;
		}
	}

	let nodes = []
	let nodesGrid = []
	// Convert all cards in the game board grid (of the current team) to nodes
	let cards = scene.teams[team].get("cards");
	for (let stage = 0; stage <= scene.stage; stage++) {
		let stageList = [];
		for (let ix = 0; ix < cards[stage].length; ix++) {
			let node = (cards[stage][ix].cardId == 0) ? null : new Node(stage, ix, cards);
			nodes.push(node);
			stageList.push(node);
		}
		nodesGrid.push(stageList);
	}

	// Fill the adjacency list for each node
    for (let stage = 0; stage < nodesGrid.length; stage++) {
        for (let ix = 0; ix < nodesGrid[stage].length; ix++) {
            let node = nodesGrid[stage][ix];
			if (node != null) {
				node.adjacencyList = [];
				// Check if this node can connect to a left node and if this left node is connected
				if (node.connectivity[0] && node.ix > 0) {
					if (nodesGrid[node.stage][node.ix-1] != null) {
						if (nodesGrid[node.stage][node.ix-1].connectivity[1]) {
							node.adjacencyList.push(nodesGrid[node.stage][node.ix-1]);
						} else {
							node.illegal = true
						}
					}
				}
				// Check if this node can connect to a right node and if this right node is connected
				if (node.connectivity[1] && node.ix < nodesGrid[node.stage].length-1) {
					if (nodesGrid[node.stage][node.ix+1] != null) {
						if (nodesGrid[node.stage][node.ix+1].connectivity[0]) {
							node.adjacencyList.push(nodesGrid[node.stage][node.ix+1]);
						} else {
							node.illegal = true
						}
					}
				}
				// Check if this node can connect to a top node and if this top node is connected
				if (node.connectivity[2] && node.stage < scene.stage) {
					let topCardIx = node.ix + (cards[node.stage+1][0].distanceFromMiddle - cards[node.stage][0].distanceFromMiddle);
					if (nodesGrid[node.stage+1][topCardIx] != null) {
						if (nodesGrid[node.stage+1][topCardIx].connectivity[3]) {
							node.adjacencyList.push(nodesGrid[node.stage+1][topCardIx]);
						} else {
							node.illegal = true
						}
					}
				}
				// Check if this node can connect to a bottom node and if this bottom node is connected
				if (node.connectivity[3]) {
					let bottomCardIx = node.ix + (cards[node.stage][0].distanceFromMiddle - cards[node.stage-1][0].distanceFromMiddle);
					if (nodesGrid[node.stage-1][bottomCardIx] != null) {
						if (nodesGrid[node.stage-1][bottomCardIx].connectivity[2]) {
							node.adjacencyList.push(nodesGrid[node.stage-1][bottomCardIx]);
						} else {
							node.illegal = true
						}
					}
				}
			}
        }
    }
	nodesGrid = undefined; // The variable becomes obsolete at this point

	// Perform breadth-first search starting from a node in the lowest stage (since they always are connected)
	// Any nodes flagged as illegal are illegally placed through wrong connections
	// Any nodes that haven't been visited by the search are disconnected and therefore also illegal
	let searchQ = [nodes[0], ];
	while (searchQ.length > 0) { // While we can still explore the connected graph
		let node = searchQ.shift(); // Remove the first element in the queue
		node.visited = true;
		// Add all adjacent AND unvisited nodes to the searchQ
		for (let i = 0; i < node.adjacencyList.length; i++) {
			if (!node.adjacencyList[i].visited) {
				searchQ.push(node.adjacencyList[i]);
			}
		}
	}

	// Add nodes that are flagged illegal and nodes that are still unvisited to the list of illegals
	let illegals = [];
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i] != null && (nodes[i].illegal || !nodes[i].visited)) {
			illegals.push([nodes[i].stage, nodes[i].ix]);
		}
	}

	// Return list of illegally placed cards (or cards that can resolve an illegal placement)
	return illegals;
}



function highlightIllegalPlacements(scene) {

}



function resetHighlightIllegalPlacements(scene) {
	
}


export { CardBox, AddCardBox, CardDiscardBox, ToolbarButton, FacilitatorModeButton, buttonToggle, nextHandler, startHandler, workLateHandler, pickUpCard, displayCardInfo, addUnusedCardBoxes };
