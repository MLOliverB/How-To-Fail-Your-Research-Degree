import { loadEventCard } from "../cards-management.js";
import { buttonToggle, AddCardBox, CardBox, CardDiscardBox } from "../activity_cards/gameBoard.js";



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
            this.card = this.scene.add.image(this.scene.x*0.17+(5+666*0.235)*this.cardPosition, this.scene.y*2.15, "e1").setScale(0.235).setDepth(10).setInteractive().setVisible(false);
        } else {
            this.card = this.scene.add.image(this.scene.x*0.17+(5+666*0.235)*this.cardPosition, this.scene.y*2.15, this.id).setScale(0.235).setDepth(10).setInteractive().setVisible(false);
        }
        this.card.on("pointerup", () => {
            if (this.isSelected) {
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
        this.playButton = this.scene.add.rectangle(this.scene.x*0.17+(5+666*0.235)*this.cardPosition, this.scene.y*1.55-(this.card.height/2*0.235)+(100*0.235), this.card.width, 200, 0xb1cfe0).setScale(0.235).setDepth(10).setAlpha(0.8).setInteractive().setVisible(false);
        this.playButton.on("pointerover", () => {
			this.playButton.setFillStyle(0x6c95b7);
		});
		this.playButton.on("pointerout", () => {
			this.playButton.setFillStyle(0xb1cfe0);
		});
        this.playButton.on("pointerup", () => {
			this.playCard();
		});
        this.playButtonText = this.scene.add.text(this.scene.x*0.17+(5+666*0.235)*this.cardPosition, this.scene.y*1.55-(this.card.height/2*0.235)+(100*0.235), "Play", {color: "0x000000"}).setOrigin(0.5).setDepth(10).setVisible(false);

        //this.currentEventText = this.scene.add.text(this.scene.x*2, this.scene.y*1.76, '.', {color: "0x000000"}).setOrigin(0.5, 1.2).setFontSize(1);
        //this.currentEventImage = this.scene.add.image(this.scene.x*2, this.scene.y*1.3, 70).setScale(0.25).setVisible(false);
        
        // effectCards: array of cards that needs to be changed due to effect
        let effectCards = [];
        // elseCards: array of cards that needs to be changed due to else_condition
        let elseCards = [];
    }

    
    playCard() {
        let variables = this.scene.teams[this.scene.currentTeam];
        console.log("Play a card")
        // stored card can only be played if the player is not currently in the middle of playing another card
        if (variables.get("currentEventCard") == 0) {
            variables.set("currentEventCard", this.id);
            this.scene.eventStack.setTexture(variables.get("currentEventCard"));
		    this.scene.eventBarPlay.setVisible(true);
            if (booleanSave) {
                this.scene.eventBarStore.setVisible(true);
            } else {
                this.scene.eventBarStore.setVisible(false);
            }

            this.id = 0;
            this.setVisible(false);
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


    switchCard(id) {
        this.id = id;
        this.card.setTexture(id);
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
		
		this.button = this.scene.add.rectangle(this.scene.x*x, this.scene.y*y*1.63, this.scene.width, this.scene.height, 0xb1cfe0).setScale(width, 0.07).setInteractive();
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
		this.buttonText = this.scene.add.text(this.scene.x*x, this.scene.y*y*1.63, label, {color: "0x000000"}).setOrigin(0.5).setFontSize(15);
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

    var arrayFirst = new Array(); var arraySecond = new Array();
    var arrayThird = new Array(); var arrayFourth = new Array();
    for (let i = 0; i < firstCards.length; i++) {
        var x = firstCards[i].cardId;
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
    var arrayAll = "";
    arrayAll = arrayFirst.concat(arraySecond, arrayThird, arrayFourth);
    console.log(arrayAll);
    return arrayAll;
}



/**
 * Picks up an event card from the top of the stack
 * Card id is returned in "currentEventCard" in the current team's variables
 */
function pickUpEventCard(scene) {
    let variables = scene.teams[scene.currentTeam];
    scene.previousCardArray = countIds(variables.get("cards"));
    console.log(scene.previousCardArray);
    scene.completeEffect = false;
    scene.blockedOut = false;
    
    console.log("Pick up an event card");
    if (variables.get("currentEventCard") == 0 && scene.isEventRound) {     // this check should be redundant but just in case...
        variables.set("currentEventCard", scene.eventCards[scene.stage].pop().id);
        scene.eventStack.setTexture(variables.get("currentEventCard"));
		scene.eventBarPlay.setVisible(true);
        if (booleanSave) {
            scene.eventBarStore.setVisible(true);
        } else {
            scene.eventBarStore.setVisible(false);
        }
        console.log(variables.get("currentEventCard"));
    }
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
    const ids = Object.keys(occurrences);
    const count = Object.values(occurrences);
    console.log(ids);
    console.log(count);
    
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
    let variables = scene.teams[scene.currentTeam];
    
    // current event card in hand
    let holdEventID = scene.cardMap.get(variables.get("currentEventCard"));
    // all cards in array
    var arrayAll = countIds(scene.previousCardArray);
    // array of all cards with its number of occurrences
    let cardArray = countCardOccurrences(arrayAll);
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
        var matchAbs = arrayMatch(toBeAbsent, arrayAll);
        var matchPre = arrayMatch(toBePresent, arrayAll);
        console.log(matchAbs, matchPre);
        if(matchAbs.length) {
            for (var i = 0; i < matchAbs.length; i++) {
                var temp = matchAbs[i][0];
                console.log(temp);
                var index = idArray.indexOf(temp);
                console.log(index);
                if (countArray[index] > absCondition) {
                    console.log("requirement not fulfilled, cannot use effect");
                    booleanArr.push(false);
                }
                else {
                    console.log("requirement fulfilled, move to next requirement");
                    booleanArr.push(true);
                }
            }
        }
        if(matchPre.length) {
            for (var i = 0; i < matchPre.length; i++){
                var temp = matchPre[i][0];
                console.log(temp);
                var index = idArray.indexOf(temp);
                console.log(index);
                if (countArray[index] < preCondition) {
                    console.log("requirement not fulfilled, cannot use effect");
                    booleanArr.push(false);
                }
                else {
                    console.log("requirement fulfilled, move to next requirement");
                    booleanArr.push(true);
                }
            }
        }
        if (!booleanArr.includes(false)) {
            return true;
        }
        else {
            return false;
        }
    }
    

    if (booleanRequirement(scene)) {    // if requirements are fulfilled, can use effect
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

    } else {  // if requirements not fulfilled, go to else condition and use (if exists)
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
            cardStage.push('Not stated');
        }

        console.log(`Title of event card: ${chosenTitle} \n
                        Effect - \n
                        Action to take: ${action}\n
                        CardID(s): ${forAction}\n
                        Number of card(s)/space(s): ${totalAmount}\n
                        Stages: ${cardStage}`);
        
        singleEffect.push(sAct[i], adjacency[i], forAction[i], totalAmount[i], cardStage[i]);
        console.log(singleEffect);
        wholeEffect.push(singleEffect);
        console.log(wholeEffect);
    }
    console.log(scene.previousCardArray);
    return wholeEffect;
}



/**
 * ?
 * @param {*} scene 
 * @returns 
 */
function checkEffect(scene){
    /*
     * wholeEffect[0]: action (e.g. n = remove, p = add, ...)
     * wholeEffect[1]: adjacency
     * wholeEffect[2]: forAction, i.e. cardID(s) that needs to take action
     * wholeEffect[3]: totalAmount of cards/spaces to change
     * wholeEffect[4]: cardStage
     */
    let wholeEffect = useEffect(scene);
    
    // previous: previous/original card array before making changes
    // previousCount: occurrences of each activity card before making changes
    let previous = scene.previousCardArray;
    let previousCount = countCardOccurrences(previous);
    let previousCountId = Object.keys(previousCount);
    let previousCountOcc = Object.values(previousCount);
    
    // ideal: end result of total occurrences after making changes
    let ideal = new Array();
    
    for (var i = 0; i < wholeEffect.length; i++) {
        var effect = wholeEffect[i];
        
        // totalCount: original occurrences of selected card(s)
        let totalCount = 0;
        
        for (var x = 0; x < effect[2].length; x++) {
            var temp = effect[2][i];
            var index = previousCountId.indexOf(temp);
            if(index == "-1") {     // card doesn't exist
                totalCount += 0;
            }
            else if (temp == "0") {     // card is not specified
                totalCount += parseInt(previousCountOcc[0]);
            } 
            else {      // card is specified
                totalCount += previousCountOcc[index];
            }
        }
        console.log(totalCount);
        
        // check action to change number of totalCount
        switch (effect[0]){
            // remove card
            case "n":
                if (effect[2][0] == "0") {
                    totalCount += parseInt(effect[3]);
                }
                else if(totalCount == 0) {
                    scene.ignored = true;
                }
                else if (totalCount < effect[3]) {
                    totalCount = 0;
                }
                else {
                    totalCount -= parseInt(effect[3]);
                }
                break;
            // add card
            case "p":
                if (effect[2][0] == "0") {
                    if (previousCountOcc[0] == 0) {
                        scene.ignored = true;
                    }
                    else {
                        totalCount -= parseInt(effect[3]);
                    }
                }
                else if (previousCountOcc[0] >= effect[3]) {
                    totalCount -= parseInt(effect[3]);
                }
                else if (previousCountOcc[0] < effect[3]) {
                    totalCount = 0;
                }
                else {
                    totalCount += parseInt(effect[3]);
                }
                break;
            // stand in for card
            case "s":
                console.log("stand in for "+effect[2]);
                break;
            // block out spaces
            case "o":
            case "b":
                if (previousCountOcc[0] < effect[3]) {
                    totalCount = 0;
                }
                else if (previousCountOcc[0] == 0) {
                    scene.ignored = true;
                }
                else {
                    console.log("block out "+effect[3]+" spaces");
                    totalCount = effect[3];
                }
                break;
            // ignore effects of card
            case "i":
                console.log("ignore "+effect[2]);
                scene.ignore = true;
                break;
            // flip card
            case "f":
                if (totalCount == 0){
                    scene.ignored = true;
                }
                else{
                    console.log("flip "+effect[2]);
                }
                break;
            default:
                console.log("no action");
        }
        console.log(totalCount);
        
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
    let variables = scene.teams[scene.currentTeam];
    let ideal = checkEffect(scene);
    let current = new Array();
    let currentArray = countCardOccurrences(countIds(variables.get("cards")));
    let currentArrayId = Object.keys(currentArray);
    let currentArrayOcc = Object.values(currentArray);
    let wholeEffect = useEffect(scene);
    console.log(ideal);
    
    if (scene.ignored) {
        return true;
    }
    else {
        // get current card array
        for (var i = 0; i < wholeEffect.length; i++) {
            var effect = wholeEffect[i];
            // totalCount: current occurrences of selected card(s)
            let totalCount = 0;
            // get total occurrences for all selected card(s)
            for (var x = 0; x < effect[2].length; x++) {
                var temp = effect[2][i];
                var index = currentArrayId.indexOf(temp);
                // card doesn't exist
                if(index == "-1") {
                    totalCount += 0;
                }
                // card is not specified
                else if (temp == "0") {
                    totalCount += currentArrayOcc[0];
                } 
                // card is specified
                else {
                    totalCount += currentArrayOcc[index];
                }
                console.log(totalCount);
            }
            console.log(totalCount);
            // push totalCount and related cardIDs into current as 2D array
            var tempArray = new Array();
            tempArray.push(totalCount, effect[2]);
            current.push(tempArray);
        }
        console.log(current);
        
        if (scene.numberBlocked > 0) {
            var booleanArr = new Array();
            for (var i = 0; i < ideal.length; i++) {
                if (scene.numberBlocked == ideal[i][0]) {
                    booleanArr.push(true);
                }
                else {
                    booleanArr.push(false);
                }
            }
            if (!booleanArr.includes(false)) {
                return true;
            }
            else {
                return false;
            }
        }
        // compare ideal and current
        else if (ideal.equals(current)) {
            console.log("correct changes");
            return true;
        }
        else {
            console.log("rules are not matched");
            console.log("ideal: "+ideal + "\ncurrent: "+current);
            return false;
        }
    }
}



/**
 * Check the save_condition of chosen card
 */
function booleanSave(scene) {
    let variables = scene.teams[scene.currentTeam];
    // current event card in hand
    let holdEventID = scene.cardMap.get(variables.get("currentEventCard"));
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
    var variables = scene.teams[scene.currentTeam];
    scene.previousCardArray = countIds(variables.get("cards"));
    let wholeEffect = useEffect(scene);
    let stage = new Array();
    for (var i = 0; i < wholeEffect.length; i++) {
        var temp = wholeEffect[i];
        var x = temp[4];
        stage.push(x);
    }
    if (variables.get("currentCard") != this.scene.activityCards[this.stage][i].id) {
        return false;
    }
    else {
        return true;
    }
}



/**
 * Runs when the play event card button is clicked
 * Lets the player use the effects of the cards
 */
function playHandler(scene) {
	console.log("Play the event card");
    var variables = scene.teams[scene.currentTeam];
    scene.previousCardArray = countIds(variables.get("cards"));
    let wholeEffect = useEffect(scene);
    let stage = new Array();
    for (var i = 0; i < wholeEffect.length; i++) {
        var temp = wholeEffect[i];
        var x = temp[4];
        stage.push(x);
    }

    // allow activity cards to be played (overrides illegal moves)
    buttonToggle(scene.toolbarDiscard.button, 0, true);
    buttonToggle(scene.currentCardBox, 1, true);
    
    // stages will become interactive and all card components visible depending on stage specified
    for (let i = 0; i <= scene.stage; i++) {
        for (let j = 0; j < variables.get("cards")[i].length; j++) {
            variables.get("cards")[i][j].setVisible(true, true);
        }
    }
    
    for (let i = 0; i < variables.get("addCardBoxes").length; i++) {
        variables.get("addCardBoxes")[i].setVisible(true, true);
    }
    
    // TO BE COMPLETED: only start with add card boxes on the outer edges
    var box = new AddCardBox(scene, variables.get("leftEdge") - 1)
    box.setVisible(false, true);
    variables.get("addCardBoxes").push(box);
    box = new AddCardBox(scene, variables.get("rightEdge") + 1)
    box.setVisible(false, true);
    variables.get("addCardBoxes").push(box);
    
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
    let variables = scene.teams[scene.currentTeam];
    let cards = variables.get("eventCards");
    let stored = false;
    for (let i = 0; i < cards.length; i++) {
        cards[i].setVisible(true);
        if (cards[i].id == 0) {
            cards[i].switchCard(variables.get("currentEventCard"));
            variables.set("currentEventCard", 0);
            if (scene.isInventoryOpen) {
                cards[i].setVisible(true);
            }
            console.log("ID: "+cards[i].id);
            scene.eventStack.setTexture("e"+scene.stage);
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
 * Runs when the finish event card button is clicked
 * Checks if the player correctly played the card
 */
function finishHandler(scene) {
	let variables = scene.teams[scene.currentTeam];
	
	console.log("Checking if player correctly used event card effects");
    // check if rules are matched
	if (areRulesMatched(scene)) {
        scene.completeEffect = true;
		scene.eventBarPlay.setVisible(false);
		scene.eventBarStore.setVisible(false);
		buttonToggle(scene.toolbarDiscard.button, 0, false);
        buttonToggle(scene.currentCardBox, 1, false);
        scene.blockedOut = true;
        
        // disabling all the card placement boxes
        for (let j = 0; j < scene.stage+1; j++) {
            for (let i = 0; i < variables.get("cards")[j].length; i++) {
                variables.get("cards")[j][i].placementBox.disableInteractive();
            }
        }

        // TO BE COMPLETED: deleting all the add card buttons from the current round
        for (let i = 0; i < variables.get("addCardBoxes").length; i++) {
            variables.get("addCardBoxes")[i].setVisible(false, true);
        }
        variables.set("addCardBoxes", [])
        
		variables.set("currentEventCard", 0);
		endCard(scene);
	}
    else {
        scene.completeEffect = false;
    }
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
        buttonToggle(scene.toolbarNext.button, 0, true);
    }
}



/**
 * Called when inventory button is pressed to open/close the inventory
 */
function inventoryHandler(scene) {
    console.log("Inventory toggle")
    let variables = scene.teams[scene.currentTeam];
    let cards = variables.get("eventCards");
    if (scene.isInventoryOpen) {    // if inventory is open then close it
        closeInventory(scene);
    } else {
        scene.isInventoryOpen = true;
        for (let i = 0; i < cards.length; i++) {
            cards[i].setVisible(true);
            scene.eventBarInventory.buttonText.setText("Close Inventory");
        }
    }
}



/**
 * Closes the event card inventory
 */
 function closeInventory(scene) {
	let cards = scene.teams[scene.currentTeam].get("eventCards");
    scene.isInventoryOpen = false;
	for (let i = 0; i < cards.length; i++) {
		cards[i].setVisible(false);
		scene.eventBarInventory.buttonText.setText("Open Inventory");
	}
}



export { EventCard, EventBarButton, pickUpEventCard, playHandler, storeHandler, finishHandler, inventoryHandler, closeInventory, effectDiscard, useEffect };