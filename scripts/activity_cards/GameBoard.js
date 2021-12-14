//// Code for game board

// Class for the rectangle which can be clicked to place a card on the rectangle
class PlaceCard() {
	constructor() {
		var place_card = this.add.rectangle(x,y*1.2,width*0.19,height*0.18,0xb1cfe0);
		place_card.setInteractive();
		place_card.on("pointerover", () => {place_card.setFillStyle(0x6c95b7);});
		place_card.on("pointerout", () => {place_card.setFillStyle(0xb1cfe0);});
		place_card.on("pointerup", () => {console.log("Place card");});
	}
}


// Class for the button which can be pressed to add a new location where a card can be placed
class AddPlaceCard() {
	constructor() {
		var add_place_card = this.add.rectangle(x+x*0.25,y*1.2,width*0.04,height*0.18,0xb1cfe0);
		add_place_card.setInteractive();
		add_place_card.on("pointerover", () => {add_place_card.setFillStyle(0x6c95b7);});
		add_place_card.on("pointerout", () => {add_place_card.setFillStyle(0xb1cfe0);});
		add_place_card.on("pointerup", () => {console.log("Add a card button");});
	}
}





var cards = [];
var stage = 1;	//Stages: 1=Plan, 2=Context, 3=Implementation, 4=Write Up
cards.push([]);



// Call this function when the button to move to the next stage is pressed
function goToNextStage() {
	cards.push(new Array(cards[stage-1].length).fill(0));	//add array the length of the previous array
	stage += 1;
}



//store cards in 2D array of arrays of cards (each array of cards is one stage)
//on first stage:
//begin with one location in the middle
//once a card is added, display two empty locations on the outside edges
//once another card is added, display button to add location between the cards

//when the card is added, update the value at the position with the id of the card being added
//locations need to store their index in the array
//empty locations are represented by "0" in the array since indexing for cards starts at 1
//
