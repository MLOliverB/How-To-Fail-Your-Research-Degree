# TO DO
**DELETE THIS FILE WHEN MERGING WITH MAIN!!!**


For implementing activity cards, aka all issues linked to [issue 28](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs01/cs01-main/-/issues/28)

**Display playable locations on game board**
- Choose a way to track the cards which have been placed (a list for fast inserts? read up on JS data structs)
- Design the rectangles that will be displayed (card placement locations and add new location between cards)

**Drawing tiles from current deck**
- Draw a card from the deck (is the deck already shuffled? If yes, then just draw from top, otherwise randomly select)

**Tile placement on board**
- Begin with one placement location in the middle of the row
- On click on a card location, card gets placed in the location
- Then update so there is one blank card location on the outer edges
- Once there is more than 1 card, display the "add card location" button between cards
- Also need a way to be able to remove an added card location (maybe right click?)

**Moving cards between valid positions**
- This can only be done on the first stage
- Click a card to pick it up (removes the place location from array)
- Place it in the same way as with cards picked up from the deck

**Discard stack**
- Discard a card that can't be played
- Bring up an error message if a player tries to discard a card that could be played
