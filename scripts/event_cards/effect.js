//import { loadEventCard } from "cards-management.js";

// get ID of chosen card (currently obtained through input for testing)

// load the effect of the drawn card (currently loads the file)
// includes loading the requirement, effect, and else condition of card
function loadEffect(idInput) {
    let request = new XMLHttpRequest();
    request.open('GET', "/data/Events.csv");
    request.responseType = 'text';

    request.onload = function() {
        allEventCards = request.response;
        // split the event cards into elements of allEventVars
        allEventVars = allEventCards.split(/\r\n|\n/);
        
        console.log(idInput);
        // get chosen card through cardID
        var cardID = document.getElementById(idInput).value;
        
        // split the variables of chosen card into elements
        eventVars = allEventVars[cardID].split(/,/);
        
        // title of chosen event card
        var chosenTitle = eventVars[3];
        
        
        // get requirement(s) of chosen card
        var chosenRequirement = eventVars[6];
        // if double requirements, split string into separate  
        //requirements before splitting the requirement into a:b
        /* 
        splitRequirement[order of requirement][a or b][first index]
            e.g. splitRequirement[0][0][0]: first index of first requirement's "a"
        */
        var doubleRequirement = chosenRequirement.split(/&(?=!)/);
        var splitRequirement = new Array();
        for (var i = 0; i < doubleRequirement.length; i++) {
            x = doubleRequirement[i].split(/:/);
            splitRequirement[i] = x.toString();
        }
        
    // requirement of card chosen in order to take effect
        // check if value is Null
        if(splitRequirement[0].includes('Null')) {
            alert(`There are no requirements.`);
        }
        else {
            for (var i = 0; i < splitRequirement.length; i++) {
                // toBeAbsent = cardID(s) that shouldn't appear
                // absCondition = number of cardID(s) that shouldn't appear (optional)
                // toBePresent = cardID(s) that should appear
                // preCondition = number of cardID(s) that should appear (optional)
                var toBeAbsent = new Array();
                var absCondition = new Array();
                var toBePresent = new Array();
                var preCondition = new Array();
                appearance = splitRequirement[i].includes('!');
                condition = splitRequirement[i].includes('>');
                var card;

                // check for "!" symbol at start to see if card must appear or not
                if(appearance) {
                    // check if there is any condition(b) for the number of cards to appear/not appear
                    if(condition) {
                        times = splitRequirement[i].slice(-1);
                        absCondition.push(times);
                        temp = splitRequirement[i].slice(0,-2);
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
                        times = splitRequirement[i].slice(-1);
                        preCondition.push(times);
                        temp = splitRequirement[i].slice(0,-2);
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
                if((!toBePresent.length) && (toBeAbsent.length)){
                    alert(`Title of event card: ${chosenTitle} \n
                            Requirement ${i+1} -\n
                            Card(s) that should be absent: ${toBeAbsent}\n
                            Specific number of card(s) not to exceed: ${absCondition}`)
                }
                if((!toBeAbsent.length) && (toBePresent.length)){
                    alert(`Title of event card: ${chosenTitle} \n
                            Requirement ${i+1} -\n
                            Card(s) that should be present: ${toBePresent}\n
                            Specific number of card(s) necessary: ${preCondition}`)
                }
            }
        }

        
        
        // get effect(s) of chosen card
        var chosenEffect = eventVars[7];
        /* 
        splitting the effect into a:b:c (0:1:2)
        splitEffect[order of effect][a, b, or c][first index]
            e.g. splitEffect[0][0][0]: first index of first effect's "a"
        */
        var doubleEffect = chosenEffect.split(/&(?!\d)/);
        var splitEffect = new Array();
        for (var i = 0; i < doubleEffect.length; i++) {
            x = doubleEffect[i].split(/:/);
            splitEffect[i] = x;
        }
        
    // effect of card chosen
        for (var i = 0; i < splitEffect.length; i++) {
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
            */
            switch(splitEffect[i][0][0]) {
                case "n":
                    action.push('Remove card');
                    break;
                case "p":
                    action.push('Add card');
                    break;
                case "s":
                    action.push('Stand in for');
                    break;
                case "o":
                    action.push('Block out');
                    break;
                case "i":
                    action.push('Ignore effects of');
                    break;
                default:
                    alert('none');
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
            
            alert(`Title of event card: ${chosenTitle} \n
                    Effect ${i+1} -\n
                    Action to take: ${action}\n
                    Adjacency of card(s): ${adjacency}\n
                    CardID(s): ${forAction}\n
                    Total number of card(s)/space(s): ${totalAmount}\n
                    Stage: ${cardStage}`);
        }

        
        
        // get else condition of chosen card
        var chosenElse = eventVars[8];
        splitElse = chosenElse.split(/:/);
        
    // else condition to do second effect
        // actionElse = action taken in Else
        // forActionElse = action taken on cardID(s) in Else
        // totalAmountElse = total amount of card(s) in Else
        // cardStageElse = specific card stage(s) in Else
        var actionElse = new Array();
        var forActionElse = new Array();
        var totalAmountElse = new Array();
        var cardStageElse = new Array();
        // check if value is Null
        if(splitElse.includes('Null')){
            alert('There are no else effects');
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
            alert(`Title of event card: ${chosenTitle} \n
                    Else effect - \n
                    Action to take: ${actionElse}\n
                    CardID(s): ${forActionElse}\n
                    Number of card(s)/space(s): ${totalAmountElse}\n
                    Stages: ${cardStageElse}`);
        }
    };

    request.send();
}

// TODO: add in actions made by effects
export { loadEffect }