const { Formatters } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Shop } = require('../dbObjects.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription(`display the leaderboard`)
        .addStringOption((option) =>
        option
            .setName('type')
            .setDescription("What leaderboard are you looking for?")
            .addChoices([
                ['Balance', 'balance'],
                ['Win Count', 'winCount'],
            ])
            .setRequired(true),
    ),

	async execute(interaction) {
        const gameInfo = interaction.client.gameInfo
        const type = interaction.options.getString('type')
        if(type === 'balance'){
            await interaction.reply(
                {content:
                Formatters.codeBlock(
                    gameInfo.currency.sort((a, b) => b.balance - a.balance)
                        .filter(user => interaction.client.users.cache.has(user.user_id))
                        .first(10)
                        .map((user, position) => `(${position + 1}) ${(interaction.client.users.cache.get(user.user_id).username)}: ${user.balance}💰`)
                        .join('\n'),
                ),ephemeral: true}
            );
        }else if(type === 'winCount'){
            await interaction.reply(
                {content:
                Formatters.codeBlock(
                    gameInfo.currency.sort((a, b) => b.win_count - a.win_count)
                        .filter(user => interaction.client.users.cache.has(user.user_id))
                        .first(10)
                        .map((user, position) => `(${position + 1}) ${(interaction.client.users.cache.get(user.user_id).username)}: ${user.win_count}`)
                        .join('\n'),
                ),ephemeral: true}
            );
        }
        
    }
}