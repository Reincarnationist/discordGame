const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with server status and ping!'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(`The bot is alive.\nRoundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};