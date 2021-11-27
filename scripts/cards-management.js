/* ActivityCard Object (new ActivityCard())
 * - id: Unique reference number
 * - stage: The stage of the game this card is played in. 1=Plan, 2=Context, 3=Implementation, 4=Write Up
 * - image: The name of the image file (something.png)
 * - title: The text displayed on the card
 * - description: A description of what the card means
 * - placement: 4 numbers separated by commas representing if a card can be placed in the direction. left,right,up,down (e.g. 1,0,0,1 means a card can be placed on the left and down directions)
 */
function ActivitCard(id, stage, image, title, description, placement) {
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
 * - effect: The effect of the card. n-1:3:2 means that three of the cards in stage 2 must be removed (n/p/s/o/i = remove a card, add a card, stand in for a card, block out spaces, ignore effects of another event card; a:b:c a=id of a specific card (0=not a specific card), b=number of cards to change, c=stage of card if not a specific card)
 */
function EventCard(id, stage, image, title, description, save_condition, requirement, effect) {
    this.id = id;
    this.stage = stage;
    this.image = image;
    this.title = title;
    this.description = description;
    this.save_conditon = save_condition;
    this.requirement = requirement;
    this.effect = effect;
}



/*
 * loadCardStack retrieves all activity cards from a given stage and loads them into an array symbolizing a stack.
 * - stage: The game stage for which the cards will be retrieved - 1=Plan, 2=Context, 3=Implementation, 4=Write Up
 * - dbPath: The path to the database file from which the stack will be loaded
 * 
 * Returns an array of card objects representing a card stack.
 */
function loadActivityCardStack(stage, dbPath) {
    let config = {
        locateFile: () => "/scripts/sql-js/sql-wasm.wasm",
    };

    initSqlJs(config).then(function(SQL) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/data/Cards.db', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {
            // Open the database
            const db = new SQL.Database(uInt8Array);

            // Prepare the statement
            const stmt = db.prepare("SELECT * FROM Activities WHERE stage='$stage'");

            stmt.bind({$stage: stage});
            while (stmt.step()) {
                const row = stmt.getAsObject();
                console.log('Here is a row: ' + JSON.stringify(row));
            }
        };
    });
}


/*
 * loadCardStack retrieves all event cards from a given stage and loads them into an array symbolizing a stack.
 * - stage: The game stage for which the cards will be retrieved - 1=Plan, 2=Context, 3=Implementation, 4=Write Up
 * - dbPath: The path to the database file from which the stack will be loaded
 * 
 * Returns a list of card objects representing a card stack.
 */
function loadEventCardStack(stage, dbPath) {
    console.log("0");

    let config = {
        locateFile: () => "./scripts/sql-js/sql-wasm.wasm",
    };

    initSqlJs(config).then(function(SQL) {

        console.log("1");

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/data/Cards.db', true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {
            console.log("2");
            // Open the database
            const db = new SQL.Database(uInt8Array);

            console.log("3");

            // Prepare the statement
            const stmt = db.prepare("SELECT * FROM Events WHERE stage='$stage'");

            stmt.bind({$stage: stage});
            while (stmt.step()) {
                const row = stmt.getAsObject();
                console.log('Here is a row: ' + JSON.stringify(row));
            }
        };
        //xhr.send();

        // Open the database file with a file buffer
        //let filebuffer = fs.readFileSync("/data/Cards.db");

        // Open the database
        //const db = new SQL.Database(filebuffer);

        // Prepare the statement
        //const stmt = db.prepare("SELECT * FROM Events WHERE stage='$stage'");

        //stmt.bind({$stage: stage});
        //while (stmt.step()) {
        //    const row = stmt.getAsObject();
        //    console.log('Here is a row: ' + JSON.stringify(row));
        //}
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