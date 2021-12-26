var playerView = new Phaser.Class({
    Extends: Phaser.Scene,
    
    initialize: function() {
        Phaser.Scene.call(this, "playerView");
    },

    create: function () {
        var x = this.cameras.main.centerX;
        var y = this.cameras.main.centerY;
        var width = this.cameras.main.displayWidth;
        var height = this.cameras.main.displayHeight;
        
        // Game board components
        this.add.rectangle(x,y,width,height,0xede0d4);    //background
        this.add.rectangle(x,y*0.77,width*0.98,height*0.75,0xf4a261);  //playing board
        this.add.rectangle(x,y*1.95,width,height*0.2,0x023047); //toolbar
        this.add.rectangle(x,y*1.76,width*0.22,height*0.2,0xe76f51); //card
    
        // Small card components
        function placeCard() {
            console.log("Place card");
    		placeCardButton.setFillStyle(0xed5e5e);
    		this.has_card = true;
        }
        var placeCardButton = this.add.rectangle(x,y*1.2,width*0.19,height*0.18,0xb1cfe0);
        this.add.text(x, y*1.2, 'Place Card', {color: "0x000000"}).setOrigin(0.5);
        placeCardButton.setInteractive();
        placeCardButton.on("pointerover", () => {placeCardButton.setFillStyle(0x6c95b7);});
        placeCardButton.on("pointerout", () => {placeCardButton.setFillStyle(0xb1cfe0);});
        placeCardButton.on("pointerup", () => placeCard());
        
        function addBox() {
            console.log("Add a card box");
            addPlaceCardButton.setFillStyle(0xed5e5e);
        }
        var addPlaceCardButton = this.add.rectangle(x+x*0.25,y*1.2,width*0.04,height*0.18,0xb1cfe0);
        this.add.text(x+x*0.25, y*1.2, '+', {color: "0x000000"}).setOrigin(0.5);
        addPlaceCardButton.setInteractive();
        addPlaceCardButton.on("pointerover", () => {addPlaceCardButton.setFillStyle(0x6c95b7);});
        addPlaceCardButton.on("pointerout", () => {addPlaceCardButton.setFillStyle(0xb1cfe0);});
        addPlaceCardButton.on("pointerup", () => addBox());
    }

});
