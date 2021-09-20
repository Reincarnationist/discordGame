const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with server status!'),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('<:b10:889445352313348136> \n <:sS:889445352342687824>')
			.addField('<:diamond_A:889425227300347944>', 'Some value here');

		await interaction.reply({ content: `The bot is alive.`,
									 embeds: [embed] });
	},
};