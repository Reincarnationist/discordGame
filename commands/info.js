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
			.setDescription('Info about the current running game'))
	.addSubcommand(subcommand =>
		subcommand
			.setName('round')
			.setDescription('Info about the current round'))
	.addSubcommand(subcommand =>
		subcommand
			.setName('rules')
			.setDescription('Info about how to play the game')),

	async execute(interaction) {
		const gameInfo = interaction.client.gameInfo
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
			if(!gameInfo.gamePresence){
				await interaction.reply(`No game exists.`)
				return;
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
		} else if (interaction.options.getSubcommand() === 'round'){
			if(!gameInfo.gameStatus){
				await interaction.reply(`No game is currently running.`)
				return;
			}else{
				await interaction.reply({ embeds: [gameInfo.roundInfo()], ephemeral: true });
			}

		} else if (interaction.options.getSubcommand() === 'rules'){
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`I Doubt It`)
				.setURL('https://github.com/Reincarnationist/discordGame/')
				.setDescription('manual of how to play with this bot')
				.addFields(
					{ name: 'GAME_MODE 0 Rules', 
					value: 'The first player plays 1 or many same suit cards then the next player needs to play exact number of same suit cards.\n You can cheat of course, whoever has no cards on his hand wins.' },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'GAME_MODE 1 Rules',
					 value: 'The first player plays a random number of random rank cards then the next player needs to either play a larger number of same rank cards or higher rank card.' },
				)
				await interaction.reply({ embeds: [embed], ephemeral: true });
		}
	
	},
};