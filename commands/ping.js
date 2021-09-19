const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with server status!'),
	async execute(interaction) {
		//interaction.client.gameInfo.gameStatus = true
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');
			
		await interaction.reply({ content: `The bot is alive and ${interaction.client.gameInfo.gameStatus}.`,
									 embeds: [embed] });
	},
};