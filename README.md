# Team Project

**Project:** How To Fail Your Research Degree - Digitized

**Platform:** Web App with PhaserJS

[*How To Fail Your Research Degree*](http://howtofailyourresearchdegree.com/) is an educational tabletop game by Daisy Abbott which aims to make students aware of the many pitfalls and difficulties that come with working on a research project and prepare them for their own project in a lighthearted and fun context.

With many interactions still taking place online, students find themselves isolated without many opportunities to interact with their peers. The aim of this project is to develop a digital version of *How To Fail Your Research Degree* which allows students to play the game remotely with their peers with the goal of keeping as many positive aspects of the tabletop version while also adding the advantages that come with online games.
  

***For more information visit our [wiki](https://github.com/MLOliverB/How-To-Fail-Your-Research-Degree/wiki).***

  


## Setup Guide
In order to run the game, it must be running on a server. One option for creating a server is using Python.

If Python is not installed, open a command line (you can do this by opening the Windows Start Menu, and typing powershell. It will appear, and run this) and enter python. This will open the Microsoft Store, from where it can be downloaded. When it has finished downloading:

1. Navigate to the downloaded folder, and into folder cs01. 
2. Open a command line (on Windows, File -> Open Windows Powershell).
3. Type python -m http.server 8000 and press enter.
4. Navigate to http://127.0.0.1:8000/game.html in a web browser.



## User Guide

### Pre-game
**Menu Screen:** On start up, the user is presented with a menu screen with two buttons: start game, and options.  
**Options:** Here the facilitator may choose from a set of predefined options:
* The round length
* The number of event cards per round
* The number of work late tiles per team

When finished, they may click back to menu and continue to Start Game, where they select the number of teams playing. The game then commences.

### Interface
At the top of the screen, there are indicators for the: 
* Current stage of the game.
* Team currently playing.
* The time remaining for that turn.
* Button to activate facilitator mode. This then allows the facilitator to click on cards, displaying a message with the idea behind each card on click.

At the bottom of the screen, there is a row of buttons. From left to right:
* Next Team: Switch to the following team. When all teams have taken their turn, it returns to the first team and the next stage.
* Start: Allows the current team to start gameplay, starting the timer also.
* Work Late Tiles: Indicates the number of remaining Work Late Tiles, and allows the user to place one on an already played card.
* New Card Button ( + ): On click, the user receives a new card they must then place.
* Discard: If the current card cannot be played, the user may click this button to discard it.

In addition, there are two to three buttons above the left of this bar:
* Activity Inventory: Displays/hides the inventory of currently held Activity Cards.
* Store Activity: Allows user to store certain Activity Cards.
* Event Inventory: Displays/hides the inventory of currently held Event Cards.

When an event card is picked up, two buttons become visible to the right of the bar:
* Store Event: If possible, stores the Event Card in the Event Inventory.
* Play: Plays the currently held Event Card.

### Gameplay
For each turn:
1. Click the start button, starting the turn.
2. Click the New Card button to receive a new Activity Card to place.
3. Click a Place Card button on the gameboard. If none are visible, click the + to either side of an already played card to create a new valid location.
4. The turn is over when the timer is up, and so click Next Team, and repeat the above.

When all teams have played, the round will iterate. After each team plays in the second round, they will be confronted with an Event Card in the bottom righthand corner. They should click this, read the instructions, and then click the small Play button, or Store Event if the card permits and they so desire. After clicking Play, the player should then fulfil the card's requirements, and click Finish to end their turn. Some cards require the player to add or remove a card. To do this:
 1. Ensure that the toggle to do so is selected (switch from Flip Cards to Add/Remove Cards). 
 2. Click a card, so that it returns to the new card stack.
 3. Click Discard. 

After the final round, the Game Over screen is displayed. The facilitator may click Review The Boards, which then displays each board and allows the facilitator to iterate through them, explaining to the players each.
