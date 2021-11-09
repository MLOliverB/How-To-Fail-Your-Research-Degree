# Projection Initiaion Document - How to Fail your Research Degree - CS01

## Rationale 

Due to the recent pandemic causing classes to go online, this project aims to make the tabletop multiplayer game “How to Fail Your Research Degree” more accessible for masters and PhD students by creating a digital version of the product.

This game aims to make students aware of the many pitfalls and difficulties that come with working on a research project and prepare them for their own project. It teaches students how to do research for their thesis by simulating the process of a research project where students can “fail safely” and learn how to overcome certain problems that they could easily encounter in their actual research work with their peers, with the game being conducted by a trained facilitator to give a learning effect to the game and give context to actions as it alone has no real value. This can be useful in introducing the terminology of research to non-native English speakers or novices.

However, as the pandemic has caused a lockdown to happen and classes to go remote, it has become harder for students to have interactions with their peers aside from during classes, and so are left in isolation. As such, this project aims to produce the digital version of this game to expand the reach and impact through online accessibility without the need of any online medium to play the game as a group (e.g. the Tabletop Simulator). Through becoming more accessible to students, they will be able to facilitate communication and build bridges with their peers through this product.

<hr/>

## Objectives and Goals


### Minimum requirements:

*Requirements which must be met in the final product*

- This project will definitely convert the non-digital version of the game to a digital version
- Players must be able to play the game over the internet for free, without needing any prior installation
- The digital version of the game will include all the rules which exist in the non-digital version
- Quality-of-life additions will be made that will allow for less experienced facilitators to host the game.


### Extra Features

*Features requested by the customer which will be added should we finish the multiplayer game before the deadline*

- A tutorial mode which will show the facilitator how to host a game and where to find resources to help them host
- Automated peer review which will highlight incorrect card placement
- Adjustable difficulty levels which will affect how much assistance is given to the players by the computer - for example, highlighting where cards can be placed


### Process

1. We will first create a single-player version, which will contain all the rules from the non-digital game, allowing for the facilitator to familiarise themselves with the game before starting a multiplayer session.
2. After we have confirmed that features in the single-player version work as required, we will convert it to a multiplayer version where players will be able to connect to a game hosted by the facilitator in order to play.
3. If we still have time remaining before the deadline, we will add the extra features.


For a detailed breakdown of the tasks required to complete the project, see section *Project Structure and Timeline*.

<hr/>

## Scoping

The product will be delivered according to the prioritisation of requirements using the MOSCOW Principle:

### MUST: 

- All existing physical game rules will be replicated into the product for the full experience
- The facilitator will be allowed to highlight cards/areas for easier communication with each team during discussion

### SHOULD: 

- While the facilitator is hosting, the process should be streamlined  – for example, they will be able to recall and shuffle decks
- By adding a “Peer Review” button, students can see other teams’ board and provide their opinions on what they think of the board at the end of the game
- For a difficulty customisation, gameplay values should be changed to make it easier or harder depending on how experienced the students are at the game; for example, the timer for the card placing phase could be shorter to make students put down cards based more on their instincts than thinking over it
- Private prompts should be provided to facilitator for better hosting of the game
- A visible timer should be added such that all students have a clearer understanding of how long discussions should be held between peers
- Dialogic learning will be facilitated through specific game mechanics
- Work-late tiles will be in a scaffold placement for easy access
- Should there be any small teams, collaboration should be facilitated within them for a fair game
### COULD:

- Visual interactive feedback could be added to provide visual aid on different objects, such as glowing cards to indicate which card has been chosen to move or place
- “Peer Review” could happen automatically to facilitate discussion between teams and build relationships
- Cards could be highlighted when affected by different events during the event phase
- A game tutorial could be added as an option for either the facilitator or player such that they have a better understanding of how the game is played
- An easy mode could be added to support the player, such as a description and explanation of how each card can be played or why a move is illegal

### WILL NOT:

- There will not be hidden hands of cards; players should be able to see all hands
- Sign in or account creation will not be required to play the game

While not included in the development of the product, related aspects of how the game will be played are taken into consideration. Students will be able to play the game on both the PC and tablet; however, keyboard usage is not necessary as only a simple clicking mechanism is needed. The facilitator can start a game and allow players to join through sending a session link, with the option of adding a password, and they can freely choose to share gameplay analytics such as the number of players and the University name anonymously. Players will not be required to sign in, and they can choose which team to join.

The product will not, however, include a way of communication between players during the game. They can communicate through other methods, such as Zoom or Discord. The development of a mobile interface will also not be considered, due to the mobile screen being too small for players to have a sense of  playing the game with others in person as the physical version is played on a large table with the players surrounding it.

<hr/>

## Assumptions and Constraints

### Parameters

*General requirements which the final product must meet*

- The final game must be free to play over the internet
- The game should not need to be installed, rather the players and the facilitator must be able to access the game without any prior setup or installation
- The game must include all of the game rules which exist in the non-digital version of the game
- The game must be able to be played smoothly even if there are many people playing in a single session
- There must be support to allow for an inexperienced facilitator to host the game, such as having visual guidance on what they should do for each phase of the game

### Constraints

*Restrictions on how the product is developed*

- Any software used should be free or a one-time payment
- There is a set deadline to complete the entire project which cannot be changed
- The timing of our project must be planned around our other classes and assignments in order to ensure that all features are implemented in time

### Roadblocks

*Potential issues that we may encounter and as such must leave extra time for*

- It may take a long time to convert features that work in single-player to multiplayer.
    - This can be overcome through sufficient planning during the single-player development to be able to easily expand the functionality into multiplayer.
- The game must be playable on both a computer and a tablet. The smaller screen size of tablets, as well as the tablets being touch operated must be carefully planned for.
    - Layouts should be planned with smaller screens in mind, or separate screens can be made depending on the screen size of the device.

<hr/>

## Project Plan

The objectives can be divided into two different stages: the singleplayer development stage and the multiplayer development stage.
The singleplayer development encompasses the creation of a fully playable version of ‘How to Fail your Research Degree’ that can be played on a single local machine without implementing any network functionality. The main purpose for this stage is to implement a working game without the added complexity of networking and communication to a remote server which could lead to unwanted behaviour or bugs becoming more likely if this was implemented concurrently. Potential applications could include helping an unexperienced facilitator to walk through the gameplay by themselves to be better prepared for an upcoming multiplayer session. Another potential application could be in a classroom or seminar room with insufficient table space where the game can be projected onto a screen and the different teams and facilitator play by passing a wireless mouse between them.
The multiplayer development stage will then expand on the functionality of the singleplayer game to equip it with client-server communication in order to enable players and the facilitator to play with each other remotely. After this stage, the developed game should fulfil all minimum requirements and possibly expand upon them with additional features.

The game will be created in JavaScript and HTML5 using the PhaserJS framework. PhaserJS is a framework developed specifically for cross-platform browser games. The cross-platform capability will prove useful when adding features to the MVP such as the possibility to play the game on mobile devices with large screens like tablets. During development, all code will be kept centralised on a GitLab repository as a version control system to allow for streamlined development and minimise conflicts between different developers when coding parallelly. After development is completed, the code can then be distributed to other code sharing platforms like GitHub. On the back end, the game will make use of an SQLite database to keep track of game states and resources. As an example, event cards will be stored in the database with a link to the image, card details such as title, card description, and cards that will be affected by the event.

### Minimum Viable Product (MVP)

#### Singleplayer Stage

After the singleplayer stage, the game will essentially function as a stand-in for the tabletop game as a digitized version without offering any remote playing functionality. The game rules will be replicated one-to one by implementing each rule as static game logic using for example generalised JavaScript functions that can act on different categories of events like removing cards from the board unless specific cards are present.
For the singleplayer stage, each player view will be indifferent within the team. Since all players and the facilitator are playing on the same device, there is no need for separate views for each player, instead the views can be handled for each team and the facilitator.
As a change to the rules, since playing on a single device forces this behaviour, each team will play each phase in turn. This means that instead of the activity phase being concurrent, each team will move through the phase individually.
Players will have a single main view with minimal elements to prevent the interface from becoming to overloaded. The majority of the view will be taken up by a top-down display on the activity tiles that the players of the team have played. During the activity phase there will be a timer shown that counts down the time that the players have left to lay down tiles, and an opaque stack from which players can pull new cards to lay down. There will be a constant indicator of the current round and phase of the game along with clear indicators when the round or phase of the game changes. There will be a small space where events cards are held that the players can play out later and a menu to to view the boards of other teams.
An important functionality that will be added will be an option to un-do the placement of the current tile. The purpose of this functionality is to mitigate any imprecise control input which can be common for touch-operated devices like tablets. To still give finality to the placement of tiles, the undo option will only be available for a specific amount of time after the tile has been played and while the team has not pulled the next tile from the stack.
The facilitator view will extend upon the player view. There won’t be a need for an event card holding area, whereas this could be replaced with an info box for when a team could take additional actions, like playing a held event card to mitigate a current event card. Furthermore, the facilitator can use a ‘laser pointer’ to highlight specific cards or tiles to all players along with a functionality to view the boards of the teams individually or to view all game boards as a whole.
The facilitator has control over when to move to the next phase in order to allow for discussion of tiles or backgrounds on the current phase without the game already progressing automatically.


#### Multiplayer Stage

The aim is that the online game will be hosted over the already existing how to fail your research degree website since the deployment is financially restricted.
The client-server communication will be implemented using JavaScript Socket IO, which supports sending and receiving of text strings, most commonly string representations of JavaScript objects (JSON).
The facilitator creates a game session through the server which will allow players to join the session through a link and an optional password. The facilitator specifies the number of teams for the game and can also voluntarily agree to share game analytics like the number of players and the institution name where the session is played. The players will be informed of this decision when joining the session.
Upon joining the session, the players will enter a waiting room where each player can give themselves a name and assign themselves to a team. Since the game is intended to be played with a voice call in parallel, players will be able to resolve any conflicts of joining teams between themselves.
Extending from the functionality from the singleplayer stage, the facilitator can change the view of all players to a specific board or to an overview of all board in order to give explanations or comparisons. The player views will be locked, meaning the players cannot switch to a different view, until the facilitator releases them again. When using the ‘laser pointer’ all players can see in their view what the facilitator is pointing to.
As opposed to the singleplayer stage, the activity and peer-review phases take place concurrently for the multiplayer stage version instead of the teams taking turns. This is possible since each player can have an individual view on their own device. The events phase will still take place in turn for each team as specified in the original game rules to allow players to learn from all events and take part in general discussions through the facilitator.
During the events phase, the event card drawn by a team will be visible to all players with the option to minimize or maximize it. This way, each player will feel more included in the gameplay with them knowing what is currently going on as opposed to only the team that drew the event card being able to see it.


### Possible Extending Features

The functionality and ease of use of the minimum viable product could be further improved by adding more features that are not essential to the gameplay, but could improve the overall experience.
- The role of facilitator can be supported by explanatory text that can be triggered when viewing a specific card that could for example give context to events or explain the meaning or importance of specific activity tiles, like ethics clearance.
- Another level of visual interactive feedback can be added by cards glowing up when they are affected by an event. Different colourings can be used for different meanings like cards to be removed or cards that cancel out the effect of the event.
- Detecting all illegal plays during the activity phase can be ensured through an automatic peer-review that can be used by the facilitator. The facilitator presses a button to highlight all illegal plays that were not yet found and then presses that button again to remove those illegal plays along with any disconnected cards.
- Interesting for both players and facilitator can be a game tutorial, separate for each role, explaining how to play the game and work with the interface for players and facilitators respectively.
- The complexity and difficulty of the gameplay for different experience and skill levels of players can be adjusted by allowing the facilitator to enable options such as highlighting all possible legal moves for a tile during the activity phase.
- To allow for gameplay without a facilitator, all basic actions that a facilitator can take can be automated in order for players to just play for themselves, perhaps in a casual setting.

<hr/>

## Structure & Timeline

Our roles are as follows: While we are all part of the development team, Oliver is the product owner, whose role is to be the primary communicator with the customer. We will be following the scrum model for development, and plan to iterate the role of scrum master between us over each customer meeting. The scrum master will facilitate the customer meetings and ensure all necessary points are addressed in each one.

Our milestones are as follows:
- November 10 - December 1 (3 weeks)
- December 1 - January 19 (7 weeks)
- January 19 - February 16 (4 weeks)
- February 16 - March 23 (5 weeks)

Following is our project backlog for the implementation of features. We have estimated how long each feature will take to implement in working days. For example \<feature\> [2] means we estimate a feature will take two working days, for one person. 

### Main Features

*Singleplayer version with basic rules*

1. Implement a basic menu screen [2]
2. Implement a database for the cards [2]
    - Includes title, category, image, description, placement positions, etc
3. Shuffle all the decks [1.5]
4. Small cards [8]
    - Display a table/placement area
    - Display locations player can add a card
        - As a grid surrounding currently placed cards, in order to give the player somewhere to click to play their current card
        - However, it would intentionally allow invalid moves, which could be pointed out at the end of the round
            - A potential ‘easy mode’ (see extra features) could only show valid places to put new cards
    - Drawing cards from deck
    - Placing cards
    - Moving card between valid positions
    - Discard stack
5. Big cards [16]
    - Draw card from deck
    - Card either has an immediate effect, or can be used by the team at a later point
        - Should pop up, to allow player to read it, and then minimise to a place they can access it again during their turn
        - Apply the effects of the card
            - Team reads through rules on their own, makes a move, and game will evaluate at end of turn
        - Implement inventory to save cards 
        - A way to use saved cards later
    - Separate database for specific rules (store information in a central space) / script to call individual card’s ID (event card object will store rules) / separate structure (some rules will be removed based on event card)
    - Work late tiles, should be in the inventory along with the event cards to be kept
6. Press button to move onto the next player/team (relevant for single screen play, facilitator) [3]
7. At the end of the round, highlight and remove incorrectly placed cards [2]
8. Move onto the next phase (when a button is pressed) [1]
9. After the final round, show the rankings for who won [1]

*Add multiplayer*

10. Facilitator can open a server [16]
    - Start a new session (setting up the game environment, etc.)
        - Can add password
    - Generate link
    - Specify how many teams will be playing and max players per team (recommended 4 teams)
11. Players can join the server [3]
    - Session links + password 
12. Players can join a team [2]

*Special view for facilitator*

13. Facilitator selects a team [2]
    - Can change the views for all teams, and return teams to their own view afterwards
14. Facilitator clicks an area/card which is then highlighted and shown on everyone’s screen [1]
15. Facilitator can exit this view by pressing a button [1]
16. Facilitator can view information about the cards and real life scenarios [1]
    - Hover/click cards for info

### Add extras

*The nice to haves*

17. Facilitator can remove illegal moves played (highlighted red) 
18. Ghost placings by players during discussion
19. Tutorial
20. Easy mode, with additional highlighting
    - For example, only showing players the valid places they can put cards

<hr/>

## Stakeholders

The short term stakeholders are the customer, and us, the developers.

In the long term, the stakeholders are the postgraduate students playing the game, and the game facilitators.

We will communicate with the customer and each other over Microsoft Teams, including video calls.

We will use GitLab as our repository. In addition to the project’s source code, this will include a wiki, for project documentation, and issue tracking for our progress to be tracked. 
