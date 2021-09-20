const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('initgame')
	.setDescription('initialize a new game'),

	async execute(interaction) {
		const gameInfo = interaction.client.gameInfo
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