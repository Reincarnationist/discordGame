# I Doubt It

A card game that can be played on a Discord text channel.

## Description

- The core of this game is to guess if others are lying or not.
- The required number of player to start the game is set to 4 right now, and the deck size is upon chosen by whoever initilize the game. So, each player will get number of deck times 13 cards initially.
   - This will get more flexible in next few releases
- It only support one game mode right now which is the "Same Suit" system, details will be explained below.
   - It will has one more game mode which is based on card rank system in the future.
- Game Mode 0:
   - Cards will be displayed as ACE of Spades(♤), ACE of Hearts(♥), ACE of Diamonds(♢) and ACE of Clubs(♧) because the rank does not matter in this mode.
   - The player can declare and play an arbitrary number (>= 1) of cards with same suit. Declared cards' suit (displayed on the table) can be different from actual played cards' (not displayed), in this case, the player is "cheating".
   - Anyone on the table can doubt the player's cards, if any of them challenges then the actual played cards will be revealed to see whether the player cheated or not .
   - If all of the actual played card's suit match the declared card's suit, then the challenger fails. He (the challenger) must take all the cards in the card pool and next round starts with the player being challenged.
   - If not, then the player being challenged must take all the cards in the card pool and next round starts with the challenger.
   - If no one challenges then the next player must declare exact number of cards with same suit, and so on.
   - Whoever has no cards on hand and survive the challenge wins, the winner can deposit 1 x cards remaining on other players' hands coins into the bank.
- Game Mode 1:
   - On the way (will be based on card rank system).

## Getting Started

### Dependencies

* Node.js is necessary to run the program, NPM comes with Node.js then you can use npm to install all the dependencies the program needs.
* discord.js, @discordjs/rest, discord-api-types, sequelize, and sqlite3 are mandatory.
* 

### Installing

* How/where to download your program
* Any modifications needed to be made to files/folders

### Executing program

All the commands start with a slash ```/```, by typing the command you can see the description on it. More detailed information will be shown below. </br>
Commands avaiable to everyone:
- ```/initGame```: Initiates a new game with game mode 0, allowing players to join. The user typed this command will be the first player on the table, $5 will be withdrawn from his balance for the entering ticket. (If this is the first time the player joins the game then a $300 initial money will be deposited into his account.)
- ```/join```: Join an initialized but not actively playing game, you have to pay the $5 ticket here. (If this is the first time the player joins the game then a $300 initial money will be deposited into his account.)
- ```startGame```: 


## Authors

Contributors names and contact info

- Ruizhe (Steven) Yuan 
   - https://www.linkedin.com/in/ruizheyuan/

## Version History

* 0.2
    * Various bug fixes and optimizations
    * added bank system
* 0.1
    * Initial Release


## Acknowledgments

Inspiration, code snippets, etc.
* [Liars-Poker] https://github.com/eric-lu-VT/Liars-Poker

## Credit
Found the card images in @Raffael#7777's Playing Card Emojis Discord server. Much appreciated!
