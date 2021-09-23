const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('start')
	.setDescription('Start the game'),

	async execute(interaction) {
        const gameInfo = interaction.client.gameInfo
        const deck = []

        /* 
          Deck Note:
            Due to the limited number of Discord custom emojis, we can't use all 52 cards.
            Hence, the 'KING' is removed so that the deck contains 48 cards in total.

            Two server boost can increase the number limit from 50 to 100, may add it afterwards.
            You greedy bastard dicord :<

          Update:
            Find a brilliant way to solve the problem! Idea from Eric Lu (https://github.com/eric-lu-VT)
        */

		//filling the deck
		const suits = ['H', 'D', 'C', 'S'];
    	const values = ['1', '2', '3', '4', '5', '6', '7',
						 '8', '9', 'T', 'J', 'Q', 'K'];
 
		for (let suit of suits) {
			for (let value of values) {
                //'1S','TD','QC', 'KH'
				deck.push(value + suit);
			}
		}

		//shuffle the deck
		let numberOfCards = deck.length;  
		for (let i=0; i<numberOfCards; i++) {
			let j = Math.floor(Math.random() * numberOfCards);
			let temp = deck[i];
			deck[i] = deck[j];
			deck[j] = temp;
		}
		gameInfo.deck = deck

        //remember to change the playercount back!!!!
        if(!gameInfo.gamePresence || 
            gameInfo.playerCount != 2 || 
            gameInfo.gameStatus){
            await interaction.reply(`Can't start the game. Check console log please.`)
            console.log(`gamePresence: ${gameInfo.gamePresence}, \nplayerCount: ${gameInfo.playerCount}, \ngameStatus: ${gameInfo.gameStatus}`)
            return;
        }else{
            //clear the table first
            for (let key in gameInfo.hands) {
                  delete gameInfo.hands[key];
              }
            gameInfo.cardPool.length = 0
            gameInfo.currentPlayer = ''
            gameInfo.nextPlayer = ''
            gameInfo.played = false

            //fill players' hands
            for(let i=0; i< gameInfo.players.length;i++){
                gameInfo.hands[gameInfo.players[i]] = deck.slice(i*13,i*13+13).sort()
            }

            //set current player to whom has ACE of Spider
            for (const [key, value] of Object.entries(gameInfo.hands)) {
                if(value.includes('1S')){
                    gameInfo.currentPlayer = key
                    break;
                } 
            }




            //start the game
            //consider not including any emote inside the embed because they are too small
            //use followups to display card infos
            gameInfo.gameStatus = true
            await interaction.reply({ content: `Game starts now! Below is the round info.`,
                                        embeds: [gameInfo.roundInfo()] })

        }
		
		
	},
};