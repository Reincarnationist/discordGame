const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveup')
		.setDescription(`give up the current round and take all the cards in the card pool.`),
	async execute(interaction) {
        const gameInfo = interaction.client.gameInfo
        const commandUser = interaction.user
        if(!gameInfo.gameStatus){
            await interaction.reply(`No game is currently running.`)
            return;
        }else if(gameInfo.currentPlayer != commandUser.username){
            await interaction.reply({ content: `It's not your turn yet.`, ephemeral: true})
            return;
        }else{
            interaction.client.users.fetch(interaction.user.id, false).then((user) => {
                user.send(`Poor guy, here is the cards that is going to be added into your hand: ${String(gameInfo.cardPool)}.`)
            })
            for(let c of gameInfo.cardPool){
                gameInfo.hands[commandUser.username].push(c)
            }
            await interaction.reply(`${commandUser.username} has given up, he has to take all the cards in the card pool.\nPoor Guy.`)
            gameInfo.cardPool.length = 0
            gameInfo.previousDeclaringCards.length = 0
            gameInfo.resetDPCardArray(gameInfo)
            gameInfo.playedOnce = true
            gameInfo.currentPlayer = gameInfo.nextPlayer
            await interaction.followUp({ content: `Another round for ${gameInfo.currentPlayer}.`,
                                    embeds: [gameInfo.roundInfo()] });
        }
            
        
		
	},
};