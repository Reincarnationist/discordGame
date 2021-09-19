const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
    .setName('join')
	.setDescription('join an exist game'),

	async execute(interaction) {
        const join_user = interaction.user.username
        const gameInfo = interaction.client.gameInfo
		if(interaction.client.gameInfo.gamePresence == false){
            await interaction.reply(`No game is currently running.`);
            return;
        }else{
            if(interaction.client.gameInfo.playerCount == interaction.client.gameInfo.MAX_PLAYER){
                await interaction.reply(`Game is full`);
                return;
            }else { // less than MAX_PLAYER
                if(gameInfo.players.includes(join_user)){
                    await interaction.reply(`You are already in the game.`);
                    return;
                }else{
                    gameInfo.players.push(join_user)
                    gameInfo.playerCount ++
                    await interaction.reply(`Joined game successfully! Now the game has ${gameInfo.players}.`);
                }
            }
        }
		
	},
};