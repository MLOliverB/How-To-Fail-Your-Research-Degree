import { loadEventCard } from "../cards-management.js";
import { loadEffect } from "./tempEffect.js";
import { buttonToggle } from "../activity_cards/GameBoard.js"



class EventCard {
    constructor(scene) {
        this.scene = scene;
        this.eventBox = this.scene.add.rectangle(this.scene.x*1.81, this.scene.y*1.76, this.scene.width, this.scene.height, 0xe76f8d).setScale(0.1, 0.25).setAlpha(0);
        this.eventBox.on("pointerover", () => {
            this.eventBox.setPosition(this.scene.x*1.81, this.scene.y*1.45).setScale(0.13, 0.305);
            this.eventBack.setPosition(this.scene.x*1.81, this.scene.y*1.45).setScale(0.2);
        });
        this.eventBox.on("pointerout", () => {
            this.eventBox.setPosition(this.scene.x*1.81, this.scene.y*1.76).setScale(0.1, 0.204);
            this.eventBack.setPosition(this.scene.x*1.81, this.scene.y*1.76).setScale(0.15);
        });
        this.eventBox.on("pointerup", () => {
            if (this.scene.currentEvent == 0) {
                try {
                    eventTest(this.scene);
                }
                catch (error) {
                    if (this.scene.stage == 0) {
                        console.log("Error: no event cards\nReason: First stage has no event cards");
                    }
                    else {
                        console.log(error);
                    }
                }
            }
        });
        

        this.currentEventText = this.scene.add.text(this.scene.x*1.81, this.scene.y*1.76, '.', {color: "0x000000"}).setOrigin(0.5, 1.2).setFontSize(1);
        this.currentEventImage = this.scene.add.image(this.scene.x*1.81, this.scene.y*1.3, 70).setScale(0.25).setVisible(false);
    }
}



/**
 * A class for adding buttons above the toolbar for the event cards
 * Invisible by default
 */
class EventBarButton {
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
		
		this.button = this.scene.add.rectangle(this.scene.x*x, this.scene.y*1.64, this.scene.width, this.scene.height, 0xb1cfe0).setScale(width, 0.07).setInteractive();
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
		this.buttonText = this.scene.add.text(this.scene.x*x, this.scene.y*1.64, label, {color: "0x000000"}).setOrigin(0.5).setFontSize(15);
	}
	
	/*
	 * @param {boolean} isVisible Whether or not the button should be visible
	 */
	setVisible(isVisible) {
		this.button.setVisible(isVisible);
		this.buttonText.setVisible(isVisible);
	}
}



function pickUpEventCard(scene) {
    let variables = scene.teams[scene.currentTeam];
    
    console.log("Pick up an event card");
    if (variables.get("currentEventCard") == 0 && scene.isEventRound) {     // this check should be redundant but just in case...
        variables.set("currentEventCard", scene.eventCards[scene.stage].pop().id)
        scene.eventStack.setTexture(variables.get("currentEventCard")).setVisible(true);
		scene.eventBarPlay.setVisible(true);
		scene.eventBarStore.setVisible(true);
        console.log(variables.get("currentEventCard"));
    }
}



function useEffect(scene) {
    console.log("use event card");
    if (scene.currentEvent != 0) {
        loadEffect(scene.currentEventBox);
        scene.currentEvent = 0;
        scene.currentEventBox.setText('0');
        scene.eventBox.setVisible(true);
        scene.currentEventImage.setVisible(false);
        scene.tempText.setText('Pick card');
        scene.tempButton.setScale(0.13, 0.08);
    }
}



/**
 * Runs when the play event card button is clicked
 * Lets the player use the effects of the cards
 */
function playHandler(scene) {
	console.log("Play the event card");
	scene.eventBarPlay.setVisible(false);
	scene.eventBarStore.setVisible(false);
	scene.eventBarFinish.setVisible(true);
}



/**
 * Runs when the store event card button is clicked
 * Lets the player save a card which can be used later in their inventory
 */
function storeHandler(scene) {
	console.log("Store the event card in inventory");
}



/**
 * Runs when the finish event card button is clicked
 * Checks if the player correctly played the card
 */
function finishHandler(scene) {
	let variables = scene.teams[scene.currentTeam];
	
	console.log("Checking if player correctly used event card effects");
	let areRulesMatched = true;		// TODO: check if rules have been matched for the card
	if (areRulesMatched) {
		scene.eventBarPlay.setVisible(false);
		scene.eventBarStore.setVisible(false);
		
		scene.eventStack.setTexture("e"+scene.stage);
		if (scene.eventCardsRemaining > 0) {
			variables.set("currentEventCard", 0);
			scene.eventBarFinish.setVisible(false);
			console.log(variables.get("currentEventCard"));
		} else {
			scene.eventStack.setVisible(false);
			scene.eventBarFinish.setVisible(false);
			buttonToggle(scene.toolbarNext.button, 0, true);
		}
	}
}



export { EventCard, EventBarButton, pickUpEventCard, playHandler, storeHandler, finishHandler };
