const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const cardAddress = require('../cardAddress/playingCards.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('challenge')
		.setDescription('Challenge the current playing cards.'),
	async execute(interaction) {
		const gameInfo = interaction.client.gameInfo
        const user = interaction.user.username
		if(!gameInfo.gameStatus){
            await interaction.reply(`No game is currently running.`)
            return;
        }else if(gameInfo.currentPlayer == user){
            await interaction.reply({ content: `you can't challenge youself.`, ephemeral: true})
            return;
        }else if(!gameInfo.currentDeclaringCards.length){
            await interaction.reply({ content: `you can't challenge as no one has played any card.`, ephemeral: true})
            return;
        }else if(gameInfo.challenged == true){
            await interaction.reply({ content: `you can't challenge twice.`, ephemeral: true})
            return;
        }else{
            gameInfo.played = false
            gameInfo.challenged = true
            if(gameInfo.currentDeclaringCards.toString() == gameInfo.currentPlayingCards.toString()){
                //failed challenge
                for(let c of gameInfo.cardPool){
                    gameInfo.hands[user].push(c)
                }
                gameInfo.hands[user].sort((a,b) => a[1].localeCompare(b[1]))

                await interaction.reply({ 
                content: 
                `Failed! You have to take all the cards in the card pool.\n${gameInfo.cardPool.length} cards go to ${user}'s hand.\nIt's still ${gameInfo.currentPlayer}'s turn.`
                })


                gameInfo.cardPool.length = 0
                gameInfo.previousDeclaringCards.length = 0
                gameInfo.currentDeclaringCards.length = 0
                gameInfo.currentPlayingCards.length = 0
                await interaction.followUp({ content: `Another round for ${gameInfo.currentPlayer}.`,
                                         embeds: [gameInfo.roundInfo()] });

            }else{
                //successful challenged
                for(let c of gameInfo.cardPool){
                    gameInfo.hands[gameInfo.currentPlayer].push(c)
                }
                gameInfo.hands[gameInfo.currentPlayer].sort((a,b) => a[1].localeCompare(b[1]))

                await interaction.reply({ 
                content: 
                `Successful! ${gameInfo.currentPlayer} has to take all the cards in the card pool.\n${gameInfo.cardPool.length} cards go to ${gameInfo.currentPlayer}'s hand.\nIt's ${user}'s turn now.`
                })

                gameInfo.currentPlayer = user
                gameInfo.cardPool.length = 0
                gameInfo.previousDeclaringCards.length = 0
                gameInfo.currentDeclaringCards.length = 0
                gameInfo.currentPlayingCards.length = 0
                await interaction.followUp({ content: `${user}'s round.`,
                                         embeds: [gameInfo.roundInfo()] });
            }
        }
	},
};