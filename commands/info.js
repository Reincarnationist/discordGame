const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('info')
	.setDescription('Get info about a user or a server!')
	.addSubcommand(subcommand =>
		subcommand
			.setName('user')
			.setDescription('Info about a user')
			.addUserOption(option => option.setName('target').setDescription('The user')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('server')
			.setDescription('Info about the server'))
	.addSubcommand(subcommand =>
		subcommand
			.setName('game')
			.setDescription('Info about the current running game')),

	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
				await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
			} else {
				await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
			}
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
		} else if (interaction.options.getSubcommand() === 'game') {
			const gameInfo = interaction.client.gameInfo
			if(!gameInfo.gamePresence){
				await interaction.reply(`No game exists.`)
			}else{
				const embed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Current Game Infomation')
					.addField(`Max player limit is: `, `${gameInfo.MAX_PLAYER} players.`)
					.addField(`Current, the game has ${gameInfo.playerCount} players`,
					 `They are ${String(gameInfo.players)}`)
					.addField(`Current game mode is: `, `${gameInfo.GAME_MODE}`);
				
				await interaction.reply({ embeds: [embed] });
			}
		}
	
	},
};