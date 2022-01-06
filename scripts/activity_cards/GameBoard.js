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

		if (this.distanceFromMiddle < 0) {
			// adds a new boxes at the furthest left edge and updates previous card boxes
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
			return;
		}
		
		var out = "";
		for (let i = 0; i < this.scene.cards[this.scene.stage].length; i++) {
			out += this.scene.cards[this.scene.stage][i].cardId+", ";
		}
		console.log(out);
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
		scene.currentCard = 1;
		
		scene.currentCardBox.setText(scene.currentCard);
		
		
		//TODO add something to actually check if the stack is empty (issue #34)
		var stackIsEmpty = false;
		if (stackIsEmpty) {
			goToNextStage(scene);
		}
	}
}



export { CardBox, AddCardBox, goToNextStage, pickUpCard };
