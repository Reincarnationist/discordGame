# I Doubt It

A card game that can be played on a Discord text channel.

## Description

- The core of this game is to guess if others are lying or not.
- The required number of player to start the game is set to 4 right now, and the deck size is upon chosen by whoever initilize the game. So, each player will get number of deck times 13 cards initially.
   - This will get more flexible in next few releases
- It only support one game mode right now which is the "Same Suit" system, details will be explained below.
   - It will has one more game mode which is based on card rank system in the future.
- Game Mode 0:
   - Cards will be displayed as _ACE of Spades(♤), ACE of Hearts(♥), ACE of Diamonds(♢) and ACE of Clubs(♧)_ because the rank does not matter in this mode.
   - The player can declare and play an arbitrary number (>= 1) of cards with same suit. Declared cards' suit (displayed on the table) can be different from actual played cards' (not displayed), in this case, the player is "cheating".
   - Anyone on the table can doubt the player's cards, if any of them challenges then the actual played cards will be revealed to see whether the player cheated or not .
   - If all of the actual played cards' suit match the declared cards' suit, then the challenger fails. He (the challenger) must take all the cards in the card pool and next round starts with the player being challenged.
   - If not, then the player being challenged must take all the cards in the card pool and next round starts with the challenger.
   - If no one challenges then the next player must declare exact number of cards with same suit, and so on.
   - Whoever has no cards on hand and survive the challenge wins, the winner can deposit 1 x cards remaining on other players' hands coins into the bank.
- Game Mode 1:
   - On the way (will be based on card rank system).

## Getting Started

### Dependencies

* Node.js is necessary to run the program, NPM comes with Node.js then you can use npm to install all the dependencies the program needs.
* discord.js, @discordjs/rest, discord-api-types, sequelize, and sqlite3 are mandatory.

### Installing

* How/where to download your program
* Any modifications needed to be made to files/folders

### Executing program
- Inside the folder where you put the code, in the terminal type ```node dbInit.js``` first to initilize the database. 
- Then type ```node deploy-commands.js``` to register commands with your bot. 
- After that type ```node index.js``` to wake up the bot, you can see your bot's status is 'Online' now.

### Currency System
- A simple sqlite database is implemented to make the game more interesting, for example, the currency system, player's inventory, and shop.
- Currency System: Each player has his own bank account which has $300 at the beginning, each game costs $5 and you can gain some while winning. You can use this money to buy items in the shop, they will appear in your inventory and you can apply them during the game like [Pass], some can only be applied at the beginning of the game like [Double].
- You can add your own items by modifying the code since this bot is self-hosted.
### Commands
All the commands start with a slash ```/```, by typing the command you can see the description on it. More detailed information will be shown below. </br>
Commands avaiable to everyone:
#### Game related commands
- ```/initGame [int]```: Initiates a new game with game mode [int], allowing players to join. The user typed this command will be the first player on the table, $5 will be withdrawn from his balance for the entering ticket. (If this is the first time the player joins the game then a $300 initial money will be deposited into his account.)
- ```/join```: Join an initialized but not actively playing game, you have to pay the $5 ticket here. (If this is the first time the player joins the game then a $300 initial money will be deposited into his account.)
- ```/startGame [int]```: Start the game with joined players and clear the deck by giving each player the same amount of cards. A random player will be chosen as the first round player. After using this command, everyone has 10 seconds to use the item 'Double' which can double the money you earn at the end.
   - [int] is the number of deck cards you will be using for this game. 1 means this game uses one deck of card which is 52 cards, 2 means 104 cards.
- ```/hand```: Show the cards you have on the hand right now, this message is only visible to you.
- ```/play (suit dnpsuit)```: This is the command for game mode 0. You have two subcommands to fill, dcardsuit and pcardsuit. They stand for declared card suit and played card suit.
   - Format for dcardsuit is [int],[suit], for example, [3,S] means 3 cards of Spades. (square brackets are not needed while using the command)
   - Format for pcardsuit is the same as dcardsuit, the only difference is you can type more than one [int],[suit] split by space like this [3,S] [1,D] [1,C]. (Again, square brackets are not needed while using the command)
   - Your dcardsuit must have exact same number of card and suit as the current declared cards on the table. For example, if the current declared cards are 5 cards of Clubs then your dcardsuit must be [5,C].
   - pcardsuit can vary from dcardsuit, but the number of cards must match dcardsuit and you must own the card in order to actually play it.
   - If there has no current declared card then the current player is free to play any cards.
   - After the current player plays, other player has 15 seconds to challenge him.
   - If a player has no cards on his hand after he played and [no one challenges him or he survives from the challenge] then he wins.
- ```/challenge```: After a player plays, any of the rest players can challenge him if you think he's cheating. If the cards he plays are illegal accroding to the rule then you win the challenge and he must take all the cards in the card pool and the winner is the player of the next round, vice versa.
   - Whoever gets cards from the card pool will get notified through DM about what cards are they getting.
- ```/giveup```: Give up the current round and take all the cards in the card pool. This command is usually used when you do not have enough card to match the number of current declared cards.
- ```/endgame```: End the current game.
- ```/pass```: Any player can buy this item in the shop and apply it during his round. By using this command, the player does not need to play any card and this round will be skipped, it costs one "Pass" item in the inventory.
- ```/buff```: Apply buffs before game actually starts, you can't do it during the game. The only time you can apply a buff is 10 seconds after using ```/startGame``` command.
- ```/info```: Serval info related commands to show different infomation you want.
#### Database related commands
- ```/shop```: You can browser items that are currently selling in the shop.
- ```/buy```: You can buy items from the shop if you have enough money in your pocket.
- ```/balance```: Check how much do you have right now.
- ```/inventory```: Browser what's in your inventory.
- ```/leaderboard```: You can check who is the richest or who wins the most.
- 
Commands avaiable to Admin only:
- ```/close [user] ```: Close the user's account by deleting him from the database, this removes all the money and items he has.
- ```/manage [user] [action]```: Manage the user's money. (Note: This is not working properly right now.)

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
