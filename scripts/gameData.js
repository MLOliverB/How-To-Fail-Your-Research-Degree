import { loadAllCardsPromise } from "./cards-management";

export default class GameData {
    constructor() {
        this.cardMap = new Map();
        this.cardMap.set(0, null);

        let cardsPromise = await loadAllCardsPromise();
        for (let i = 0; i < cardsPromise.length; i++) {
            this.cardMap.set(cardsPromise[i].id, cardsPromise[i]);
        }

        this.stage = 0;
        this.numberofTeams = 2;             // TODO: get this to recieve numberOfTeams from start menu!
        this.currentTeam = -1;

        this.roundLength = 30;              // The maximum length of each round in seconds (TODO: get this from menu)
        this.totalWorkLateTiles = 4         // The number of work late tiles each team starts with (TODO: get number of work late tiles from menu)

        this.teams = [];           // 1D-array of scenes displaying the game boards of each team
    }
}