const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('quit')
	.setDescription('quit an existing game'),

	async execute(interaction) {
        const user = interaction.user.username
        const gameInfo = interaction.client.gameInfo
		if(gameInfo.gamePresence == false){
            await interaction.reply(`No game is currently running.`);
            return;
        }else{
            if(!gameInfo.players.includes(user)){
                await interaction.reply(`You are not in the game.`);
                return;
            }else{
                gameInfo.players.splice(gameInfo.players.indexOf(user), 1)
                gameInfo.playerCount --
                await interaction.reply(`Left game successfully!\nNow the game has ${gameInfo.playerCount} players. \nThey are: ${gameInfo.players}`);
            }
            
        }
		
	},
};