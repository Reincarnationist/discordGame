const { Formatters } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Shop } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription(`display items in the shop`),

	async execute(interaction) {
        const items = await Shop.findAll();
        await interaction.reply({content: Formatters.codeBlock(items.map(i => `${i.name}: ${i.cost}💰`).join('\n')),ephemeral: true});
    }
}