/* ActivityCard Object (new ActivityCard())
 * - id: Unique reference number
 * - stage: The stage of the game this card is played in. 1=Plan, 2=Context, 3=Implementation, 4=Write Up
 * - image: The name of the image file (something.png)
 * - title: The text displayed on the card
 * - description: A description of what the card means
 * - placement: 4 numbers separated by commas representing if a card can be placed in the direction. left,right,up,down (e.g. 1,0,0,1 means a card can be placed on the left and down directions)
 */
function ActivityCard(id, stage, image, title, description, placement) {
    this.id = id;
    this.stage = stage;
    this.image = image;
    this.title = title;
    this.description = description;
    this.placement = placement;
}

/* EventCard Object (new EventCard())
 * - id: Unique reference number
 * - stage: The stage of the game this card is played in. 1=Plan, 2=Context, 3=Implementation, 4=Write Up
 * - image: The name of the image file (something.png)
 * - title: The text displayed on the card
 * - description: A description of what the card means
 * - save_condition: The conditions to be allowed to ignore the effects of a card with a bad effect
 * - requirement: The requirements for the card to take effect. 14:2&!2 means that card 14 must appear twice, and card 2 cannot appear
 * - effect: The effect of the card. n0:3:2 means that three of the cards in stage 2 must be removed (n/p/s/o/i = remove a card, add a card, stand in for a card, block out spaces, ignore effects of another event card; a:b:c a=id of a specific card (0=not a specific card, -(...)=non-adjacent cards), b=number of cards to change, c=stage of card if not a specific card)
 * - else_condition: Condition to do the secondary effect instead
 */
function EventCard(id, stage, image, title, description, save_condition, requirement, effect, else_condition) {
    this.id = id;
    this.stage = stage;
    this.image = image;
    this.title = title;
    this.description = description;
    this.save_conditon = save_condition;
    this.requirement = requirement;
    this.effect = effect;
    this.else_condition = else_condition;
}



/*
 * loadCardStack retrieves all activity cards from a given stage and loads them into an array symbolizing a stack.
 * - stage: The game stage for which the cards will be retrieved - 1=Plan, 2=Context, 3=Implementation, 4=Write Up
 * - onLoad: Callback function that takes the card stack as an argument to support the asynchronous behaviour of xml http requests
 */
function loadActivityCardStack(stage, onLoad) {
    var cardStack = [];

    let config = {
        locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.wasm",
    };

    initSqlJs(config).then(function(SQL) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost:8000/data/Cards.db', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {
            var uInt8Array = new Uint8Array(this.response);
            const db = new SQL.Database(uInt8Array);

            // id INT PRIMARY KEY, stage INT, number INT, image TEXT, title TEXT, description TEXT, placement TEXT
            var res = db.exec("SELECT id, stage, number, image, title, description, placement FROM Activities WHERE stage=:stage", {":stage": stage, });

            if (res.length > 0) {
                let vals = res[0]["values"];
                for (let i = 0; i < vals.length; i++) {
                    let numberCopies = vals[i][2];
                    for (let j = 0; j < numberCopies; j++) {
                        // id, stage, (!number), image, title, description, placement
                        cardStack.push(new ActivityCard(vals[i][0], vals[i][1], vals[i][3], vals[i][4], vals[i][5], vals[i][6]));
                    }
                }
            }
            onLoad(cardStack);
        };
        xhr.send();
    });
}


/*
 * loadCardStack retrieves all event cards from a given stage and loads them into an array symbolizing a stack.
 * - stage: The game stage for which the cards will be retrieved - 1=Plan, 2=Context, 3=Implementation, 4=Write Up
 * - onLoad: Callback function that takes the card stack as an argument to support the asynchronous behaviour of xml http requests
 */
function loadEventCardStack(stage, onLoad) {
    var cardStack = [];

    let config = {
        locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.wasm",
    };

    initSqlJs(config).then(function(SQL) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost:8000/data/Cards.db', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {
            var uInt8Array = new Uint8Array(this.response);
            const db = new SQL.Database(uInt8Array);

            // id INT PRIMARY KEY, stage INT, image TEXT, title TEXT, description TEXT, save_condition TEXT, requirement TEXT, effect TEXT, else_condition TEXT
            var res = db.exec("SELECT id, stage, image, title, description, save_condition, requirement, effect, else_condition FROM Events WHERE stage=:stage", {":stage": stage, });

            if (res.length > 0) {
                let vals = res[0]["values"];
                for (let i = 0; i < vals.length; i++) {
                    // id, stage, image, title, description, save_condition, requirement, effect
                    cardStack.push(new EventCard(vals[i][0], vals[i][1], vals[i][2], vals[i][3], vals[i][4], vals[i][5], vals[i][6], vals[i][7], vals[i][8]));
                }
            }
            onLoad(cardStack);
        };
        xhr.send();
    });
}


// Reference: Function code based on 'Fisher-Yates shuffle' taken from https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html
/*
 * Shuffles the given cardstack (i.e. array) of either activity cards or event cards
 * - stack: The card stack, as an array, to be shuffled
 *
 * Returns a randomly shuffled version of the array that was passed to the object
 */
function shuffleCardStack(stack) {
    let pos = stack.length;

    while (pos > 0) {
        // Find a random index 0 <= randPos < pos
        let randPos = Math.floor(Math.random() * pos);
        pos -= 1;

        // Swap position of the two indexes
        let tmp = stack[pos];
        stack[pos] = stack[randPos];
        stack[randPos] = tmp;
    }

    return stack;
}
