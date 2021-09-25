const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription(`get user's balance`),

	async execute(interaction) {
        const gameInfo = interaction.client.gameInfo
        const user = interaction.user
		await interaction.reply({content: `${user.username} has ${gameInfo.currency.getBalance(user.id)}💰`,
		ephemeral: true});
	},
};