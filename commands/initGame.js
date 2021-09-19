const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('initgame')
	.setDescription('initialize a new game'),

	async execute(interaction) {
		const deck = []
		const gameInfo = interaction.client.gameInfo
		//filling the deck
		const suits = ['H', 'D', 'C', 'S'];
    	const values = ['ACE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN',
						 'EIGHT', 'NINE', 'TEN', 'JACK', 'QUEEN', 'KING'];
 
		for (let suit in suits) {
			for (let value in values) {
				deck.push(values[value] + "_OF_ " + suits[suit]);
			}
		}

		//shuffle the deck
		let numberOfCards = deck.length;  
		for (var i=0; i<numberOfCards; i++) {
			let j = Math.floor(Math.random() * numberOfCards);
			let temp = deck[i];
			deck[i] = deck[j];
			deck[j] = temp;
		}

		gameInfo.deck = deck
		//set the presence to be alive so that others can join an exist game
		if(!gameInfo.gamePresence){
			gameInfo.gamePresence = true
		}else{
			await interaction.reply(`The Game is already running.`)
			return;
		}

		//add the user who init the game to the player list
		gameInfo.players.push(interaction.user.username)
		gameInfo.playerCount ++

		await interaction.reply(`New game initialize succefully by ${gameInfo.players[0]}, \ntype /join to join the game.`);
	},
};