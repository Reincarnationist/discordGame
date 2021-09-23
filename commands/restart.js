const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('restart')
	.setDescription('Restart the game, type /start to begin a new game.'),

	async execute(interaction) {
		const gameInfo = interaction.client.gameInfo
		if(!gameInfo.gamePresence || !gameInfo.gameStatus){
			await interaction.reply(`The Game is either not running or not exist.`)
		}else{
            gameInfo.gameStatus = false
			gameInfo.played = false
            gameInfo.deck.length = 0
            gameInfo.cardPool.length = 0
            gameInfo.currentPLayer = ''
			gameInfo.nextPLayer = ''
			for (let key in gameInfo.hands) {
				delete gameInfo.hands[key];
			}
			await interaction.reply(`Restart the game now.`)
			return;
		}
	},
};