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
		this.hasWorkLate = false;
		
		this.placementBox = this.scene.add.rectangle(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.gameData.stage))), this.scene.width, this.scene.height, 0xb1cfe0).setScale(0.108, 0.136).setInteractive();
		this.placementBox.on("pointerover", () => { this.placementBox.setFillStyle(0x6c95b7); });
		this.placementBox.on("pointerout", () => { this.placementBox.setFillStyle(0xb1cfe0); });
		this.placementBox.on("pointerup", () => { this.updateCardBox(); });
		this.cardText = this.scene.add.text(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.gameData.stage))), "Place Card", {color: "0x000000"}).setOrigin(0.5).setFontSize(15);
		this.cardImage = this.scene.add.image(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.gameData.stage))), 2).setVisible(false).setScale(0.2);
		this.workLateImage = this.scene.add.image(this.scene.x*(1+0.28*this.distanceFromMiddle), this.scene.y*(1.33-(0.31*(this.scene.gameData.stage))), "workLate").setVisible(false).setScale(0.17);
	}
	
	/**
	 * Either places a card or moves a card when a card box is clicked
	*/
	updateCardBox() {
		let variables = this.scene.gameData.teams[this.scene.teamNumber]
		
		var isPlayerHoldingCard = true;
		if (this.scene.gameData.teamToolbar.currentCard == 0) {
			isPlayerHoldingCard = false;
		}
		
		// pick up the work late tile if there is one before doing anything else
		if (this.hasWorkLate) {
			if (variables.isPlayerHoldingWorkLate) {
				returnWorkLate(this.scene);
			} else {
				variables.isPlayerHoldingWorkLate = true;
				this.scene.gameData.teamToolbar.workLateImage.setVisible(true);
			}
			this.hasWorkLate = false;
			this.workLateImage.setVisible(false);
		}
		
		// a work late tile can only be placed if the player is holding a work late tile and there is a card in the card box (and there isn't already a work late tile)
		else if (variables.isPlayerHoldingWorkLate && this.cardId != 0 && !this.hasWorkLate) {
			this.hasWorkLate = true;
			this.workLateImage.setVisible(true);
			variables.isPlayerHoldingWorkLate = false;
			this.scene.gameData.teamToolbar.workLateImage.setVisible(false);
		}
		
		// a card can only be placed if the player is holding a card and the card box is empty
		else if (isPlayerHoldingCard && this.cardId == 0) {
			console.log("Place a card");
			this.cardId = this.scene.gameData.teamToolbar.currentCard;
			this.scene.gameData.teamToolbar.currentCard = 0;
			
			this.cardText.setText(this.cardId);
			this.scene.gameData.teamToolbar.currentCardText.setText("+");
			this.scene.gameData.teamToolbar.currentCardImage.setVisible(false);
			this.cardImage.setVisible(true).setTexture(this.cardId);
		}
		
		// a card can only be picked up if the player is not holding a card and the card box has a card
		else if (!isPlayerHoldingCard && this.cardId != 0) {
			console.log("Pick up the card");
			this.scene.gameData.teamToolbar.currentCard = this.cardId;
			this.cardId = 0;
			
			this.cardText.setText("Place Card");
			this.scene.gameData.teamToolbar.currentCardText.setText(this.scene.gameData.teamToolbar.currentCard);
			this.scene.gameData.teamToolbar.currentCardImage.setVisible(true).setTexture(this.scene.gameData.teamToolbar.currentCard);
			this.cardImage.setVisible(false);
		}
	}
	
	/**
	 * Toggles the visibility of this card object. Also toggles the interactivity since you shouldn't be able to interact with an invisible object.
	 * @param {Boolean} isVisible Whether the card should be set to visible
	 * @param {Voolean} isInteractiveToggle Whether the card interactivity should be toggled
	 */
	setVisible(isVisible, isInteractiveToggle) {
		if (isVisible) {
			if (isInteractiveToggle) {
				this.placementBox.setVisible(true).setInteractive();
			} else {
				this.placementBox.setVisible(true);
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
		this.scene.gameData.teams[this.scene.teamNumber].addCardBoxes.push(this);
		
		// the first box on the "right" does not need a multiplier
		var distanceMultiplier = this.distanceFromMiddle;
		if (this.distanceFromMiddle > 0) {
			distanceMultiplier--;
		}
		
		this.buttonBox = this.scene.add.rectangle(this.scene.x+this.scene.x*(0.14+0.28*distanceMultiplier), this.scene.y*(1.33-(0.31*(this.scene.gameData.stage))), this.scene.width * 0.023, this.scene.height * 0.136,0xb1cfe0).setInteractive();
		this.buttonBox.on("pointerover", () => {this.buttonBox.setFillStyle(0x6c95b7);});
		this.buttonBox.on("pointerout", () => {this.buttonBox.setFillStyle(0xb1cfe0);});
		this.buttonBox.on("pointerup", () => this.addBox());
		this.boxText = this.scene.add.text(this.scene.x+this.scene.x*(0.14+0.28*distanceMultiplier), this.scene.y*(1.33-(0.31*(this.scene.gameData.stage))), '+', {color: "0x000000"}).setOrigin(0.5);

		// console.log(this.buttonBox.x, this.buttonBox.displayWidth, this.buttonBox.x + this.buttonBox.displayWidth);
		// console.log(this.scene.background.x, this.scene.background.displayWidth, this.scene.background.x + this.scene.background.displayWidth);
		let button = new Phaser.Geom.Rectangle(this.buttonBox.x - this.buttonBox.displayOriginX, this.buttonBox.y - this.buttonBox.displayOriginY, this.buttonBox.displayWidth, this.buttonBox.displayHeight);
		let background = new Phaser.Geom.Rectangle(this.scene.background.x - this.scene.background.displayOriginX, this.scene.background.y - this.scene.background.displayOriginY, this.scene.background.displayWidth, this.scene.background.displayHeight);

		// console.log(this.buttonBox.displayOriginX, this.buttonBox.displayOriginY);


		// console.log(button.right, background.right);

		let v1 = Phaser.Math.Vector2();
		let v2 = Phaser.Math.Vector2();
		let rescale = false;
		if (this.buttonBox.getRightCenter(v1, true).x > this.scene.background.getRightCenter(v2, true).x) {
			rescale = true;
		} else if (this.buttonBox.getLeftCenter(v1, true).x < this.scene.background.getLeftCenter(v2, true).x) {
			rescale = true;
		}
		if (rescale) {
			this.scene.background.scaleX = this.scene.background.scaleX * 2;
			this.scene.background.scaleY = this.scene.background.scaleY * 2;
			this.scene.cameras.main.zoom = this.scene.cameras.main.zoom / 2;
		}
	}
	
	/**
	 * Adds a new card box in the correct positions
	*/
	addBox() {
		let variables = this.scene.gameData.teams[this.scene.teamNumber];
		let cards = variables.cards[this.scene.gameData.stage];
		
		console.log("Add a card box");
		
		// disable this box if it's any stage other than the first stage since cards can't be moved once they're placed on the other stages
		if (this.scene.gameData.stage != 0) {
			this.buttonBox.disableInteractive().setVisible(false);
			this.boxText.setVisible(false);
		}
		
		// different code is needed depending on if the card is being added to the left or right of the centre card due how the rendering positions are calculated
		if (this.distanceFromMiddle < 0) {
			// adds new boxes at the furthest left edge
			let newBox = new CardBox(this.scene, this.scene.leftEdge-1);
			new AddCardBox(this.scene, this.scene.leftEdge-2);
			this.scene.leftEdge = this.scene.leftEdge - 1;
			
			// updating cards array and related variables
			let position = this.scene.middlePosition + this.distanceFromMiddle + 1;
			cards.unshift(newBox);		//adding empty box to start of the array, the card ids will be shifted later
			this.scene.middlePosition = this.scene.middlePosition + 1;
			
			
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
			let newBox = new CardBox(this.scene, this.scene.rightEdge+1);
			new AddCardBox(this.scene, this.scene.rightEdge+2);
			this.scene.rightEdge = this.scene.rightEdge + 1;
			
			// updating cards array and related variables
			let position = this.scene.middlePosition + this.distanceFromMiddle;
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
		this.colorIdle = 0xb1cfe0
		this.colorNoAction = 0x9cacb8;
		this.colorAction = 0x6c95b7;
		this.colorDiscarded = 0xf82f2f;

		// Draw the Button and button text on the scene
		this.button = this.scene.add.rectangle(this.scene.x * relativeX, this.scene.y * relativeY, this.scene.width * relativeWidth, this.scene.height * relativeHeight, this.colorIdle)
		this.buttonText = this.scene.add.text(this.scene.x * relativeX, this.scene.y * relativeY, "Discard", {color: "0x000000"});
		this.buttonText.setOrigin(0.5);

		// On hovering, we check whether the currently held card is playable
		this.button.on("pointerover", () => {
			console.group("Discardability Check");
			console.log("Checking if current card can be discarded...");
			let variables = this.scene.gameData.teams[this.scene.gameData.currentTeam];
			let cards = variables.cards[this.scene.gameData.stage];

			
			let isDiscardable = true;
			let currentCard = this.scene.gameData.cardMap.get(this.scene.currentCard);
			let freePositions = []

			if (this.scene.gameData.stage == 0 || currentCard == null) {
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
				let leftCard = this.scene.gameData.cardMap.get(leftCardId);
				let rightCardId = (ix >= cards.length-1) ? 0 : cards[ix+1].cardId;
				let rightCard = this.scene.gameData.cardMap.get(rightCardId);
				let bottomCardIx = ix + (cards[0].distanceFromMiddle - variables.cards[this.scene.gameData.stage-1][0].distanceFromMiddle);
				let bottomCardId = ((bottomCardIx < 0) || (bottomCardIx > variables.cards[this.scene.stage-1].length-1)) ? 0 : variables.cards[this.scene.gameData.stage-1][bottomCardIx].cardId;
				let bottomCard = this.scene.cardMap.get(bottomCardId);

				// A card is legal to place if it is connected to at least one card and if the edges of adjacent cards are the same
				let currentCardPlacements = currentCard.placement.split(",");
				let leftCardPlacements = (leftCard == null) ? ['1', '1', '1', '1'] : leftCard.placement.split(",");
				let rightCardPlacements = (rightCard == null) ? ['1', '1', '1', '1'] : rightCard.placement.split(",");
				let bottomCardPlacements = (bottomCard == null) ? ['1', '1', '1', '1'] : bottomCard.placement.split(",");

				// Check if any adjacent card is overlaid with a work-late tile. If that is the case, the card is connected in all directions
				leftCardPlacements = (leftCard != null && cards[ix-1].hasWorkLate) ? ['1', '1', '1', '1'] : leftCardPlacements;
				rightCardPlacements = (rightCard != null && cards[ix+1].hasWorkLate) ? ['1', '1', '1', '1'] : rightCardPlacements;
				bottomCardPlacements = (bottomCard != null && variables.cards[this.scene.gameData.stage-1][bottomCardIx].hasWorkLate) ? ['1', '1', '1', '1'] : bottomCardPlacements;

				// For each direction (left, right, bottom), check if the connections of the cards line up
				let leftAligned = (leftCard == null) ? true : (leftCardPlacements[1] == currentCardPlacements[0]);
				let rightAligned = (rightCard == null) ? true : (rightCardPlacements[0] == currentCardPlacements[1]);
				let bottomAligned = (bottomCard == null) ? true : (bottomCardPlacements[2] == currentCardPlacements[3]);

				// For each direction (left, right, bottom), check if the card is actually connected in that direction
				let leftConnected = (leftCard == null) ? false : (leftCardPlacements[1] == '1' && currentCardPlacements[0] == '1');
				let rightConnected = (rightCard == null) ? false : (rightCardPlacements[0] == '1' && currentCardPlacements[1] == '1');
				let bottomConnected = (bottomCard == null) ? false : (bottomCardPlacements[2] == '1' && currentCardPlacements[3] == '1');

				console.group(`Position (${this.scene.gameData.stage}, ${ix})`);
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
	let gameData = scene.gameData
	//let variables = gameData.teams[scene.gameData.currentTeam];

	// Identify all illegally placed cards
	console.log("Illegal Placements Team", gameData.currentTeam, "\n", getIllegalPlacements(scene, gameData.currentTeam));
	
	buttonToggle(scene.toolbarNext.button, 0, false);
	buttonToggle(scene.toolbarStart.button, 0, true);


	// Hide current gameboard
	gameData.teams[gameData.currentTeam].scene.sys.setVisible(false);

	// Move to next team
	// If all teams have played, move to next stage
	let oldStage = gameData.stage;
	if (gameData.currentTeam == (gameData.numberOfTeams - 1)) {		// move to next stage if all teams have played
		if (scene.gameData.stage == 3) {
			buttonToggle(scene.toolbarStart.button, 0, false);
			// TODO: move to final screen scene (probably need to pass the teams array)
			console.log("TODO: go to final screen");
			scene.currentStageText.setText("Stage: MOVE TO FINAL SCREEN");
			return;	//TODO: remove this once moved to final stage
		} else {
			gameData.stage++;
			scene.currentStageText.setText("Stage: " + (gameData.stage + 1));
			gameData.currentTeam = 0;
			scene.currentTeamText.setText("Team: 1");
		}
	} else {
		gameData.currentTeam++;
		scene.currentTeamText.setText("Team: " + (gameData.currentTeam + 1));
	}

	// If we changed stages, make new cards for each team
	// Start with the same number of boxes as the previous stage
	if (gameData.stage != oldStage) {
		for (let team = 0; team < gameData.numberOfTeams; team++) {
			let variables = gameData.teams[team];
			let cards = variables.cards;
			cards.push([]);

			for (let i = 0; i < cards[oldStage].length; i++) {
				let distance = cards[oldStage][i].distanceFromMiddle;
				cards[gameData.stage].push(new CardBox(variables.scene, distance));
				cards[gameData.stage][i].placementBox.disableInteractive();
			}

			let leftAddCardBox = new AddCardBox(variables.scene, variables.scene.leftEdge-1);
			let rightAddCardBox = new AddCardBox(variables.scene, variables.scene.rightEdge+1);
			leftAddCardBox.setVisible(false, true);
			rightAddCardBox.setVisible(false, true);
			variables.addCardBoxes.push(leftAddCardBox);
			variables.addCardBoxes.push(rightAddCardBox);
		}
	}

	// Make the next gameboard visible
	gameData.teams[gameData.currentTeam].scene.sys.setVisible(true);
	gameData.game.scene.bringToTop("teamToolbar");

	scene.toolbarWorkLate.buttonText.setText("Work Late\nTiles: " + gameData.teams[gameData.currentTeam].workLateTiles);
	scene.timerText.setText("Time Remaining: "+ gameData.roundLength+"s");
}



/**
 * Called when the Start button is pressed
 * Runs the code to start (and end) a round of the game
 */
function startHandler(scene) {
	let variables = scene.gameData.teams[scene.gameData.currentTeam];
	
	// the game was running when the button was pressed (stop the timer)
	if (scene.isTimerRunning) {
		stopHandler(scene);
	}
	// the game was paused when the button was pressed (start the timer)
	else {
		// starting the timer
		scene.timer = scene.time.addEvent({delay: 1000, repeat: scene.gameData.roundLength-1, callback: timerUpdater, args: [scene]});
		scene.isTimerRunning = true;
		
		scene.toolbarStart.buttonText.setText("Stop Timer");
		
		buttonToggle(scene.toolbarNext.button, 0, false);
		buttonToggle(scene.toolbarWorkLate.button, 0, true);
		buttonToggle(scene.toolbarDiscard.button, 0, true);
		buttonToggle(scene.currentCardBox, 1, true);
		
		// making all the card components visible
		for (let i = 0; i < scene.gameData.stage; i++) {
			for (let j = 0; j < variables.cards[i].length; j++) {
				variables.cards[i][j].setVisible(true, false);
			}
		}
		// only the newest stage should be interactive
		for (let i = 0; i < variables.cards[scene.gameData.stage].length; i++) {
			variables.cards[scene.gameData.stage][i].setVisible(true, true);
		}
		
		for (let i = 0; i < variables.cards.length; i++) {
			variables.addCardBoxes[i].setVisible(true, true);
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
		stopHandler(scene);
	} else {
		scene.timerText.setText("Time Remaining: "+timeRemaining+"s");
	}
}



/**
 * Ends the current round
 */
function stopHandler(scene) {
	let variables = scene.gameData.teams[scene.gameData.currentTeam];
	
	if (scene.timer.getOverallRemainingSeconds() > 0) {
		scene.timer.remove();
	}
	scene.isTimerRunning = false;
	scene.toolbarStart.buttonText.setText("Start Timer")
	
	scene.currentCard = 0;
	scene.currentCardText.setText("+");
	scene.currentCardImage.setVisible(false);
	
	buttonToggle(scene.toolbarNext.button, 0, true);
	buttonToggle(scene.toolbarStart.button, 0, false);
	buttonToggle(scene.toolbarWorkLate.button, 0, false);
	buttonToggle(scene.toolbarDiscard.button, 0, false);
	buttonToggle(scene.currentCardBox, 1, false);
	
	// returning unused work late tiles
	if (variables.isPlayerHoldingWorkLate) {
		returnWorkLate(scene);
		scene.workLateImage.setVisible(false);
		variables.isPlayerHoldingWorkLate = false;
	}
	
	// disabling all the card placement boxes
	for (let i = 0; i < variables.cards[scene.gameData.stage].length; i++) {
		variables.cards[scene.gameData.stage][i].placementBox.disableInteractive();
	}
	
	// deleting all the add card buttons from the current round
	for (let i = 0; i < variables.addCardBoxes.length; i++) {
		variables.addCardBoxes[i].setVisible(false, true);
	}
	variables.addCardBoxes = [];	//cleared since the old add card buttons will not be needed again
}



/**
 * Called when the Work Late button is pressed
 * Allows the user to use work late tiles
 */
function workLateHandler(scene) {
	let variables = scene.gameData.teams[scene.gameData.currentTeam];
	
	if (variables.isPlayerHoldingWorkLate) {		// the user is holding a work late tile so they want to put it back
		returnWorkLate(scene);
		variables.isPlayerHoldingWorkLate = false;
		scene.workLateImage.setVisible(false);
	} else if (variables.workLateTiles > 0) {	// can only pick up a tile if there are still any in inventory
		let variables = scene.gameData.teams[scene.gameData.currentTeam];
		variables.isPlayerHoldingWorkLate = true;
		scene.workLateImage.setVisible(true);
		variables.workLateTiles = variables.workLateTiles - 1;
		scene.toolbarWorkLate.buttonText.setText("Work Late\nTiles: " + variables.workLateTiles);
	}
}



/**
 * returns a work late tile
 */
function returnWorkLate(scene) {
	let variables = scene.gameData.teams[scene.gameData.currentTeam];
	variables.workLateTiles++;
	scene.gameData.teamToolbar.toolbarWorkLate.buttonText.setText("Work Late\nTiles: " + variables.workLateTiles);
}



// /**
//  * Sets all the card boxes and add card boxes for the current player to be visible or invisible
//  * @param {boolean} isVisible True = set to visible, False = set to invisible
//  */
// function toggleTeamVisibility(scene, isVisible) {
// 	//console.log(scene.stage);
// 	//console.log(isVisible + " " + scene.currentTeam);
// 	let variables = scene.teams[scene.currentTeam];
	
// 	for (let stage = 0; stage < scene.stage+1; stage++) {
// 		for (let card = 0; card < variables.get("cards")[stage].length; card++) {
// 			variables.get("cards")[stage][card].placementBox.setVisible(isVisible);
// 			variables.get("cards")[stage][card].cardText.setVisible(isVisible);
// 			variables.get("cards")[stage][card].cardImage.setVisible(isVisible);
// 		}
// 		for (let button = 0; button < scene.addCardBoxes.length; button++) {
// 			variables.get("addCardBoxes")[button].buttonBox.setVisible(isVisible);
// 			variables.get("addCardBoxes")[button].boxText.setVisible(isVisible);
// 		}
// 	}
// }



/**
 * Removes the top card from the stack and sets the id to the card the player is currently holding
 */
function pickUpCard(scene) {
	console.log("Pick up a card");
	if (scene.gameData.teamToolbar.currentCard == 0) {
		scene.gameData.teamToolbar.currentCard = scene.gameData.teamToolbar.activityCards[scene.gameData.stage].pop().id;
		scene.currentCardText.setText(scene.gameData.teamToolbar.currentCard);
		scene.currentCardImage.setVisible(true).setTexture(scene.gameData.teamToolbar.currentCard);
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
				let placements = scene.gameData.cardMap.get(this.id) == null ? ['1', '1', '1', '1'] : scene.gameData.cardMap.get(this.id).placement.split(",");
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
	let cards = scene.gameData.teams[team].cards;
	for (let stage = 0; stage <= scene.gameData.stage; stage++) {
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



export { CardBox, AddCardBox, CardDiscardBox, ToolbarButton, buttonToggle, nextHandler, startHandler, workLateHandler, pickUpCard, getIllegalPlacements };
