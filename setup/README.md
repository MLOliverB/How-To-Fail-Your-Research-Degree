# Setup

This folder contains the files that must be run if you want to independently host the game on your own machine.


## Database of Cards
Created by running `card_database_setup.py`

### Tables and Fields
**Activities**

| Field | Data Type | Description |
|-|-|-|
| id | Integer | Unique reference number |
| stage | Integer | The stage of the game this card is played in. 1=Plan, 2=Context, 3=Implementation, 4=Write Up |
| number | Integer | The number of times this card appears in the deck |
| image | Text | The name of the image file (`something.png`) |
| title | Text | The text displayed on the card |
| description | Text | A description of what the card means |
| placement | Text | 4 numbers separated by commas representing if a card can be placed in the direction. `left,right,up,down` (e.g. `1,0,0,1` means a card can be placed on the left and down directions)|



**Events**

| Field | Data Type | Description |
|-|-|-|
| id | Integer | Unique reference number |
| stage | Integer | The stage of the game this card is played in. 1=Plan, 2=Context, 3=Implementation, 4=Write Up |
| number | Integer | The number of times this card appears in the deck |
| image | Text | The name of the image file (`something.png`) |
| title | Text | The text displayed on the card |
| description | Text | A description of what the card means |
| requirement | Text | The requirements for the card to take effect. `14:2&!2` means that card 14 must appear twice, and card 2 cannot appear |
| effect | Text | The effect of the card. `n-1:3:2` means that three of the cards in stage 2 must be removed (`n/p` = remove or add a card, `a:b:c` a=id of a specific card (-1=not a card), b=number of cards to change, c=stage of card if not a specific card) |
