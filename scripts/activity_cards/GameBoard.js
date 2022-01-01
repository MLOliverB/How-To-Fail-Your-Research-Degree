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






// Call this function when the button to move to the next stage is pressed
function goToNextStage() {
	this.scene.cards.push(new Array(this.scene.cards[this.scene.stage-1].length).fill(0));	//add array the length of the previous array
	this.scene.stage += 1;
}

export { CardPlacementBox, AddCardPlacementBox , goToNextStage };
