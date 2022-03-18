import { loadEventCard } from "../cards-management.js";
import { buttonToggle, AddCardBox, CardBox, CardDiscardBox, displayCardInfo, addUnusedCardBoxes } from "../activity_cards/gameBoard.js";
import { colours, fonts } from "../theme.js";



/**
 * The cards which are used to represent an event card which is stored in inventory
 * Invisible by default
 */
class EventCard {
	/**
	 * Event cards which are in the inventory
	 * @param {Integer} id The id of the card 
	 * @param {Integer} cardPosition The position of the card in the inventory (starts at 0)
	 */
    constructor(scene, id, cardPosition) {
        this.scene = scene;
		this.cardPosition = cardPosition;
		this.id = id;
        this.isSelected = false;
        if (this.id == 0) {
            this.card = this.scene.add.image(this.scene.x*0.17+(5+666*0.47)*this.cardPosition, this.scene.y*2.15, "e1").setScale(0.47).setDepth(10).setInteractive().setVisible(false);
        } else {
            this.card = this.scene.add.image(this.scene.x*0.17+(5+666*0.47)*this.cardPosition, this.scene.y*2.15, this.id).setScale(0.47).setDepth(10).setInteractive().setVisible(false);
        }
        this.card.on("pointerup", () => {
            if (this.scene.isFacilitatorModeActive) {
                if (this.id != 0) { displayCardInfo(this.scene, this.id) }
            } else if (this.isSelected) {
			    this.card.y = this.scene.y*2.15;
                this.isSelected = false;
                this.playButton.setVisible(false);
                this.playButtonText.setVisible(false);
            } else {
                this.card.y = this.scene.y*1.55;
                this.isSelected = true;
                this.playButton.setVisible(true);
                this.playButtonText.setVisible(true);
            }
		});
        this.playButton = this.scene.add.rectangle(this.scene.x*0.17+(5+666*0.47)*this.cardPosition, this.scene.y*1.55-(this.card.height/2*0.47)+(100*0.47), this.card.width, 200, colours.get("button")).setScale(0.47).setDepth(10).setAlpha(0.8).setInteractive().setVisible(false);
        this.playButton.on("pointerover", () => {
			this.playButton.setFillStyle(colours.get("buttonHover"));
		});
		this.playButton.on("pointerout", () => {
			this.playButton.setFillStyle(colours.get("button"));
		});
        this.playButton.on("pointerup", () => {
			this.playCard();
		});
        this.playButtonText = this.scene.add.text(this.scene.x*0.17+(5+666*0.47)*this.cardPosition, this.scene.y*1.55-(this.card.height/2*0.47)+(100*0.47), "Play", fonts.get("buttonEvent")).setOrigin(0.5).setDepth(10).setVisible(false);
        
        // effectCards: array of cards that needs to be changed due to effect
        let effectCards = [];
        // elseCards: array of cards that needs to be changed due to else_condition
        let elseCards = [];
    }

    
    playCard() {
        let variables = this.scene.teams[this.scene.currentTeam];
        console.log("Play a card");
        let indexIgnore = variables.toIgnore.indexOf(this.scene.currentEventCard);
        // stored card can only be played if the player is not currently in the middle of playing another card
        if (this.scene.currentEventCard == 0) {
            this.scene.currentEventCard = this.id;
            if (this.scene.eventCardsRemaining == 0) {
                this.scene.eventStack.setVisible(true);
            }
            this.scene.eventStack.setTexture(this.scene.currentEventCard);
		    this.scene.eventBarPlay.setVisible(true);
            if (booleanSave) {
                this.scene.eventBarStore.setVisible(true);
            } else {
                this.scene.eventBarStore.setVisible(false);
            }
        }
        // stored card can be used to ignore the effect of the current event card
        else if (indexIgnore != -1 && this.id == variables.ignoreEff[indexIgnore]) {
            console.log("Use this card to ignore current event card");
            this.scene.ignored = true;
        }
        
        this.id = 0;
        this.setVisible(false);
    }


    /**
     * @param {boolean} isVisible Whether or not this should be visible
     */
    setVisible(isVisible) {
        if (isVisible && this.id != 0) {
            this.card.setVisible(true);
            if (this.isSelected) {
                this.playButton.setVisible(true);
                this.playButtonText.setVisible(true);
            }
        } else {
            this.card.setVisible(false);
            this.playButton.setVisible(false);
            this.playButtonText.setVisible(false);
        }
    }


    switchCard(id, stage) {
        this.id = id;
        this.card.setTexture(id);
        this.stage = stage;
    }
}


/**
 * The cards which are used to represent an activity card which is stored in inventory
 * Visible but uninteractive by default
 */
class ActivityCard {
	/**
	 * activity cards which are in the inventory
	 * @param {Integer} id The id of the card 
     * @param {Integer} stage The stage of the card 
	 * @param {Integer} cardPosition The position of the card in the inventory (starts at 0)
	 */
    constructor(scene, id, stage, cardPosition) {
        this.scene = scene;
		this.cardPosition = cardPosition;
		this.id = id;
        this.stage = stage;
        this.isSelected = false;
        if (this.id == 0) {
            this.card = this.scene.add.image(this.scene.x*0.17+(5+200*0.235)*this.cardPosition, this.scene.y*1.85, "a0").setScale(0.47).setDepth(10).setInteractive().setVisible(false);
        } else {
            this.card = this.scene.add.image(this.scene.x*0.17+(5+200*0.235)*this.cardPosition, this.scene.y*1.85, this.id).setScale(0.47).setDepth(10).setInteractive().setVisible(false);
        }
        this.card.on("pointerup", () => {
            if (this.scene.isFacilitatorModeActive) {
                if (this.id != 0) { displayCardInfo(this.scene, this.id) }
            } else if (this.isSelected) {
			    this.card.y = this.scene.y*1.85;
                this.isSelected = false;
                this.playButton.setVisible(false);
                this.playButtonText.setVisible(false);
            } else {
                this.card.y = this.scene.y*1.55;
                this.isSelected = true;
                this.playButton.setVisible(true);
                this.playButtonText.setVisible(true);
            }
		});
        this.playButton = this.scene.add.rectangle(this.scene.x*0.17+(5+200*0.235)*this.cardPosition, this.scene.y*1.55-(this.card.height/2*0.235)+(100*0.235), this.card.width, 200, colours.get("button")).setScale(0.235).setDepth(10).setAlpha(0.8).setInteractive().setVisible(false);
        this.playButton.on("pointerover", () => {
			this.playButton.setFillStyle(colours.get("buttonHover"));
		});
		this.playButton.on("pointerout", () => {
			this.playButton.setFillStyle(colours.get("button"));
		});
        this.playButton.on("pointerup", () => {
			this.actPlayCard();
		});
        this.playButtonText = this.scene.add.text(this.scene.x*0.17+(5+200*0.235)*this.cardPosition, this.scene.y*1.55-(this.card.height/2*0.235)+(100*0.235), "Play", fonts.get("button")).setOrigin(0.5).setDepth(10).setVisible(false);
        
        // activityCards: array of cards that needs to be stored due to effect
        let activityCards = [];
    }

    
    actPlayCard() {
        let variables = this.scene.gameData.teams[this.scene.gameData.currentTeam];
        console.log("Play a card");
        // stored card can only be played if the player is not currently in the middle of playing another card and stage is correct
        console.log(this.scene.gameData.teamToolbar.currentCard, this.stage, this.scene.gameData.stage);
        if (this.scene.gameData.teamToolbar.currentCard == 0 && this.stage-1 == this.scene.gameData.stage) {
            this.scene.gameData.teamToolbar.currentCard = this.id;
            this.scene.currentCardText.setText(this.scene.gameData.teamToolbar.currentCard);
            this.scene.currentCardImage.setVisible(true).setTexture(this.scene.gameData.teamToolbar.currentCard);
            
            this.id = 0;
            this.stage = null;
            this.setVisible(false);
            
            // deactivate selection of card
            this.card.y = this.scene.y*1.85;
            this.isSelected = false;
            this.playButton.setVisible(false);
            this.playButtonText.setVisible(false);
        }
        else {
            console.log("Cannot play card: Card stage is not the current stage");
        }
    }


    /**
     * @param {boolean} isVisible Whether or not this should be visible
     */
    setVisible(isVisible) {
        if (isVisible && this.id != 0) {
            this.card.setVisible(true);
            if (this.isSelected) {
                this.playButton.setVisible(true);
                this.playButtonText.setVisible(true);
            }
        } else {
            this.card.setVisible(false);
            this.playButton.setVisible(false);
            this.playButtonText.setVisible(false);
        }
    }


    switchCard(id, stage) {
        this.id = id;
        this.card.setTexture(id);
        this.stage = stage;
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
     * @param {number} y The vertical position of the button (from 0-1)
	 * @param {number} width The width of the button (from 0-1 as a fraction of the width of the screen)
	 * @param {text} label The text that will appear on the button
	 * @param {function} onClick The function that runs when the button is clicked (pass "undefined" for no action)
	 * @param {function} onOver The function that runs when the cursor is hovering over the button (pass "undefined" for no action)
	 * @param {function} onOut The function that runs when the cursor moves away from the button (pass "undefined" for no action)
	*/
	constructor(scene, x, y, width, label, onClick, onOver, onOut) {
		this.scene = scene;
		
		this.button = this.scene.add.rectangle(this.scene.x*x, this.scene.y*y*1.63, this.scene.width, this.scene.height, colours.get("buttonEvent")).setScale(width, 0.07).setInteractive();
		if (onOver != undefined) {
			this.button.on("pointerover", () => { onOver(this.scene) });
		} else {
			this.button.on("pointerover", () => { this.button.setFillStyle(colours.get("buttonEventHover")); });
		}
		if (onOut!= undefined) {
			this.button.on("pointerout", () => { onOut(this.scene) });
		} else {
			this.button.on("pointerout", () => { this.button.setFillStyle(colours.get("buttonEvent")); });
		}
		if (onClick != undefined) {
			this.button.on("pointerup", () => { onClick(this.scene) });
		}
		this.buttonText = this.scene.add.text(this.scene.x*x, this.scene.y*y*1.63, label, fonts.get("buttonEvent")).setOrigin(0.5);
	}
	
	/*
	 * @param {boolean} isVisible Whether or not the button should be visible
	 */
	setVisible(isVisible) {
		this.button.setVisible(isVisible);
		this.buttonText.setVisible(isVisible);
	}
}



/**
 * Get all card IDs from gameboard
 * @param {Array(CardBox)} array The 2D array of cards of the current team
 * @returns A 1D array of card IDs of the current team
 */
function countIds(array) {
    // first row
    if (array[0] == null) { var firstCards = [0];}
    else { var firstCards = array[0]; }
    // second row
    if (array[1] == null) {var secondCards = [0];}
    else {var secondCards = array[1];}
    // third row
    if (array[2] == null) {var thirdCards = [0];}
    else {var thirdCards = array[2];}
    // fourth row
    if (array[3] == null) {var fourthCards = [0];}
    else{var fourthCards = array[3];}

    var arrayFirst = []; var arraySecond = [];
    var arrayThird = []; var arrayFourth = [];
    for (let i = 0; i < firstCards.length; i++) {
        var x = firstCards[i].cardId;
        if (x == "ï»¿1") {
            x = 1;
        }
        arrayFirst.push(x);
    }
    for (let i = 0; i < secondCards.length; i++) {
        var x = secondCards[i].cardId;
        arraySecond.push(x);
    }
    for (let i = 0; i < thirdCards.length; i++) {
        var x = thirdCards[i].cardId;
        arrayThird.push(x);
    }
    for (let i = 0; i < fourthCards.length; i++) {
        var x = fourthCards[i].cardId;
        arrayFourth.push(x);
    }
    // put all four rows into one array
    var arrayAll = [];
    arrayAll.push(arrayFirst, arraySecond, arrayThird, arrayFourth);
    // remove undefined elements
    for (var i = 0; i < arrayAll.length; i++) {
        for (var j = 0; j < arrayAll[i].length; j++) {
            if (arrayAll[i][j] == undefined) {
                arrayAll[i].splice(j, 1);
                j--;
            }
        }
    }
    //console.log(arrayAll);
    return (arrayAll);
}



/**
 * Get matching cardIDs from activity cards array and required cards
 * taken from: https://www.tutsmake.com/javascript-compare-two-arrays-for-matches/
 * @param {Array(cardId)} arr1 
 * @param {Array(cardId)} arr2 
 * @returns A 1D array of cardId objects which were in both input arrays
 */
function arrayMatch(arr1, arr2) {
    var arr = new Array();  // Array to contain match elements
        for(var i=0 ; i<arr1.length ; ++i) {
            for(var j=0 ; j<arr2.length ; ++j) {
                if(arr1[i] == arr2[j]) {    // If element is in both the arrays
                arr.push(arr1[i]);        // Push to arr array
            }
        }
    }
    return arr;  // Return the arr elements
}



/**
 * function for filtering same card IDs
 * @param {*} valToBeChecked 
 * @param {*} valChecked 
 * @returns Boolean of if the two values are equal
 */
function matchCount(valToBeChecked, valChecked) {
    return valToBeChecked == valChecked;
}

/**
 * Get count of all occurrences of each activity card ID
 * taken from: https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
 * @param {*} array 
 * @returns 
 */
function countCardOccurrences(array){
    var arrayAll = array;
    const occurrences = arrayAll.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc }, {});
    console.log(occurrences);
    // array of ids and array of count
    /*const ids = Object.keys(occurrences);
    const count = Object.values(occurrences);
    console.log(ids);
    console.log(count);*/
    
    return occurrences;
}



/**
 * check if both arrays are equal
 * taken from: https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
 */
// Warn if overriding existing method
if(Array.prototype.equals)
console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});



/**
 * get effects based on requirements
 */
function useEffect(scene) {
    console.log("use event card");
    //pickUpEventCard(scene);
    let variables = scene.gameData.teams[scene.gameData.currentTeam];
    
    let fulfilled = false;
    
    // current event card in hand
    let holdEventID = scene.gameData.cardMap.get(scene.gameData.teamToolbar.currentEventCard);
    // all cards in array
    var arrayAll = scene.previousCardArray;
    let arrayAll_concat = arrayAll[0].concat(arrayAll[1], arrayAll[2], arrayAll[3]);
    // array of all cards with its number of occurrences
    let cardArray = countCardOccurrences(arrayAll_concat);
    const idArray = Object.keys(cardArray);
    const countArray = Object.values(cardArray);
    
    // for console log
    var chosenTitle = holdEventID.title.toString();

/*
 * All arrays for Requirements, Effects, and Else_condition
 */
    
    // toBeAbsent = cardID(s) that shouldn't appear
    // absCondition = number of cardID(s) that shouldn't appear (optional)
    // toBePresent = cardID(s) that should appear
    // preCondition = number of cardID(s) that should appear (optional)
    var toBeAbsent = new Array();
    var absCondition = new Array();
    var toBePresent = new Array();
    var preCondition = new Array();
    
    // action = action taken
    // adjacency = whether cards have to be adjacent
    // forAction = action taken on cardID(s)
    // totalAmount = total amount of card(s)
    // cardStage = stage(s) of card to take action
    var action = new Array();
    var adjacency = new Array();
    var forAction = new Array();
    var totalAmount = new Array();
    var cardStage = new Array();
    
    // wholeEffect = all actions of card
    var wholeEffect = new Array();
    
    // sAct = action taken for either effect or else (original form: one letter)
    var sAct = new Array();
    
    /*
     * get requirement(s) of chosen card and check if requirement is met
     */
    function booleanRequirement(scene) {
        // get requirement(s) of chosen card
        var chosenRequirement = holdEventID.requirement.toString();
        // if double requirements, split string into separate
        //requirements before splitting the requirement into a:b
        /*
        splitRequirement[order of requirement][a or b][first index]
            e.g. splitRequirement[0][0][0]: first index of first requirement's "a"
        */
        var doubleRequirement = chosenRequirement.split(/&(?=!)/);
        var splitRequirement = new Array();
        for (var i = 0; i < doubleRequirement.length; i++) {
            var x = doubleRequirement[i].split(/:/);
            splitRequirement[i] = x.toString();
        }

        // requirement of card chosen in order to take effect
        // check if value is Null
        if(splitRequirement[0].includes('Null')) {
            console.log(`There are no requirements.`);
            return true;
        }
        else {
            for (var i = 0; i < splitRequirement.length; i++) {
                let appearance = splitRequirement[i].includes('!');
                let condition = splitRequirement[i].includes('>');
                var card;

                // check for "!" symbol at start to see if card must appear or not
                if(appearance) {
                    // check if there is any condition(b) for the number of cards to appear/not appear
                    if(condition) {
                        var times = splitRequirement[i].slice(-1);
                        absCondition.push(times);
                        var temp = splitRequirement[i].slice(0,-2);
                        card = temp.match(/\d+/g);
                        toBeAbsent.push(card);
                    }
                    // if there is no condition, push 0 into the list of conditions
                    else {
                        absCondition.push('0');
                        card = splitRequirement[i].match(/\d+/g);
                        toBeAbsent.push(card);
                    }
                }
                else {
                    // check if there is any condition(b) for the number of cards to appear/not appear
                    if(condition) {
                        var times = splitRequirement[i].slice(-1);
                        preCondition.push(times);
                        var temp = splitRequirement[i].slice(0,-2);
                        card = temp.match(/\d+/g);
                        toBePresent.push(card);
                    }
                    // if there is no condition, push 1 into the list of conditions
                    else {
                        preCondition.push('1');
                        card = splitRequirement[i].match(/\d+/g);
                        toBePresent.push(card);
                    }
                }
            }
            if((!toBePresent.length) && (toBeAbsent.length)){
                console.log(`Title of event card: ${chosenTitle} \n
                            Requirement -\n
                            Card(s) that should be absent: ${toBeAbsent}\n
                            Specific number of card(s) not to exceed: ${absCondition}`);
            }
            if((!toBeAbsent.length) && (toBePresent.length)){
                console.log(`Title of event card: ${chosenTitle} \n
                        Requirement -\n
                        Card(s) that should be present: ${toBePresent}\n
                        Specific number of card(s) necessary: ${preCondition}`);
            }
        }

        // check if requirement is met
        var booleanArr = new Array();
        //console.log(toBeAbsent, toBePresent);
        if(toBeAbsent.length) {
            for (var i = 0; i < toBeAbsent.length; i++) {
                var temp = toBeAbsent[i][0];
                var index = idArray.indexOf(temp);
                var number = countArray[index];
                console.log(index, number);
                if (number == undefined) {
                    number = 0;
                }
                if (number > absCondition[i]) {
                    console.log("requirement not fulfilled, cannot use effect");
                    booleanArr.push(false);
                }
                else {
                    console.log("requirement fulfilled, move to next requirement");
                    booleanArr.push(true);
                }
            }
        }
        else {
            booleanArr.push(true);
        }
        if(toBePresent.length) {
            for (var i = 0; i < toBePresent.length; i++){
                var temp = toBePresent[i][0];
                var index = idArray.indexOf(temp);
                var number = countArray[index];
                console.log(index, number);
                if (number == undefined) {
                    number = 0;
                }
                if (number < preCondition) {
                    console.log("requirement not fulfilled, cannot use effect");
                    booleanArr.push(false);
                }
                else {
                    console.log("requirement fulfilled, move to next requirement");
                    booleanArr.push(true);
                }
            }
        }
        else {
            booleanArr.push(true);
        }
        
        if (!booleanArr.includes(false)) {
            return true;
        }
        else {
            return false;
        }
    }
    

    if (booleanRequirement(scene)) {    // if requirements are fulfilled, can use effect
        fulfilled = true;
        /*
         * get effect(s) of chosen card
         */
        var chosenEffect = holdEventID.effect.toString();
        
        //splitting the effect into a:b:c (0:1:2)
        //splitEffect[order of effect][a, b, or c][first index]
        //e.g. splitEffect[0][0][0]: first index of first effect's "a"

        var doubleEffect = chosenEffect.split(/&(?!\d)/);
        var splitEffect = new Array();
        if (holdEventID == "62") {
            var temp = "n0:2:2";
            splitEffect = temp.split(/:/);
        }
        for (var i = 0; i < doubleEffect.length; i++) {
            var x = doubleEffect[i].split(/:/);
            splitEffect[i] = x;
        }

        // effect of card chosen
        for (var i = 0; i < splitEffect.length; i++) {
            obtainEffect(splitEffect[i]);
        }

    } 
    else {  // if requirements not fulfilled, go to else condition and use (if exists)
        fulfilled = false;
        /*
         * get else condition of chosen card
         */
        var chosenElse = holdEventID.else_condition.toString();
        var splitElse;
        if (holdEventID == "62") {
            var temp = "n0:1:2";
            splitElse = temp.split(/:/);
        }
        else {
            splitElse = chosenElse.split(/:/);
        }

        // check if value is Null
        if(splitElse.includes('Null')){
            console.log('There are no else effects');
        }
        else{
            obtainEffect(splitElse);
        }
    }
    
    /*
     * load effects (method extracted from Effect and Else)
     */
    function obtainEffect(array) {
        // temp values
        var card;
        var stage;
        var amount;
        var singleEffect = new Array();

        /*
        check the a:b:c :
        a = specific ID of card (0 = not a specific card, -(...) = non-adjacent cards)
        b = total number of cards to change
        c = stage of card if not a specific card (optional)
        */

        // check if cards to take action upon should be adjacent
        if(array[0].includes('-')){
            adjacency.push('non-adjacent');
        }
        else{
            adjacency.push('null');
        }

        /*
        check for action taken on card based on first letter:
        n = remove a card
        p = add a card
        s = stand in for a card
        o, b = block out spaces
        i = ignore effects of another event card
        f = flip card
        l = placeholder (for default)
        */
        switch(array[0][0]) {
            case "n":
                action.push('Remove card');
                sAct.push("n");
                break;
            case "p":
                action.push('Add card');
                sAct.push("p");
                break;
            case "s":
                action.push('Stand in for');
                sAct.push("s");
                break;
            case "o":
            case "b":
                action.push('Block out');
                sAct.push("o");
                break;
            case "i":
                action.push('Ignore effects of');
                sAct.push("i");
                break;
            case "f":
                action.push('Flip card');
                sAct.push("f");
            default:
                console.log('none');
                sAct.push("l");
        }

        card = array[0].match(/\d+/g);
        // check if there is/are specific cardID(s) to take action
        if(card=='0'){
            forAction.push('0');
        }
        else{
            forAction.push(card);
        }

        // check for total number of cards to take action
        amount = array[1].match(/\d+/g);
        totalAmount.push(amount);

        // check if stage of card is stated
        if(array[2]){
            stage = array[2].match(/\d+/g);
            cardStage.push(stage);
        }
        else {
            cardStage.push(holdEventID.stage.toString());
        }

        console.log(`Title of event card: ${chosenTitle} \n
                        Effect - \n
                        Action to take: ${action}\n
                        CardID(s): ${forAction}\n
                        Number of card(s)/space(s): ${totalAmount}\n
                        Stages: ${cardStage}`);
        
        if (fulfilled) {
            singleEffect.push(sAct[i], adjacency[i], forAction[i], totalAmount[i], cardStage[i], chosenTitle);
        }
        else {
            singleEffect.push(sAct, adjacency, forAction, totalAmount, cardStage, chosenTitle);
        }
        //console.log(singleEffect);
        wholeEffect.push(singleEffect);
        console.log(wholeEffect);
    }
    return wholeEffect;
}



/**
 * find out the ideal count of occurrences after using event card
 * @param {*} scene 
 * @returns ideal total occurrence(s) of card(s) or empty space(s)
 */
function checkEffect(scene){
    let variables = scene.gameData.teams[scene.gameData.currentTeam];
    // current event card in hand
    let holdEventID = scene.gameData.cardMap.get(scene.gameData.teamToolbar.currentEventCard);
    /*
     * wholeEffect[i][0]: action (e.g. n = remove, p = add, ...)
     * wholeEffect[i][1]: adjacency
     * wholeEffect[i][2]: forAction, i.e. cardID(s) that needs to take action
     * wholeEffect[i][3]: totalAmount of cards/spaces to change
     * wholeEffect[i][4]: cardStage
     * wholeEffect[i][5]: title of card
     */
    let wholeEffect = useEffect(scene);
    
    // previous: previous/original card array before making changes
    // previousCount: occurrences of each activity card before making changes
    let previous = scene.previousCardArray;
    let previous_concat = previous[0].concat(previous[1], previous[2], previous[3]);
    let previousCount = countCardOccurrences(previous_concat);
    let previousCountId = Object.keys(previousCount);
    let previousCountOcc = Object.values(previousCount);
    
    // previousCountFull: occurrences of each activity card before making changes (without empty spaces)
    let previousCountFull = previousCount;
    delete previousCountFull["0"];
    let previousCountFullOcc = Object.values(previousCountFull);
    let previousTotalFull = previousCountFullOcc.reduce((a, b) => a + b, 0);
    //console.log(previousCount, previousCountFull);
    //console.log(previousTotalFull);
    
    // previousStage_1: occurrences of card from the first stage
    // previousStage_2: occurrences of card from the second stage
    // previousStage_3: occurrences of card from the third stage
    // previousStage_4: occurrences of card from the forth stage
    let previousStage_1 = previous[0];
    let previousStage_2 = previous[1];
    let previousStage_3 = previous[2];
    let previousStage_4 = previous[3];
    //console.log(previousStage_1, previousStage_2, previousStage_3, previousStage_4);
    
    let prev_1Count = countCardOccurrences(previousStage_1);
    let prev_2Count = countCardOccurrences(previousStage_2);
    let prev_3Count = countCardOccurrences(previousStage_3);
    let prev_4Count = countCardOccurrences(previousStage_4);
    
    // ideal: end result of total occurrences after making changes
    let ideal = new Array();
    
    for (var i = 0; i < wholeEffect.length; i++) {
        var effect = wholeEffect[i];
        
        // array that will be used depending on stage(s) shown on card
        let stage_counts = new Array();
        
        for (var y = 0; y < effect[4].length; y++) {
            console.log(effect[4][y]);
            let stage = parseInt(effect[4][y]);
            if (stage === 1) {
                stage_counts = stage_counts.concat(previousStage_1);
            }
            else if (stage === 2) {
                stage_counts = stage_counts.concat(previousStage_2);
            }
            else if (stage === 3) {
                stage_counts = stage_counts.concat(previousStage_3);
            }
            else if (stage === 4) {
                stage_counts = stage_counts.concat(previousStage_4);
            }
        }
        
        let stage_depends = countCardOccurrences(stage_counts);
        delete stage_depends["0"];
        let stage_id = Object.keys(stage_depends);
        let stage_occ = Object.values(stage_depends);
        let stage_total = stage_occ.reduce((a, b) => a + b, 0);
        console.log(stage_id, stage_occ, stage_total);
        
        // totalCount: original occurrences of selected card(s)
        let totalCount = 0;
        // exceed: used in add cards -> empty spaces < required
        let exceed = 0;
        
        // get total occurrence(s) of cardID(s) 
        for (var x = 0; x < effect[2].length; x++) {
            var temp = parseInt(effect[2][x]);
            var index = stage_id.indexOf(temp);
            console.log(temp, index);
            if (temp == "0") {                          // card is not specified
                totalCount += parseInt(stage_total);    // totalCount = number of total cards of stated stages
            } 
            else {                                      // card is specified
                if (index == "-1") {                    // card doesn't exist
                    totalCount += 0;                    // occurrence = 0
                }
                else {
                    totalCount += stage_occ[index];     // totalCount = original occurrence
                }
            }
        }
        console.log("original: "+totalCount);
        
        // only used for remove and flip cards
        let required = 0;
        if (stage_total < parseInt(effect[3])){ // cards on board < required (certain stage)
            required = stage_total;             // only remove number of cards from that stage
        }
        else {
            required = parseInt(effect[3]);     // can remove required number of cards 
        }
        
        // check action to change number of totalCount
        switch (effect[0]){
            // remove card
            case "n":
                if (effect[2][0] == "0") {                      // no required cardID -> totalCount = number of cards
                    if (required == 0) {                        // no cards on board for stage
                        scene.ignored = true;                   // ignore effect
                    }
                    else {                                      // have cards
                        totalCount -= required;                 // number of cards reduce by required
                    }
                }
                else {                                          // have required cardID
                    if(totalCount == 0) {                       // card doesn't exist 
                        scene.ignored = true;                   // ignore effect
                    }
                    else if (totalCount < required) {           // card < required
                        totalCount = 0;                         // remove all occurrence(s) of card
                    }
                    else {                                      // card >= required
                        totalCount -= required;                 // card occurrences reduce by required
                    }
                }
                break;
            // add card
            case "p":     
                if (effect[2][0] == "0") {                      // no required cardID -> totalCount = number of cards
                    totalCount = previous.length + parseInt(effect[3]);// card array increase by required amount
                }
                else {                                          // have required cardID
                    totalCount += parseInt(effect[3]);          // number of card occurrence(s) increase by requirement
                }
                break;
            // stand in for card
            case "s":
                console.log("stand in for "+effect[2]);
                scene.ignored = true;   // can save card in inventory for later use, so no changes needed to be done
                break;
            // block out spaces
            case "o":
            case "b":
                if (!effect[4].includes(scene.stage)) {             // stage to block out is not this stage
                    scene.ignored = true;                           // ignore effect
                }
                else {                                              // stage to block out = this stage
                    console.log("block out "+effect[3]+" spaces");
                    totalCount = parseInt(effect[3]);               // blocked out spaces = required
                }
                break;
            // ignore effects of card
            case "i":
                console.log("ignore "+effect[2]);
                scene.ignored = true;          // ignore effect 
                
                // push event card into array for later use (only works if stored in inventory)
                let itemp = [];
                if (variables.ignoreEff != undefined) {
                    itemp = variables.ignoreEff;
                }
                itemp.push(holdEventID);
                variables.set("ignoreEff", itemp);
                // push event card to be ignored into array for later use (if picked up the card)
                if (variables.toIgnore != undefined) {
                    itemp = variables.toIgnore;
                }
                itemp.push(effect[2]);
                variables.toIgnore = itemp;
                break;
            // flip card
            case "f":
                if (effect[2][0] == "0") {                  // no required cardID --> totalCount = number of cards
                    if (previousCountOcc[0] == previous.length) {      // no cards on board
                        scene.ignored = true;                          // ignore effect
                    }
                    else {                                  // have cards on board
                        totalCount = required;              // flipped cards = required
                    }
                }
                else {                                      // have required cardID 
                    if (totalCount == 0) {                  // card to be flipped doesn't exist
                        scene.ignored = true;               // ignore effect
                    }
                    else if (totalCount < required) {       // cards on board < required
                        totalCount += 0;                    // flip all cards
                    }
                    else {                                  // card(s) on board >= required number 
                        totalCount = required;              // number of cards to be flipped = required
                    }
                }
                console.log("flip "+ effect[3] + "/" + totalCount + " cards");
                
                break;
            default:
                console.log("no action");
        }
        //console.log("ideal: "+totalCount);
        
        // push totalCount and related cardIDs into ideal as 2D array
        var tempArray = new Array();
        tempArray.push(totalCount, effect[2]);
        ideal.push(tempArray);
    }
    console.log(ideal);
    return ideal;
}



/**
 * compare ideal card array with current card array to see if cards are changed correctly
 */
function areRulesMatched(scene) {
    let variables = scene.gameData.teams[scene.gameData.currentTeam];
    let ideal = checkEffect(scene);
    let current = new Array();
    
    // current array of cardIds
    let curArray = countIds(variables.cards);
    let curArray_concat = curArray[0].concat(curArray[1], curArray[2], curArray[3])
    let currentArray = countCardOccurrences(curArray_concat);
    let currentArrayId = Object.keys(currentArray);
    let currentArrayOcc = Object.values(currentArray);
    
    // previous: previous/original card array before making changes
    // previousCount: occurrences of each activity card before making changes
    let previous = scene.previousCardArray;
    let previous_concat = previous[0].concat(previous[1], previous[2], previous[3]);
    let previousCount = countCardOccurrences(previous_concat);
    let previousCountId = Object.keys(previousCount);
    let previousCountOcc = Object.values(previousCount);
    
    // currentStage_1: occurrences of card from the first stage
    // currentStage_2: occurrences of card from the second stage
    // currentStage_3: occurrences of card from the third stage
    // currentStage_4: occurrences of card from the forth stage
    let currentStage_1 = curArray[0];
    let currentStage_2 = curArray[1];
    let currentStage_3 = curArray[2];
    let currentStage_4 = curArray[3];
    
    let cur_1Count = countCardOccurrences(currentStage_1);
    let cur_2Count = countCardOccurrences(currentStage_2);
    let cur_3Count = countCardOccurrences(currentStage_3);
    let cur_4Count = countCardOccurrences(currentStage_4);
    
    let wholeEffect = useEffect(scene);
    console.log(ideal);
    let matched = false;
    
    if (scene.ignored) {
        return true;
    }
    else {
        // get current card array
        for (var i = 0; i < wholeEffect.length; i++) {
            var effect = wholeEffect[i];
            
            // array that will be used depending on stage(s) shown on card
            let stage_counts = new Array();
        
            for (var y = 0; y < effect[4].length; y++) {
                console.log(effect[4][y]);
                let stage = parseInt(effect[4][y]);
                if (stage === 1) {
                    stage_counts = stage_counts.concat(currentStage_1);
                }
                else if (stage === 2) {
                    stage_counts = stage_counts.concat(currentStage_2);
                }
                else if (stage === 3) {
                    stage_counts = stage_counts.concat(currentStage_3);
                }
                else if (stage === 4) {
                    stage_counts = stage_counts.concat(currentStage_4);
                }
            }
        
            let stage_depends = countCardOccurrences(stage_counts);
            delete stage_depends["0"];
            let stage_id = Object.keys(stage_depends);
            let stage_occ = Object.values(stage_depends);
            let stage_total = stage_occ.reduce((a, b) => a + b, 0);
            console.log(stage_id, stage_occ, stage_total);
            
            // totalCount: current occurrences of selected card(s)
            let totalCount = 0;
            // get total occurrences for all selected card(s)
            for (var x = 0; x < effect[2].length; x++) {
                var temp = effect[2][i];
                var index = currentArrayId.indexOf(temp);
                // card is not specified
                if (temp == "0") {
                    if (effect[0] == "p") {             // effect is to add cards without specified ids 
                        totalCount += curArray.length;   // total count = length of current array 
                    }
                    else if (effect[0] == "n") {        // effect is to remove cards
                        totalCount += stage_total;       // total count = total number of cards on board currently
                    }
                    else if (effect[0] == "b" || effect[0] == "o") {    // effect is to block out spaces
                        totalCount += scene.numberBlocked;
                    }
                    else if (effect[0] == "f") {        // effect is to flip cards
                        totalCount += scene.numberFlipped;
                    }
                } 
                // card is specified
                else {
                    // card doesn't exist
                    if (index == "-1") {
                        totalCount += 0;
                    }
                    else {
                        totalCount += currentArrayOcc[index];
                        console.log(currentArrayOcc[index]);
                    }
                }
            }
            console.log(totalCount);
            // push totalCount and related cardIDs into current as 2D array
            var tempArray = new Array();
            tempArray.push(totalCount, effect[2]);
            current.push(tempArray);
        }
        console.log(current);
        if (scene.ignored) {
            matched = true;
        }
        else {
            // compare ideal and current
            if (!ideal.length) {
                matched = true;
            }
            else if (ideal.equals(current)) {
                console.log("correct changes");
                matched = true;
            }
            else {
                console.log("rules are not matched");
                console.log("ideal: "+ideal + "\ncurrent: "+current);
                matched = false;
            }
        }
    }
    return matched;
}



/**
 * Check the save_condition of chosen card
 */
function booleanSave(scene) {
    let variables = scene.gameData.teams[scene.gameData.currentTeam];
    // current event card in hand
    let holdEventID = scene.gameData.cardMap.get(scene.gameData.teamToolbar.currentEventCard);
    // array to check for cards required to be stored
    var requiredCards = new Array();
    var saveCon = new Array();
    var chosenSave = holdEventID.save_conditon.toString();
    var splitSave = chosenSave.split(/:/);
    if (splitSave.includes('TRUE')){
        return true;
    }
    else if (!splitSave.includes('Null')) {
        var card = splitSave[0].match(/\d+/g);
        requiredCards.push(card);
        var con = splitSave[0].match(/\d+/g);
        var saveCon = con;
        console.log(`TItle of event card: ${chosenTitle} \n
                    Save condition - \n
                    CardID(s): ${requiredCards}\n
                    Require at least ${saveCon}`);
        if(arrayMatch(requiredCards, ids).length >= saveCon) {
            return true;
        }
        else {
            console.log("Required cards do not exist on board");
            return false;
        }
    }
    else {
        console.log("This card cannot be stored");
        return false;
    }
}



/**
 * ?
 * @param {*} scene 
 * @returns 
 */
function effectDiscard(scene) {
    var variables = scene.gameData.teams[scene.gameData.currentTeam];
    scene.previousCardArray = countIds(variables.cards);
    let wholeEffect = useEffect(scene);
    let stage = new Array();
    for (var i = 0; i < wholeEffect.length; i++) {
        var temp = wholeEffect[i];
        var x = temp[4];
        stage.push(x);
    }
    if (scene.currentCard != scene.activityCards[stage][i].id) {
        return false;
    }
    else {
        return true;
    }
}


/**
 * Picks up an event card from the top of the stack
 * Card id is returned in "currentEventCard" in the current team's variables
 */
function pickUpEventCard(scene) {
    let variables = scene.gameData.teams[scene.gameData.currentTeam];
    scene.previousCardArray = countIds(variables.cards);
    console.log(scene.previousCardArray);
    scene.completeEffect = false;
    scene.blockedOut = false;
    
    console.log(scene);
    console.log("Pick up an event card");
    console.log(scene.currentEventCard);
    console.log(scene.isEventRound);
    if (scene.currentEventCard == 0 && scene.isEventRound) {     // this check should be redundant but just in case...
        scene.currentEventCard = scene.eventCards[scene.gameData.stage].pop().id;
        scene.eventStack.setTexture(scene.currentEventCard);
		scene.eventBarPlay.setVisible(true);
        if (booleanSave) {
            scene.eventBarStore.setVisible(true);
        } else {
            scene.eventBarStore.setVisible(false);
        }
        console.log(scene.currentEventCard);
    }
}



/**
 * Runs when the play event card button is clicked
 * Lets the player use the effects of the cards
 */
function playHandler(scene) {
	console.log("Play the event card");
    var variables = scene.gameData.teams[scene.gameData.currentTeam];
    let wholeEffect = useEffect(scene);
    let stage = new Array();
    for (var i = 0; i < wholeEffect.length; i++) {
        var temp = wholeEffect[i];
        var x = temp[4];
        stage.push(x-1);
        
        if (temp[0].includes("s")) {
            alert(`You can get ${temp[5]} from the stack and save in inventory for later use`);
        }
    }

    // allow activity cards to be played (overrides illegal moves)
    buttonToggle(scene.toolbarDiscard, 0, true);
    buttonToggle(scene.currentCardBox, 1, true);
	
    // stages will become interactive and all card components visible depending on stage specified
    for (let i = 0; i <= scene.gameData.stage; i++) {
        if (stage.includes(i)) {
            for (let j = 0; j < variables.cards[i].length; j++) {
                variables.cards[i][j].setVisible(true, true);
            }
        }
        if (variables.cards[i].cardId == 0) {
			variables.cards[i].setVisible(true, true);
		}
    }
    
    for (let i = 0; i < variables.addCardBoxes.length; i++) {
        variables.addCardBoxes[i].setVisible(true, true);
    }
    
    addUnusedCardBoxes(scene);
    
    scene.eventBarPlay.setVisible(false);
    scene.eventBarStore.setVisible(false);
    scene.eventBarFinish.setVisible(true);
    scene.eventBarActStore.setVisible(true);
    scene.eventBarFlip.setVisible(true);
    
}



/**
 * Runs when the store event card button is clicked
 * Lets the player save a card which can be used later in their inventory
 */
function storeHandler(scene) {
    console.log("Store the event card in inventory");
    let variables = scene.gameData.teams[scene.gameData.currentTeam];
    let cards = variables.eventCards;
    let stored = false;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].id == 0) {
            cards[i].switchCard(scene.currentEventCard);
            scene.currentEventCard = 0;
            if (scene.isInventoryOpen) {
                cards[i].setVisible(true);
            }
            console.log("ID: "+cards[i].id);
            scene.eventStack.setTexture("e"+scene.gameData.stage);
            stored = true;
            break;
        }
    }

    if (!stored) {
        console.log("Error: No card storage slots remaining because this code sucks");
    } else {
        scene.eventBarStore.setVisible(false);
        scene.eventBarPlay.setVisible(false);
        endCard(scene);
    }
}



/**
 * Runs when the store activity card button is clicked
 * Lets the player save a card which can be used later in their inventory
 */
function activityStoreHandler(scene) {
    console.log("Store the activity card in inventory");
    let variables = scene.gameData.teams[scene.gameData.currentTeam];
    let cards = variables.activityCards;
    let currentCard = scene.gameData.cardMap.get(scene.currentCard);
    console.log(currentCard);
    console.log(currentCard.stage);
    let stored = false;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].id == 0) {
            cards[i].switchCard(scene.currentCard, currentCard.stage);
            scene.currentCard = 0;
            if (scene.activityInventoryOpen) {
                cards[i].setVisible(true);
            }
            console.log("ID: "+cards[i].id+"\nStage: "+cards[i].stage);
            stored = true;
            break;
        }
    }
    if (!stored) {
        console.log("Error: No card storage slots remaining because don't know how to do");
    }
    else {
        scene.currentCardText.setText("+");
        scene.currentCardImage.setVisible(false);
    }
}



/**
 * Runs when the finish event card button is clicked
 * Checks if the player correctly played the card
 */
function finishHandler(scene) {
	let variables = scene.gameData.teams[scene.gameData.currentTeam];
    scene.completeEffect = areRulesMatched(scene);
	
	console.log("Checking if player correctly used event card effects");
    // check if rules are matched or effects are bugged for several times (i.e., pressed finish 5 times)
	if (scene.completeEffect || scene.forceFinish == 4) {
		scene.eventBarPlay.setVisible(false);
		scene.eventBarStore.setVisible(false);
        scene.eventBarFlip.setVisible(false);
		buttonToggle(scene.toolbarDiscard, 0, false);
        buttonToggle(scene.currentCardBox, 1, false);
		buttonToggle(scene.eventBarActInventory, 2, false);
        buttonToggle(scene.eventBarActStore, 2, false);
        scene.blockedOut = true;
        scene.flipState = false;
        scene.flipped = true;
        scene.forceFinish = 0;
        scene.ignored = false;
        scene.completeEffect = false;
        
        // disabling all the card placement boxes
        for (let j = 0; j < scene.gameData.stage+1; j++) {
            for (let i = 0; i < variables.cards[j].length; i++) {
                variables.cards[j][i].placementBox.disableInteractive();
            }
        }

        // TO BE COMPLETED: deleting all the add card buttons from the current round
        for (let i = 0; i < variables.addCardBoxes.length; i++) {
            variables.addCardBoxes[i].setVisible(false, true);
        }
        
        if (scene.currentCard != 0) {
            scene.currentCard = 0;
            scene.currentCardText.setText("+");
            scene.currentCardImage.setVisible(false);
        }
		scene.currentEventCard = 0;
		endCard(scene);
	}
    else {
        scene.forceFinish += 1;
        console.log(scene.forceFinish);
    }
}



/**
 * Function to flip cards when pressed
 */
function flipHandler(scene){
    var variables = scene.gameData.teams[scene.gameData.currentTeam];
    let wholeEffect = useEffect(scene);
    let stage = new Array();
    for (var i = 0; i < wholeEffect.length; i++) {
        var temp = wholeEffect[i];
        var x = temp[4];
        stage.push(x-1);
    }
    
    if (!scene.flipState) {
        // activate all placement boxes
        console.log("Cards can now be flipped");
        scene.flipState = true;
        for (let i = 0; i <= scene.gameData.stage; i++) {
            for (let j = 0; j < variables.cards[i].length; j++) {
                variables.cards[i][j].setVisible(true, true);
            }
        }
        scene.eventBarFlip.buttonText.setText("Add/Remove\nCards");
    }
    else {
        // only deactivate card boxes from not specified stage(s)
        console.log("Cards can now be added/removed");
        scene.flipState = false;
        for (let i = 0; i <= scene.gameData.stage; i++) {
            if (!stage.includes(i)) {
                for (let j = 0; j < variables.cards[i].length; j++) {
                    variables.cards[i][j].setVisible(true, false);
                }
            }
        }
        scene.eventBarFlip.buttonText.setText("Flip Cards");
    }
    console.log("Current flipState: "+scene.flipState);
}



/**
 * Function which checks if more event cards can be drawn after the previous event card is played/stored
 */
function endCard(scene) {
    if (scene.eventCardsRemaining > 0) {
        scene.eventStack.setTexture("e"+scene.stage);
        scene.eventBarFinish.setVisible(false);
    } else {
        scene.eventStack.setVisible(false);
        scene.eventBarFinish.setVisible(false);
    }
    
    if (scene.eventCardsRemaining == 0) {
        buttonToggle(scene.toolbarNext, 0, true);
    }
}



/**
 * Called when inventory button is pressed to open/close the inventory
 */
function inventoryHandler(scene) {
    console.log("Inventory toggle")
    let variables = scene.gameData.teams[scene.gameData.currentTeam];
    let cards = variables.eventCards;
    if (scene.isInventoryOpen) {    // if inventory is open then close it
        closeInventory(scene);
    } else {
        scene.isInventoryOpen = true;
        for (let i = 0; i < cards.length; i++) {
            console.log(cards[i]);
            cards[i].setVisible(true);
            scene.eventBarInventory.buttonText.setText("Close\nInventory");
        }
    }
}



/**
 * Closes the event card inventory
 */
 function closeInventory(scene) {
	let cards = scene.gameData.teams[scene.gameData.currentTeam].eventCards;
    scene.isInventoryOpen = false;
	for (let i = 0; i < cards.length; i++) {
		cards[i].setVisible(false);
		scene.eventBarInventory.buttonText.setText("Event\nInventory");
	}
}



/**
 * Called when activity inventory button is pressed to open/close the inventory
 */
function actInventoryHandler(scene) {
    console.log("Activity inventory toggle");
    let variables = scene.gameData.teams[scene.gameData.currentTeam];
    let cards = variables.activityCards;
    if (scene.activityInventoryOpen) {    // if inventory is open then close it
        closeActInventory(scene);
    } else {
        scene.activityInventoryOpen = true;
        for (let i = 0; i < cards.length; i++) {
            cards[i].setVisible(true);
            scene.eventBarActInventory.buttonText.setText("Close \nInventory");
        }
    }
}



/**
 * Closes the activity card inventory
 */
 function closeActInventory(scene) {
	let cards = scene.gameData.teams[scene.gameData.currentTeam].activityCards;
    scene.activityInventoryOpen = false;
	for (let i = 0; i < cards.length; i++) {
		cards[i].setVisible(false);
		scene.eventBarActInventory.buttonText.setText("Activity \nInventory");
	}
}



export { EventCard, ActivityCard, EventBarButton, pickUpEventCard, playHandler, storeHandler, activityStoreHandler, finishHandler, inventoryHandler, closeInventory, actInventoryHandler, flipHandler, closeActInventory, effectDiscard, useEffect };