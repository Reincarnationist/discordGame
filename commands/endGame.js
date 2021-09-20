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
            gameInfo.deck = []
	        gameInfo.players = []
            gameInfo.playerCount = 0
            gameInfo.hands = {}
            gameInfo.cardPool = []
            gameInfo.currentPLayer = null
			await interaction.reply(`End the game now.`)
			return;
		}
	},
};