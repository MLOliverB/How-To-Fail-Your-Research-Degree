import { loadAllCardsPromise } from "./cards-management.js";
import teamGameBoard from "./scenes/teamGameBoard.js";
import teamToolbar from "./scenes/teamToolbar.js";
import { EventCard, ActivityCard, EventBarButton, pickUpEventCard, playHandler, storeHandler, activityStoreHandler, finishHandler, inventoryHandler, actInventoryHandler, flipHandler } from "./event_cards/eventBoard.js";

export default class GameData {
    constructor(game, data) {
        this.game = game;
        this.roundLength = data[0];              // The maximum length of each round in seconds (TODO: get this from menu)
        this.totalEventCards = data[1];
        this.totalWorkLateTiles = data[2];       // The number of work late tiles each team starts with (TODO: get number of work late tiles from menu)
        this.numberOfTeams = data[3]; 
        this.cardMap = new Map();
        this.cardMap.set(0, null);

        const preloadCards = async () => {
            let cardsPromise = await loadAllCardsPromise();
            for (let i = 0; i < cardsPromise.length; i++) {
                this.cardMap.set(cardsPromise[i].id, cardsPromise[i]);
            }
            this.cardsPreloadedCallback();
        };
        preloadCards();
    }

    cardsPreloadedCallback() {
        this.stage = 0;
        this.currentTeam = 0;
        this.teams = [];                   // 1D-array of scenes displaying the game boards of each team

        for (let i = 0; i < this.numberOfTeams; i++) {
            this.teams.push({
                workLateTiles: this.totalWorkLateTiles,
                cards: [],
                addCardBoxes: [],
                isPlayerHoldingWorkLate: false,
                eventCards: [],
                activityCards: [],
                ignoreEff: [],
                toIgnore: [],
                unusedCards: [],
            });
            let keyName = `board${i}`
            this.teams[i].scene = this.game.scene.add(keyName, new teamGameBoard({key: keyName}, this, i), false);
            //this.teams[i].scene = this.game.scene.getScene(keyName);
            this.teams[i].keyName = keyName;
        }

        this.teamToolbar = this.game.scene.add("teamToolbar", new teamToolbar(this), false);

        for (let i = 0; i < this.numberOfTeams; i++) {
            this.teams[i].eventCards = [new EventCard(this.teamToolbar, 0, 0), new EventCard(this.teamToolbar, 0, 1), new EventCard(this.teamToolbar, 0, 2)];
            this.teams[i].activityCards = [new ActivityCard(this.teamToolbar, 0, null, 0), new ActivityCard(this.teamToolbar, 0, null, 1), new ActivityCard(this.teamToolbar, 0, null, 2)];
        }

        

        this.game.scene.start("teamToolbar");
        for (let i = 0; i < this.numberOfTeams; i++) {
            this.game.scene.start(this.teams[i].keyName);
        }
        this.game.scene.bringToTop(this.teams[0].keyName);
        this.game.scene.bringToTop("teamToolbar");
        for (let i = 1; i < this.numberOfTeams; i++) {
            this.game.scene.sendToBack(this.teams[i].keyName);
        }

        for (let i = 1; i < this.numberOfTeams; i++) {
            this.teams[i].scene.sys.setVisible(false);
        }

        this.game.scene.remove("mainMenu");
        this.game.scene.remove("numberOfTeams");
        this.game.scene.remove("options");
    }
}