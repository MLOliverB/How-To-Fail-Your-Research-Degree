/**
 * What the player will see once the game starts; the board area
 */
 var playerView = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:
        function playerView() {
            Phaser.Scene.call(this, 'playerView');
        },

    create: function () {
            const x = this.cameras.main.centerX;
            const y = this.cameras.main.centerY;
            const displayWidth = this.cameras.main.displayWidth;
            const displayHeight = this.cameras.main.displayHeight;

            // Game board components
            this.add.rectangle(x, y, displayWidth, displayHeight, 0xa9e3ff);    //background
            this.add.rectangle(x, y * 0.83, displayWidth * 0.98, displayHeight * 0.8, 0x3260b5);  //playing board
            this.add.rectangle(x, y * 1.95, displayWidth, displayHeight * 0.2, 0x29379b); //toolbar
            this.add.rectangle(x, y * 1.76, displayWidth * 0.22, displayHeight * 0.2, 0x36d8a2); //card
    }
});