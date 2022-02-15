import { loadEventCard } from "../cards-management.js";
import { buttonToggle } from "../activity_cards/GameBoard.js";


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
                    pickUpEventCard(this.scene);
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
        

        this.currentEventText = this.scene.add.text(this.scene.x*2, this.scene.y*1.76, '.', {color: "0x000000"}).setOrigin(0.5, 1.2).setFontSize(1);
        this.currentEventImage = this.scene.add.image(this.scene.x*2, this.scene.y*1.3, 70).setScale(0.25).setVisible(false);
        
        // effectCards: array of cards that needs to be changed due to effect
        let effectCards = [];
        // elseCards: array of cards that needs to be changed due to else_condition
        let elseCards = [];
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

function countIds(scene) {
    let variables = scene.teams[scene.currentTeam];
    // creating array for holding activity cards placed 
    let arrayOfCards = variables.get("cards");
    // first row
    if (arrayOfCards[0] == null) { var firstCards = [0];} 
    else { var firstCards = arrayOfCards[0]; }
    // second row
    if (arrayOfCards[1] == null) {var secondCards = [0];}
    else {var secondCards = arrayOfCards[1];}
    // third row
    if (arrayOfCards[2] == null) {var thirdCards = [0];}
    else {var thirdCards = arrayOfCards[2];}
    // fourth row
    if (arrayOfCards[3] == null) {var fourthCards = [0];}
    else{var fourthCards = arrayOfCards[3];}

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

function pickUpEventCard(scene) {
    let variables = scene.teams[scene.currentTeam];
    let cardArray = countIds(scene);
    
    console.log("Pick up an event card");
    if (variables.get("currentEventCard") == 0 && scene.isEventRound) {     // this check should be redundant but just in case...
        variables.set("currentEventCard", scene.eventCards[scene.stage].pop().id);
        scene.eventStack.setTexture(variables.get("currentEventCard")).setVisible(true);
		scene.eventBarPlay.setVisible(true);
        if(booleanSave){
            scene.eventBarStore.setVisible(true);
        }
        scene.eventBarStore.setVisible(false);
        console.log(variables.get("currentEventCard"));
    }
    buttonToggle(scene.toolbarNext.button, 0, true);
}

// function to get matching cardIDs from activity cards array and required cards
// taken from: https://www.tutsmake.com/javascript-compare-two-arrays-for-matches/
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

// function for filtering same card IDs
function matchCount(valToBeChecked, valChecked) {
    return valToBeChecked == valChecked;
}

function countCardOccurrences(scene){
    // get count of all occurrences of each activity card ID
    // taken from: https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
    var arrayAll = countIds(scene);
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

function useEffect(scene) {
    console.log("use event card");
    //pickUpEventCard(scene);
    let variables = scene.teams[scene.currentTeam];
    
    // current event card in hand
    let holdEventID = scene.cardMap.get(variables.get("currentEventCard"));
    // all cards in array
    var arrayAll = countIds(scene);
    // array of all cards with its number of occurrences
    let cardArray = countCardOccurrences(scene);
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
    // sAct = action taken (original form: one letter)
    // adjacency = whether cards have to be adjacent
    // forAction = action taken on cardID(s)
    // totalAmount = total amount of card(s)
    // cardStage = stage(s) of card to take action
    var action = new Array();
    var sAct = new Array();
    var adjacency = new Array();
    var forAction = new Array();
    var totalAmount = new Array();
    var cardStage = new Array();
    
    // else condition to do second effect
    // actionElse = action taken in Else
    // forActionElse = action taken on cardID(s) in Else
    // totalAmountElse = total amount of card(s) in Else
    // cardStageElse = specific card stage(s) in Else
    var actionElse = new Array();
    var forActionElse = new Array();
    var totalAmountElse = new Array();
    var cardStageElse = new Array();
    
    /* 
     * get requirement(s) of chosen card and check if requirement is met
     */
    function booleanRequirement() {
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
            for (var i = 0; i < matchAbs.length; i++){
                var temp = matchAbs[i][0];
                console.log(temp);
                var index = idArray.indexOf(temp);
                console.log(index);
                if (countArray[index] > absCondition) {
                    console.log("requirement not fulfilled, cannot use card");
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
                    console.log("requirement not fulfilled, cannot use card");
                    booleanArr.push(false);
                }
                else {
                    console.log("requirement fulfilled, move to next requirement");
                    booleanArr.push(true);
                }
            }
        }
        console.log(booleanArr);
        if (!booleanArr.includes(false)) {
            return true;
        }
        else {
            return false;
        }
    }
    console.log(booleanRequirement());
    
    

    /* 
     * get effect(s) of chosen card
     */
    var chosenEffect = holdEventID.effect.toString();
    /* 
    splitting the effect into a:b:c (0:1:2)
    splitEffect[order of effect][a, b, or c][first index]
        e.g. splitEffect[0][0][0]: first index of first effect's "a"
    */
    var doubleEffect = chosenEffect.split(/&(?!\d)/);
    var splitEffect = new Array();
    for (var i = 0; i < doubleEffect.length; i++) {
        var x = doubleEffect[i].split(/:/);
        splitEffect[i] = x;
    }

    // effect of card chosen
    for (var i = 0; i < splitEffect.length; i++) {
        
        // temp values
        var card;
        var stage;
        /* 
        check for action taken on card based on first letter:
        n = remove a card
        p = add a card
        s = stand in for a card
        o = block out spaces
        i = ignore effects of another event card
        l = placeholder (for default)
        */
        switch(splitEffect[i][0][0]) {
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
                action.push('Block out');
                sAct.push("o");
                break;
            case "i":
                action.push('Ignore effects of');
                sAct.push("i");
                break;
            default:
                console.log('none');
                sAct.push("l");
        }
        /* 
        check the a:b:c :
        a = specific ID of card (0 = not a specific card, -(...) = non-adjacent cards)
        b = total number of cards to change
        c = stage of card if not a specific card (optional)
        */

        // check if cards to take action upon should be adjacent
        if(splitEffect[i][0].includes('-')){
            adjacency.push('non-adjacent');
        }
        else{
            adjacency.push('adjacent');
        }
        card = splitEffect[i][0].match(/\d+/g);

        // check if there is/are specific cardID(s) to take action
        if(card=='0'){
            forAction.push('Not stated');
        }
        else{
            forAction.push(card);
        }

        // check for total number of cards to take action
        totalAmount.push(splitEffect[i][1]);

        // check if stage of card is stated
        if(splitEffect[i][2]){
            stage = splitEffect[i][2].match(/\d+/g);
            cardStage.push(stage);
        }
        else {
            cardStage.push('Not stated');
        }
        console.log(`Title of event card: ${chosenTitle} \n
                Effect ${i+1} -\n
                Action to take: ${action}\n
                Adjacency of card(s): ${adjacency}\n
                CardID(s): ${forAction}\n
                Total number of card(s)/space(s): ${totalAmount}\n
                Stage: ${cardStage}`);
    }
    



    /* 
     * get else condition of chosen card
     */
    var chosenElse = holdEventID.else_condition.toString();
    var splitElse = chosenElse.split(/:/);

    // check if value is Null
    if(splitElse.includes('Null')){
        console.log('There are no else effects');
    }
    else{
        /* 
        check for action taken on card based on first letter:
        n = remove a card
        p = add a card
        s = stand in for a card
        o = block out spaces
        i = ignore effects of another event card
        f = flip a card
        */
        switch(splitElse[0][0]) {
            case "n":
                actionElse.push('Remove card');
                break;
            case "p":
                actionElse.push('Add card');
                break;
            case "s":
                actionElse.push('Stand in for');
                break;
            case "o":
                actionElse.push('Block out');
                break;
            case "i":
                actionElse.push('Ignore effects of');
                break;
            case "f":
                actionElse.push('Flip card');
                break;
            default:
                alert('test');
        }
         /* 
        check the a:b:c :
        a = specific ID of card (0 = not a specific card, -(...) = non-adjacent cards)
        b = number of cards to change
        c = stage of card if not a specific card (optional)
        */
        card = splitElse[0].match(/\d+/g);
        // check if there is/are specific cardID(s) to take action
        if(card=='0'){
            forActionElse.push('no specific cardID');
        }
        else{
            forActionElse.push(card);
        }

        // check for total number of cards to take action
        totalAmountElse.push(splitElse[1]);

        // check if stage of card is stated
        if(splitElse[2]){
            stage = splitElse[2].match(/\d+/g);
            cardStageElse.push(stage);
        }
        else {
            cardStageElse.push('not stated');
        }
        console.log(`Title of event card: ${chosenTitle} \n
                Else effect - \n
                Action to take: ${actionElse}\n
                CardID(s): ${forActionElse}\n
                Number of card(s)/space(s): ${totalAmountElse}\n
                Stages: ${cardStageElse}`);
    }
    
}

/*
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
    return false;
}

/**
 * Runs when the play event card button is clicked
 * Lets the player use the effects of the cards
 */
function playHandler(scene) {
	console.log("Play the event card");
    useEffect(scene);
    //if (scene.drawnEventCards == 3) {
        scene.eventBarPlay.setVisible(false);
        scene.eventBarStore.setVisible(false);
        scene.eventBarFinish.setVisible(true);
    //}
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
		
		scene.eventStack.setTexture(`e${scene.stage}`);
		if (scene.eventCardsRemaining > 0 /*scene.drawnEventCards <= 3*/) {
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
