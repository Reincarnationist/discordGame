const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const cardAddress = require('../cardAddress/playingCards.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with server status!'),
	async execute(interaction) {
		
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Game Info')
			.addField('card pool', 'hi');

		await interaction.reply({ content: `The bot is alive.`,
									 embeds: [embed] });
	},
};