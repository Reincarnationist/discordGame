# I Doubt It

A card game that can be played on a Discord text channel.

## Description

- The core of this game is to guess if others are lying or not.
- The required number of player to start the game is set to 4 right now, and the deck size is set to 52 cards. So, each player will get 13 cards initially.
   - This will get more flexible in next few releases
- It only support one game mode right now which is the "Same Suit" system, details will be explained below.
   - It will has one more game mode which is based on card rank system in the future.
- Game Mode 0:
   - Whoever has the Spades 3 is the first one to play. The player can declare and play an arbitrary number (>=1) of cards with same suit. Declared cards (displayed on the table) can be different from actually playing cards (not displayed), in this case, the player is "cheating".
   - Anyone on the table can doubt the player's cards, if any of them challenges then the actually playing cards will be revealed to see if they match the declared cards.
   - If so, then the challenger fails. He must take all the cards in the card pool and next round starts with the player being challenged.
   - If not, then the player being challenged must take all the cards in the card pool and next round starts with the challenger.
   - If no one challenges then the next player must declare exact number of cards with same suit, and so on.
   - Whoever has no cards on hand wins, the winner can deposit 1 x cards remain on other players' hands coins into the bank.
- Game Mode 1:
   - On the way.

## Commands

All the commands start with a slash ```/```, by typing the command you can see the description on it. More detailed information will be shown below.
Commands avaiable to everyone:
- ```/initGame```: Initiates a new game with game mode 0, allowing players to join. The user typed this command will be the first player on the table, $5 will be withdrawn from his balance for the entering ticket.
- ```/join```: Join an initialized but not active game, you have to pay the $5 ticket here.
- ```startGame```: 




## Getting Started

### Dependencies

* Describe any prerequisites, libraries, OS version, etc., needed before installing program.
* ex. Windows 10

### Installing

* How/where to download your program
* Any modifications needed to be made to files/folders

### Executing program

* How to run the program
* Step-by-step bullets
```
code blocks for commands
```


## Authors

Contributors names and contact info

- Ruizhe (Steven) Yuan 
   - https://www.linkedin.com/in/ruizheyuan/

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release


## Acknowledgments

Inspiration, code snippets, etc.
* [Liars-Poker] https://github.com/eric-lu-VT/Liars-Poker

## Credit
Found the card images in @Raffael#7777's Playing Card Emojis Discord server. Much appreciated!
