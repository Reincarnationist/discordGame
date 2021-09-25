const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('endgame')
	.setDescription('End the game'),

	async execute(interaction) {
		const gameInfo = interaction.client.gameInfo
		if(!gameInfo.gamePresence || !gameInfo.gameStatus){
			await interaction.reply(`The Game is either not running or not exist.`)
		}else{
            gameInfo.gamePresence = false
            gameInfo.gameStatus = false
			gameInfo.played = false
			gameInfo.challenged = false
            gameInfo.deck.length = 0
	        gameInfo.players.length = 0
            gameInfo.playerCount = 0
            gameInfo.cardPool.length = 0
			gameInfo.previousDeclaringCards.length = 0
			gameInfo.currentDeclaringCards.length = 0
            gameInfo.currentPlayingCards.length = 0
            gameInfo.currentPLayer = ''
			gameInfo.nextPLayer = ''
			for (let key in gameInfo.hands) {
				delete gameInfo.hands[key];
			}
			for (let key in gameInfo.double) {
				delete gameInfo.double[key];
			}
			await interaction.reply(`End the game now.`)
			return;
		}
	},
};