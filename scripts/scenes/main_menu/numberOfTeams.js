var numberOfTeams = new Phaser.Class({
    Extends: Phaser.Scene,
    
    initialize: function() {
        Phaser.Scene.call(this, "numberOfTeams");
    },

    create: function () {
        this.add.text(10, 50, 'How many teams are playing?', { font: '30px Courier', fill: '#29379b' });
        this.add.text(10, 100, "Two teams", {font: "20px Courier", fill: "#3260b5"}).setInteractive().on("pointerdown", () => this.scene.start('playerView'));
        this.add.text(10, 145, "Three teams", {font: "20px Courier", fill: "#3260b5"}).setInteractive().on("pointerdown", () => this.scene.start('playerView'));
        this.add.text(10, 190, "Four teams", {font: "20px Courier", fill: "#3260b5"}).setInteractive().on("pointerdown", () => this.scene.start('playerView'));
    }
});
