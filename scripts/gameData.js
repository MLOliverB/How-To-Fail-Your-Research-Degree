import { loadAllCardsPromise } from "./cards-management.js";
import teamGameBoard from "./scenes/teamGameBoard.js";
import teamToolbar from "./scenes/teamToolbar.js";

export default class GameData {
    constructor(game) {
        this.game = game;
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
        this.numberOfTeams = 2;             // TODO: get this to recieve numberOfTeams from start menu!
        this.currentTeam = 0;

        this.roundLength = 30;              // The maximum length of each round in seconds (TODO: get this from menu)
        this.totalWorkLateTiles = 4         // The number of work late tiles each team starts with (TODO: get number of work late tiles from menu)

        this.teams = [];                   // 1D-array of scenes displaying the game boards of each team

        for (let i = 0; i < this.numberOfTeams; i++) {
            this.teams.push({
                workLateTiles: this.totalWorkLateTiles,
                cards: [],
                addCardBoxes: [],
                isPlayerHoldingWorkLate: false
            });
            let keyName = `board${i}`
            this.teams[i].scene = this.game.scene.add(keyName, new teamGameBoard({key: keyName}, this, i), false);
            //this.teams[i].scene = this.game.scene.getScene(keyName);
            this.teams[i].keyName = keyName;
        }

        this.teamToolbar = this.game.scene.add("teamToolbar", new teamToolbar(this), false);

        

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
    }
}